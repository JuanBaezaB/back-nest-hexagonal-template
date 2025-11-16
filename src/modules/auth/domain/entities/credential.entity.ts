// Nueva entidad de dominio solo para Auth
export class Credential {
  private readonly _id: string;
  private _email: string;
  private _passwordHash: string;
  private readonly _createdAt: Date;

  private constructor(props: {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
  }) {
    this._id = props.id;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._createdAt = props.createdAt;
  }

  static create(props: {
    id: string;
    email: string;
    passwordHash: string;
  }): Credential {
    return new Credential({
      ...props,
      createdAt: new Date(),
    });
  }

  public static fromPersistence(props: {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
  }): Credential {
    return new Credential(props);
  }

  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
