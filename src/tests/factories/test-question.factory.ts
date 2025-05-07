import {
  QuestionEntity,
  type QuestionCategory,
  type QuestionState,
  type QuestionType,
} from "@/domain/entities/question";
import {
  CreatedAt,
  type DeletedAt,
  UpdatedAt,
} from "@/domain/value-objects/common/date.value-objects";
import { Description } from "@/domain/value-objects/common/text.value-objects";
import { QuestionId } from "@/domain/value-objects/question/id.value-objects";
import { QuestionText } from "@/domain/value-objects/question/text.value-objects";

export class TestQuestionFactory {
  static readonly DEFAULTDATE: Date = new Date("2025-01-01T12:00:00Z");

  static create(
    // 引数にはすべてデフォルト値を設定する
    id: QuestionId = QuestionId.create(),
    text: QuestionText = QuestionText.create("テスト用の問題"),
    correctAnswer: QuestionText[] = [QuestionText.create("テスト用の解答")],
    alternativeAnswers: QuestionText[] = [
      QuestionText.create("テスト用の類似解答1"),
      QuestionText.create("テスト用の類似解答2"),
      QuestionText.create("テスト用の類似解答3"),
    ],
    explanation: Description = Description.create("テスト用の問題です"),
    type: QuestionType = "SELECT",
    state: QuestionState = "ACTIVE",
    category: QuestionCategory = "SQL",
    createdAt: CreatedAt = CreatedAt.create(TestQuestionFactory.DEFAULTDATE),
    updatedAt: UpdatedAt = UpdatedAt.create(TestQuestionFactory.DEFAULTDATE),
    deletedAt: DeletedAt | null = null,
  ) {
    return QuestionEntity.reconstruct(
      id,
      text,
      correctAnswer,
      alternativeAnswers,
      explanation,
      type,
      state,
      category,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }
}
