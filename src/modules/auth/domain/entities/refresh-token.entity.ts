export class RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;

  constructor(partial: Partial<RefreshToken>) {
    Object.assign(this, partial);
  }

  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
