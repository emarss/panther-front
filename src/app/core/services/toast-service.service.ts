import { Injectable } from '@angular/core';
import { ToastInfo } from '../interfaces/toast-info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  private show(toast: ToastInfo) {
    this.toasts.push(toast);
  }

  showSuccess(message: string, header: string = 'Success', delayTime: number = 10000) {
    this.toasts.push({ header: header, body: message, delay: delayTime, class: 'text-success' });
  }

  showError(message: string, header: string = 'Error', delayTime: number = 10000) {
    this.toasts.push({ header: header, body: message, delay: delayTime, class: 'text-danger' });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
