export abstract class DateValueObject {
  protected constructor(private readonly value: Date) {
    this.value = value;
    this.validate();
  }

  getValue(): Date {
    return new Date(this.value);
  }

  equals(other: DateValueObject): boolean {
    if (!(other instanceof this.constructor)) {
      return false;
    }
    return this.value.getTime() === other.value.getTime();
  }

  toISOString(): string {
    return this.value.toISOString();
  }

  toMilliseconds(): number {
    return this.value.getTime();
  }

  protected validate(): void {
    if (!(this.value instanceof Date) || Number.isNaN(this.value.getTime())) {
      throw new Error(`${this.constructor.name} must be a valid date`);
    }
  }
}

export class CreatedAt extends DateValueObject {
  private constructor(value: Date) {
    super(value);
  }

  static create(date: Date = new Date()): CreatedAt {
    return new CreatedAt(date);
  }
}

export class UpdatedAt extends DateValueObject {
  private constructor(value: Date) {
    super(value);
  }

  static create(date: Date = new Date()): UpdatedAt {
    return new UpdatedAt(date);
  }
}

export class DeletedAt extends DateValueObject {
  private constructor(value: Date) {
    super(value);
  }

  static create(date: Date): DeletedAt {
    return new DeletedAt(date);
  }

  static createNull(): null {
    return null;
  }
}
