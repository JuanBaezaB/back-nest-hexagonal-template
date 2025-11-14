export class RefreshToken {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _selector: string;
  private readonly _validatorHash: string;
  private _isRevoked: boolean;
  private readonly _expiresAt: Date;
  private readonly _createdAt: Date;

  private constructor(props: {
    id: string;
    userId: string;
    selector: string;
    validatorHash: string;
    isRevoked: boolean;
    expiresAt: Date;
    createdAt: Date;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._selector = props.selector;
    this._validatorHash = props.validatorHash;
    this._isRevoked = props.isRevoked;
    this._expiresAt = props.expiresAt;
    this._createdAt = props.createdAt;
  }

  public static create(props: {
    id: string;
    userId: string;
    selector: string;
    validatorHash: string;
    expiresAt: Date;
  }): RefreshToken {
    return new RefreshToken({
      ...props,
      id: props.id,
      isRevoked: false,
      createdAt: new Date(),
    });
  }

  public static fromPersistence(props: {
    id: string;
    userId: string;
    selector: string;
    validatorHash: string;
    isRevoked: boolean;
    expiresAt: Date;
    createdAt: Date;
  }): RefreshToken {
    return new RefreshToken(props);
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get selector(): string {
    return this._selector;
  }
  get validatorHash(): string {
    return this._validatorHash;
  }
  get isRevoked(): boolean {
    return this._isRevoked;
  }
  get expiresAt(): Date {
    return this._expiresAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  public isExpired(): boolean {
    return this._expiresAt < new Date();
  }

  public revoke(): void {
    if (!this._isRevoked) this._isRevoked = true;
  }

  public canBeUsed(): boolean {
    return !this._isRevoked && !this.isExpired();
  }
}
