import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ShowComponent],
  imports: [CommonModule, SettingsRoutingModule, SharedModule],
})
export class SettingsModule {}
