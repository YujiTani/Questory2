export abstract class Text {
  constructor(private readonly value: string) {
    this.value = value;
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
}

export class Description extends Text {
  protected validate(): void {
    this.validateMaxLength(1000, "Description");
  }
}

export class QuestText extends Text {
  protected validate(): void {
    this.validateNotEmpty("QuestText");
    this.validateMaxLength(1000, "QuestText");
  }
}

export class QuestCollectionName extends Text {
  protected validate(): void {
    this.validateNotEmpty("QuestCollectionName");
    this.validateMaxLength(50, "QuestCollectionName");
  }
}
