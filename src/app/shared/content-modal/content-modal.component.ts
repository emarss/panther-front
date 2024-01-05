import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-content-modal',
  templateUrl: './content-modal.component.html',
  styleUrls: ['./content-modal.component.scss']
})
export class ContentModalComponent {
  title: string = "Title";
  content: string = "Content";

  childClass: string = "";


  constructor(public activeModal: NgbActiveModal) {

  }
}
