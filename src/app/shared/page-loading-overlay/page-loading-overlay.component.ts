import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-loading-overlay',
  templateUrl: './page-loading-overlay.component.html',
  styleUrls: ['./page-loading-overlay.component.scss']
})
export class PageLoadingOverlayComponent {
  @Input()
  showMenu = false;

}
