import { Component } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  constructor(public toastService: ToastService) { }
}
