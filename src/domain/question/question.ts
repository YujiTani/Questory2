import { AuditableEntity } from "@/domain/common/auditable";
import {
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from "@/domain/common/date.value-objects";
import { Description } from "@/domain/common/text.value-objects";
import { QuestionId } from "@/domain/question/id.value-objects";
import { QuestionText } from "@/domain/question/text.value-objects";

export class QuestionEntity extends AuditableEntity<QuestionId> {
  protected constructor(
    id: QuestionId,
    private text: QuestionText,
    private correctAnswer: QuestionText,
    private alternativeAnswers: QuestionText[],
    private explanation: Description,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
    deletedAt: DeletedAt | null = null,
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  static create(
    text: string,
    correctAnswer: string,
    alternativeAnswers: string[],
    explanation: string,
  ): QuestionEntity {
    return new QuestionEntity(
      QuestionId.create(),
      QuestionText.create(text),
      QuestionText.create(correctAnswer),
      alternativeAnswers.map((answer) => QuestionText.create(answer)),
      Description.create(explanation),
      CreatedAt.create(),
      UpdatedAt.create(),
      DeletedAt.createNull(),
    );
  }
}
