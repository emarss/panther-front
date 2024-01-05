import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast-service.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  constructor(private toastService: ToastService) { }


  public showNotificationForHttpError(error: HttpErrorResponse): void {
    if (error.status === 422) {
      this.toastService.showError(error.error.message, 'Validation Error')
      return;
    }

    if (error.status === 500) {
      this.toastService.showError('An error occurred at the server. Please, refresh the page and try again or contact support for assistance.', 'Server Error')
      return;
    }

    this.toastService.showError('An error occurred. Please, refresh the page and try again or contact support for assistance.', 'Error')
    return;
  }

  private playSound(name = "tone-1.mp3") {
    let audio = new Audio();
    audio.src = "../../../assets/sounds/" + name;
    audio.load();
    audio.play();
  }

  playSoundNotification() {
    this.playSound();
  }
}
