import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent {
  @Input() public progress?: number;
  @Input() public status?: String = 'Please, wait!';
  @Input() public showProgress: boolean = false;
  @Input() public showStatus: boolean = false;
}
