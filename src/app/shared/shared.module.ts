import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { AcIconArrowDownComponent } from './ac-icon-arrow-down/ac-icon-arrow-down.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicSelectComponent } from './basic-select/basic-select.component';
import { AcIconArrowRightComponent } from './ac-icon-arrow-right/ac-icon-arrow-right.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { PaginationSelectComponent } from './pagination-select/pagination-select.component';
import { SafePipe } from '../core/pipes/safe.pipe';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { OptionalLabelComponent } from './optional-label/optional-label.component';
import { ContentModalComponent } from './content-modal/content-modal.component';
import { CustomMultiSelectComponent } from './custom-multi-select/custom-multi-select.component';
import { TruncatePipe } from '../core/pipes/truncate.pipe';
import { DateAgoPipe } from '../core/pipes/date-ago.pipe';
import { LineBreakReplacePipe } from '../core/pipes/line-break-replace.pipe';
import { PageLoadingOverlayComponent } from './page-loading-overlay/page-loading-overlay.component';
import { LoadingGifImageComponent } from './loading-gif-image/loading-gif-image.component';
import { MarkdownPipe } from '../core/pipes/markdown.pipe';
import { PermissionDirective } from '../core/directives/permission.directive';
import { ExchangeRatePermissionDirective } from '../core/directives/exchange-rate-permission.directive';
import { ExchangeRateFlatDirective } from '../core/directives/exchange-rate-flat.directive';
import { DefaultCurrencyPipe } from '../core/pipes/default-currency.pipe';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { LoadingOverlayFullComponent } from './loading-overlay-full/loading-overlay-full.component';
import { GuestHeaderComponent } from './guest-header/guest-header.component';
import { ExchangeRateFieldComponent } from './exchange-rate-field/exchange-rate-field.component';
import { SplitByCapitalPipe } from '../core/pipes/split-by-capital.pipe';
import { FilterAndSortActionButtonsComponent } from './filter-and-sort-action-buttons/filter-and-sort-action-buttons.component';
import { ToastComponent } from './toast/toast.component';
import { ConvertedFromDefaultCurrencyComponent } from './converted-from-default-currency/converted-from-default-currency.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { TermsModalComponent } from './terms-modal/terms-modal.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CustomTaxSelectComponent } from './custom-tax-select/custom-tax-select.component';


@NgModule({
  declarations: [
    CustomSelectComponent,
    AcIconArrowDownComponent,
    BasicSelectComponent,
    AcIconArrowRightComponent,
    ValidationMessageComponent,
    MessageModalComponent,
    LoadingOverlayComponent,
    PaginationSelectComponent,
    SafePipe,
    PermissionDirective,
    ExchangeRatePermissionDirective,
    ExchangeRateFlatDirective,
    DefaultCurrencyPipe,
    TruncatePipe,
    MarkdownPipe,
    DateAgoPipe,
    SplitByCapitalPipe,
    LineBreakReplacePipe,
    ConfirmModalComponent,
    OptionalLabelComponent,
    ContentModalComponent,
    CustomMultiSelectComponent,
    PageLoadingOverlayComponent,
    LoadingGifImageComponent,
    LoadingModalComponent,
    GuestHeaderComponent,
    LoadingOverlayFullComponent,
    ExchangeRateFieldComponent,
    FilterAndSortActionButtonsComponent,
    ToastComponent,
    ConvertedFromDefaultCurrencyComponent,
    SpinnerComponent,
    TermsModalComponent,
    CustomTaxSelectComponent
  ],

  imports: [CommonModule, NgbModule, FormsModule, NgxExtendedPdfViewerModule],

  exports: [
    NgbModule,
    CustomSelectComponent,
    CustomTaxSelectComponent,
    BasicSelectComponent,
    AcIconArrowDownComponent,
    ValidationMessageComponent,
    LoadingOverlayComponent,
    FormsModule,
    TruncatePipe,
    MarkdownPipe,
    SafePipe,
    SplitByCapitalPipe,
    LineBreakReplacePipe,
    DateAgoPipe,
    PermissionDirective,
    ExchangeRatePermissionDirective,
    ExchangeRateFlatDirective,
    DefaultCurrencyPipe,
    ReactiveFormsModule,
    ToastComponent,
    PaginationSelectComponent,
    OptionalLabelComponent,
    ContentModalComponent,
    CustomMultiSelectComponent,
    LoadingGifImageComponent,
    ConvertedFromDefaultCurrencyComponent,
    PageLoadingOverlayComponent,
    LoadingModalComponent,
    GuestHeaderComponent,
    LoadingOverlayFullComponent,
    FilterAndSortActionButtonsComponent,
    ExchangeRateFieldComponent,
    TermsModalComponent,
    SpinnerComponent,
    NgxExtendedPdfViewerModule
  ],
})
export class SharedModule { }
