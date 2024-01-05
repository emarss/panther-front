export class Setting {
  currency!: string;
  purchase_order_due_date!: number;
  document_purchase_order_terms?: string;
  document_purchase_order_footer?: string;
  document_show_business_vat_number!: number;
  document_show_business_bp_number!: number;
  document_show_banking_details!: number;
  document_color!: string;
  document_template_id!: number;

  uuid!: string;
  school_uuid!: string;
  date_created!: number;
  date_updated!: number;

  constructor(data: any) {
    this.currency = data.currency;
    this.purchase_order_due_date = data.purchase_order_due_date;
    this.document_purchase_order_terms = data.document_purchase_order_terms;
    this.document_purchase_order_footer = data.document_purchase_order_footer;
    this.document_show_business_vat_number = data.document_show_business_vat_number;
    this.document_show_business_bp_number = data.document_show_business_bp_number;
    this.document_show_banking_details = data.document_show_banking_details;
    this.document_color = data.document_color;
    this.document_template_id = data.document_template_id;

    this.school_uuid = data.school_uuid;
    this.uuid = data.uuid;
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
  }
}
