import { isEmail } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class User {
  private readonly _id: string;
  private _email: string;
  private _name: string;
  private _password?: string;
  private readonly _createdAt: Date;

  private constructor(props: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    password?: string;
  }) {
    this._id = props.id;
    this._email = props.email;
    this._name = props.name;
    this._password = props.password;
    this._createdAt = props.createdAt;
  }

  static create(props: {
    email: string;
    name: string;
    password?: string;
  }): User {
    if (!props.email || !isEmail(props.email)) {
      throw new Error('Invalid email');
    }

    if (!props.name) {
      throw new Error('Invalid name');
    }

    return new User({
      id: randomUUID(),
      email: props.email,
      name: props.name.trim(),
      password: props.password, // <-- ¡¡CORRECCIÓN DEL BUG!!
      createdAt: new Date(),
    });
  }

  public static fromPersistence(props: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    password?: string;
  }): User {
    return new User(props);
  }

  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get name(): string {
    return this._name;
  }
  get password(): string | undefined {
    return this._password;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
