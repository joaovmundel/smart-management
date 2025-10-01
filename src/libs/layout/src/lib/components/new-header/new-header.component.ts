import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'lib-new-header',
  templateUrl: './new-header.component.html',
  styleUrls: ['./new-header.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NewHeaderComponent implements OnInit, OnDestroy {
  @Input() title = '';

  public currentTitle = '';
  private titleSubscription?: Subscription;
  private readonly sidebarService = inject(SidebarService);

  isOpen$ = this.sidebarService.isOpen$;

  constructor(private titleService: TitleService) {}

  ngOnInit(): void {
    if (this.title) {
      this.currentTitle = this.title;
      this.titleService.setTitle(this.title);
    } else {
      this.titleSubscription = this.titleService.title$.subscribe(
        (title) => (this.currentTitle = title)
      );
    }
  }

  ngOnDestroy(): void {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
