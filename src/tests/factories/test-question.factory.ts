import { randomUUIDv7 } from "bun";

import {
  QuestionEntity,
  type Properties,
} from "@/domain/entities/question";

export const DEFAULTDATE = new Date("2025-01-01T12:00:00Z");
export const sampleText = "テスト用の問題"
export const sampleCorrectAnswers = ["テスト用の解答"]
export const sampleAlternativeAnswers = [
  "テスト用の類似解答1",
  "テスト用の類似解答2",
  "テスト用の類似解答3",
]
export const sampleExplanation = "テスト用の問題です"
export class TestQuestionFactory {

  static create(
    model?: Properties,
  ) {
    const sampleData = {
      uuid: randomUUIDv7(),
      text: model?.text ?? sampleText,
      correctAnswers: model?.correctAnswers ?? sampleCorrectAnswers,
      alternativeAnswers: model?.alternativeAnswers ?? sampleAlternativeAnswers,
      explanation: model?.explanation ?? sampleExplanation,
      type: model?.type ?? "SELECT",
      state: model?.state ?? "ACTIVE",
      category: model?.category ?? "SQL",
      createdAt: model?.createdAt ?? DEFAULTDATE,
      deletedAt: model?.deletedAt ?? null,
    }

    return QuestionEntity.create(sampleData)
  }
}
