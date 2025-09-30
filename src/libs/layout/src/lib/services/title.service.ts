import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private titleSubject = new BehaviorSubject<string>('Smart Management');
  public title$: Observable<string> = this.titleSubject.asObservable();

  setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  getTitle(): string {
    return this.titleSubject.value;
  }
}