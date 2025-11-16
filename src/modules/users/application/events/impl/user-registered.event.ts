// Este evento será el "contrato" entre Auth y Users
export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly name: string,
  ) {}
}
