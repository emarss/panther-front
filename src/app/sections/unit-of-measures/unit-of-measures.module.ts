import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitOfMeasuresRoutingModule } from './unit-of-measures-routing.module';
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../shared/shared.module';
import { AddUnitOfMeasureModalComponent } from './add-unit-of-measure-modal/add-unit-of-measure-modal.component';

@NgModule({
  declarations: [IndexComponent, FormComponent, ShowComponent, AddUnitOfMeasureModalComponent],
  imports: [CommonModule, SharedModule, UnitOfMeasuresRoutingModule],
})
export class UnitOfMeasuresModule {}
