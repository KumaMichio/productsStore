import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private toastsSubject = new Subject<ToastMessage>();
  toasts$ = this.toastsSubject.asObservable();

  show(text: string, type: ToastType = 'success'): void {
    this.toastsSubject.next({ id: ++this.counter, text, type });
  }
  success(text: string): void { this.show(text, 'success'); }
  error(text: string): void { this.show(text, 'error'); }
  info(text: string): void { this.show(text, 'info'); }
}
