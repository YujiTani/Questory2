import { randomUUIDv7 } from "bun";

import {
  QuestionEntity,
  type Properties,
} from "@/domain/entities/question";

export const SAMPLE_DEFAULT_DATE = new Date("2025-01-01T12:00:00Z");
export const SAMPLE_TEXT = "テスト用の問題"
export const SAMPLE_CORRECT_ANSWERS = ["テスト用の解答"]
export const SAMPLE_ALTERNATIVE_ANSWERS = [
  "テスト用の類似解答1",
  "テスト用の類似解答2",
  "テスト用の類似解答3",
]
export const SAMPLE_EXPLANATION = "テスト用の問題です"
export class TestQuestionFactory {

  static create(
    model?: Properties,
  ) {
    const sampleData = {
      uuid: randomUUIDv7(),
      text: model?.text ?? SAMPLE_TEXT,
      correctAnswers: model?.correctAnswers ?? SAMPLE_CORRECT_ANSWERS,
      alternativeAnswers: model?.alternativeAnswers ?? SAMPLE_ALTERNATIVE_ANSWERS,
      explanation: model?.explanation ?? SAMPLE_EXPLANATION,
      type: model?.type ?? "SELECT",
      state: model?.state ?? "ACTIVE",
      category: model?.category ?? "SQL",
      createdAt: model?.createdAt ?? SAMPLE_DEFAULT_DATE,
      deletedAt: model?.deletedAt ?? null,
    }

    return QuestionEntity.create(sampleData)
  }
}
