import { Text } from "@/domain/common/text.value-objects";

export class QuestText extends Text {
  protected validate(): void {
    this.validateNotEmpty("QuestText");
    this.validateMaxLength(1000, "QuestText");
  }
}
