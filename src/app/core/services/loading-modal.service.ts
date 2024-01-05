import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoadingModalComponent } from 'src/app/shared/loading-modal/loading-modal.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingModalService {
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  public showLoadingModal(content: string): void {
    this.modalRef = this.modalService.open(LoadingModalComponent, {
      centered: true,
    });
    this.modalRef.componentInstance.content = content;

  }


  public closeLoadingModal(): void {
    this.modalRef?.dismiss();
  }
}
