export abstract class Text {
  protected constructor(private readonly value: string) {
    this.validate();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Text): boolean {
    if (!(other instanceof this.constructor)) {
      return false;
    }
    return this.value === other.value;
  }

  protected abstract validate(): void;

  protected validateNotEmpty(name: string): void {
    if (!this.value || this.value.trim() === "") {
      throw new Error(`${name} cannot be empty`);
    }
  }

  protected validateMinLength(minLength: number, name: string): void {
    if (this.value && this.value.length < minLength) {
      throw new Error(`${name} must be at least ${minLength} characters long`);
    }
  }

  protected validateMaxLength(maxLength: number, name: string): void {
    if (this.value && this.value.length > maxLength) {
      throw new Error(`${name} must be at most ${maxLength} characters long`);
    }
  }
}

export class Name extends Text {
  protected validate(): void {
    this.validateNotEmpty("Name");
    this.validateMaxLength(100, "Name");
  }

  static create(value: string): Name {
    return new Name(value);
  }
}

export class Description extends Text {
  protected validate(): void {
    this.validateMaxLength(1000, "Description");
  }

  static create(value: string): Description {
    return new Description(value);
  }
}
