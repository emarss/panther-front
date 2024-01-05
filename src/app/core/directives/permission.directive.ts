import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {

  @Input() permissionArray!: Array<Array<any>>;

  constructor(private elementRef: ElementRef, private permissionService: PermissionService) {
  }

  ngOnInit() {
    if (this.permissionArray.every((perm) => this.permissionService.checkPermissionsForSection(perm[0], perm[1]) === false)) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}

