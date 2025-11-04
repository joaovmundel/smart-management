import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ProfilePageComponent } from './profile-page.component';
import { ProfileService } from '../../services/profile.service';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let profileService: { getUserProfile: jest.Mock; updateUserProfile: jest.Mock };

  beforeEach(async () => {
    const spy = {
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ProfilePageComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ProfileService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    profileService = TestBed.inject(ProfileService) as { getUserProfile: jest.Mock; updateUserProfile: jest.Mock };
  });

  it('should create', () => {
    profileService.getUserProfile.mockReturnValue(of({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      company: null
    }));

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      company: null
    };

    profileService.getUserProfile.mockReturnValue(of(mockUser));

    fixture.detectChanges();

    expect(profileService.getUserProfile).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
    expect(component.profileForm.value.name).toBe(mockUser.name);
    expect(component.profileForm.value.email).toBe(mockUser.email);
    expect(component.profileForm.value.phone).toBe(mockUser.phone);
  });

  it('should toggle edit mode', () => {
    expect(component.editing).toBeFalsy();

    component.toggleEdit();
    expect(component.editing).toBeTruthy();

    component.toggleEdit();
    expect(component.editing).toBeFalsy();
  });

  it('should submit form when valid', () => {
    const mockUser = {
      id: '1',
      name: 'Updated User',
      email: 'updated@example.com',
      phone: '+1234567890',
      company: null
    };

    profileService.getUserProfile.mockReturnValue(of({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      company: null
    }));
    profileService.updateUserProfile.mockReturnValue(of(mockUser));

    fixture.detectChanges();

    component.profileForm.patchValue({
      name: 'Updated User',
      email: 'updated@example.com',
      phone: '+1234567890'
    });

    component.onSubmit();

    expect(profileService.updateUserProfile).toHaveBeenCalledWith({
      name: 'Updated User',
      email: 'updated@example.com',
      phone: '+1234567890'
    });
  });
});