import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  title: string = "Title";
  message: string = "Message";
  actionText: string = "Okay";
  actionBtnClass: string = '';
  action: Function = () => { };


  constructor(public activeModal: NgbActiveModal) {

  }
}
