export abstract class Id {
  constructor(private readonly value: string) {
    this.value = value;
    this.validate();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Id): boolean {
    if (!(other instanceof this.constructor)) {
      return false;
    }
    return this.value === other.value;
  }

  protected validate(): void {
    if (!this.value) {
      throw new Error("Id cannot be empty");
    }

    if (this.value.length < 3) {
      throw new Error("Id must be at least 3 characters long");
    }

    if (this.value.length > 50) {
      throw new Error("Id must be at most 50 characters long");
    }
  }
}
