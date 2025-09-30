import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isOpenSubject = new BehaviorSubject<boolean>(false); // Inicia fechado
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  
  public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  public isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();

  /**
   * Alterna o estado do sidebar (aberto/fechado)
   */
  toggle(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  /**
   * Abre o sidebar
   */
  open(): void {
    this.isOpenSubject.next(true);
  }

  /**
   * Fecha o sidebar
   */
  close(): void {
    this.isOpenSubject.next(false);
  }

  /**
   * Define o estado do sidebar
   * @param isOpen - true para abrir, false para fechar
   */
  setIsOpen(isOpen: boolean): void {
    this.isOpenSubject.next(isOpen);
  }

  /**
   * Retorna o estado atual do sidebar
   * @returns true se estiver aberto, false se fechado
   */
  isOpen(): boolean {
    return this.isOpenSubject.value;
  }

  /**
   * Define se está em modo mobile
   * @param isMobile - true se for mobile
   */
  setIsMobile(isMobile: boolean): void {
    this.isMobileSubject.next(isMobile);
    
    // Em mobile, fecha o sidebar por padrão
    if (isMobile) {
      this.close();
    }
  }

  /**
   * Retorna se está em modo mobile
   */
  isMobile(): boolean {
    return this.isMobileSubject.value;
  }

  /**
   * Fecha o sidebar automaticamente se estiver em modo mobile
   * Útil para fechar o menu após navegar
   */
  closeIfMobile(): void {
    if (this.isMobile()) {
      this.close();
    }
  }
}
