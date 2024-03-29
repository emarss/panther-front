import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { SchoolGuardService } from '../core/services/school-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'static',
    loadChildren: () =>
      import('./static/static.module').then((m) => m.StaticModule),
  },
  {
    path: 'help/help',
    loadChildren: () => import('./help/help.module').then((m) => m.HelpModule),
  },
  {
    path: 'administration/users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'administration/taxes',
    loadChildren: () =>
      import('./taxes/taxes.module').then((m) => m.TaxesModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'inventory/items',
    loadChildren: () =>
      import('./items/items.module').then((m) => m.ItemsModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'inventory/purchase-orders',
    loadChildren: () =>
      import('./purchase-orders/purchase-orders.module').then(
        (m) => m.PurchaseOrdersModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'inventory/stock-issues',
    loadChildren: () =>
      import('./stock-issues/stock-issues.module').then(
        (m) => m.StockIssuesModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'inventory/stock-adjustments',
    loadChildren: () =>
      import('./stock-adjustments/stock-adjustments.module').then(
        (m) => m.StockAdjustmentsModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'inventory/stock-returns',
    loadChildren: () =>
      import('./stock-returns/stock-returns.module').then(
        (m) => m.StockReturnsModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'financials/payments',
    loadChildren: () =>
      import('./payments/payments.module').then((m) => m.PaymentsModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'notifications/notifications',
    loadChildren: () =>
      import('./notifications/notifications.module').then(
        (m) => m.NotificationsModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'financials/receipts',
    loadChildren: () =>
      import('./receipts/receipts.module').then((m) => m.ReceiptsModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'financials/deposits',
    loadChildren: () =>
      import('./deposits/deposits.module').then((m) => m.DepositsModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'financials/withdrawals',
    loadChildren: () =>
      import('./withdrawals/withdrawals.module').then(
        (m) => m.WithdrawalsModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'people/contact-persons',
    loadChildren: () =>
      import('./contact-persons/contact-persons.module').then(
        (m) => m.ContactPersonsModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'people/suppliers',
    loadChildren: () =>
      import('./suppliers/suppliers.module').then((m) => m.SuppliersModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'administration/accounts',
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'settings/show',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'administration/item-groups',
    loadChildren: () =>
      import('./item-groups/item-groups.module').then(
        (m) => m.ItemGroupsModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'administration/bank-accounts',
    loadChildren: () =>
      import('./bank-accounts/bank-accounts.module').then(
        (m) => m.BankAccountsModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  },
  {
    path: 'administration/unit-of-measures',
    loadChildren: () =>
      import('./unit-of-measures/unit-of-measures.module').then(
        (m) => m.UnitOfMeasuresModule
      ),
    canActivate: [AuthGuardService, SchoolGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class SectionsRoutingModule {}
