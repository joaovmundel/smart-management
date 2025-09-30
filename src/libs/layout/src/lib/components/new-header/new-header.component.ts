import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../services/title.service';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

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

  // Propriedades reativas
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

  /**
   * Alterna o estado do sidebar
   */
  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
