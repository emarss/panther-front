import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  public subject = new BehaviorSubject<any>(false);

  constructor(private modalService: NgbModal) { }

  public showConfirmDialog(data: ConfirmData): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, { 'centered': true });
    modalRef.componentInstance.title = data.title;
    modalRef.componentInstance.message = data.message;
    modalRef.componentInstance.action = data.action;
    modalRef.componentInstance.actionText = data.actionText;
    modalRef.componentInstance.actionBtnClass = data.actionBtnClass;
  }
}

interface ConfirmData {
  title: string;
  message: string;
  action: Function;
  actionText: string;
  actionBtnClass: string;
}
