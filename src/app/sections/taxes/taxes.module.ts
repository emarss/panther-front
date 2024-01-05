import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxesRoutingModule } from './taxes-routing.module';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { DetailsComponent } from './details/details.component';
import { StatementComponent } from './statement/statement.component';
import { TaxShowMenuComponent } from './tax-show-menu/tax-show-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddTaxModalComponent } from './add-tax-modal/add-tax-modal.component';

@NgModule({
  declarations: [
    FormComponent,
    IndexComponent,
    ShowComponent,
    DetailsComponent,
    StatementComponent,
    TaxShowMenuComponent,
    AddTaxModalComponent,
  ],
  imports: [CommonModule, SharedModule, TaxesRoutingModule],
})
export class TaxesModule {}
