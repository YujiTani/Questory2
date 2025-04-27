import { Text } from "@/domain/common/text.value-objects";

export class QuestionText extends Text {
  protected validate(): void {
    this.validateNotEmpty("QuestText");
    this.validateMaxLength(1000, "QuestText");
  }

  static create(value: string): QuestionText {
    return new QuestionText(value);
  }
}
