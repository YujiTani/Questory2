import { randomUUIDv7 } from "bun";

import { Id } from "@/domain/value-objects/common/id.value-objects";

export class QuestionId extends Id {
  static create() {
    return randomUUIDv7();
  }
}
