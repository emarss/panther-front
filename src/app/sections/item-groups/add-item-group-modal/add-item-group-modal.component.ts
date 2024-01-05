import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ItemGroupService } from 'src/app/core/services/item-group.service';
import { ItemGroup } from 'src/app/core/models/item-group';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-add-item-group-modal',
  templateUrl: './add-item-group-modal.component.html',
  styleUrls: ['./add-item-group-modal.component.scss'],
})
export class AddItemGroupModalComponent {
  public form!: FormGroup;
  public routes = appRoutes;

  public showValidationErrors = false;
  public loading = false;

  constructor(
    public fb: FormBuilder,
    private itemGroupService: ItemGroupService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();
  }

  ngOnInit(): void {}

  private initializeCreateForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(199)]],
      description: ['', [Validators.required, Validators.maxLength(199)]],
    });
  }

  public save() {
    if (this.loading) {
      return;
    }

    if (!this.form.valid) {
      this.toastService.showError(
        'Please, fill up all required form fields.',
        'Validation Error'
      );
      this.showValidationErrors = true;
      return;
    }

    const data = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
    };

    this.loading = true;
    this.itemGroupService.store(data).subscribe({
      next: (res: ItemGroup) => {
        this.toastService.showSuccess(
          `Item Group '${res.name}' has been added successfully.`
        );
        localStorage.setItem('created-item-group', JSON.stringify(res));
        this.activeModal.close(res);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
