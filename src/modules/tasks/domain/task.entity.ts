export class Task {
  private readonly _id: string;
  private _name: string;
  private readonly _createdAt: Date;

  private constructor(props: { id: string; name: string; createdAt: Date }) {
    this._id = props.id;
    this._name = props.name;
    this._createdAt = props.createdAt;
  }

  static create(props: { id: string; name: string }): Task {
    if (!props.name) {
      throw new Error('Invalid name');
    }

    return new Task({
      id: props.id,
      name: props.name.trim(),
      createdAt: new Date(),
    });
  }

  public static fromPersistence(props: {
    id: string;
    name: string;
    createdAt: Date;
  }): Task {
    return new Task(props);
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  public updateName(newName: string): void {
    if (!newName || newName.trim().length < 3) {
      throw new Error('Invalid name');
    }
    this._name = newName.trim();
  }
}
