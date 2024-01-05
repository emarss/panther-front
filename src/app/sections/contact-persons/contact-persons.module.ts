import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactPersonsRoutingModule } from './contact-persons-routing.module';
import { ShowComponent } from './show/show.component';
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ShowComponent, IndexComponent, FormComponent],
  imports: [CommonModule, SharedModule, ContactPersonsRoutingModule],
})
export class ContactPersonsModule {}
