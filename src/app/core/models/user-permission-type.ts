export class UserPermissionType {
  description!: string;
  code!: number;

  constructor(data: any) {
    this.description = data.description;
    this.code = data.code;
  }

  find(code: number, list: Array<UserPermissionType>): UserPermissionType | undefined {
    return list.find((el) => { return el.code === code });
  }
}
