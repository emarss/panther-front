import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TermsComponent, PrivacyComponent],
  imports: [CommonModule, SharedModule, StaticRoutingModule],
})
export class StaticModule {}
