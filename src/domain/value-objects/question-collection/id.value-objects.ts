import { randomUUIDv7 } from "bun";

import { Id } from "@/domain/value-objects/common/id.value-objects";

export class QuestionCollectionId extends Id {
  static create() {
    return new QuestionCollectionId(randomUUIDv7());
  }
}
