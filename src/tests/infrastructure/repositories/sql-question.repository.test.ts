import { beforeEach, describe, expect, test } from "bun:test";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";

import type { PrismaClient } from "@prisma/client";

import { QuestionEntity } from "@/domain/entities/question";
import { QuestionId } from "@/domain/value-objects/question/id.value-objects";
import { SQLQuestionRepository } from "@/infrastructure/repositories/sql-question.repository";
import { TestQuestionFactory } from "@/tests/factories/test-question.factory";

describe("sql-question.repository.tsのテスト", () => {
  // グローバルに扱う値の定義
  let prismaMock: DeepMockProxy<PrismaClient>;
  let sqlQuestionRepositoy: SQLQuestionRepository;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    sqlQuestionRepositoy = new SQLQuestionRepository(prismaMock);
  });

  test.only("saveしたものがfindByIdで取得できること", async () => {
    // given (前提条件)：操作を実行する前の状態
    const request = {
      text: "テスト用の問題",
      correctAnswers: ["テスト用の解答"],
      alternativeAnswers: [
        "テスト用の類似解答1",
        "テスト用の類似解答2",
        "テスト用の類似解答3",
      ],
      explanation: "テスト用の問題です",
    }
    // uuidは事前に生成したものをmockしておく
    const mockUuid = QuestionId.create()
    
    // when (操作): 操作
    // const question = TestQuestionFactory.create()
    const entity = QuestionEntity.create(request)
    await sqlQuestionRepositoy.save(entity);
    const foundQuestion = (await sqlQuestionRepositoy.findByUuid(mockUuid))

    // then (結果) : 操作した結果
    // 実際にはentityで返すが、テストでは比較のためにDTOに変換している
    expect(foundQuestion.uuid).toBe(mockUuid);
    expect(foundQuestion.text).toBe(entity.text);
    expect(foundQuestion.correctAnswers).toBe(entity.correctAnswers);
    expect(foundQuestion.alternativeAnswers).toBe(entity.alternativeAnswers);
    expect(foundQuestion.explanation).toBe(entity.explanation);
    expect(foundQuestion.type).toBe(entity.type);
    expect(foundQuestion.state).toBe(entity.state);
    expect(foundQuestion.category).toBe(entity.category);
    expect(foundQuestion.createdAt).toBe(entity.createdAt);
    expect(foundQuestion.deletedAt).toBeNull();
  });

  test("エンティティーからモデルにデータを変換する", async () => {
    // given (前提条件)：操作を実行する前の状態
    // - データやモックを作ったりするところ
    const question = TestQuestionFactory.create()

    // when (操作): 操作
    // - メソッドを呼んだりするところ
    const model = sqlQuestionRepositoy.toModel(question)

    // then (結果) : 操作した結果
    // - アサーションを呼ぶところ
    expect(model.uuid).toBe(question.id)
    expect(model.text).toBe(question.text)
    expect(model.correctAnswer).toBe(question.correctAnswer)
    expect(model.alternativeAnswers).toBe(question.alternativeAnswers)
    expect(model.explanation).toBe(question.explanation)
    expect(model.type).toBe(question.type)
    expect(model.state).toBe(question.state)
    expect(model.category).toBe(question.category)
    expect(new Date(model.createdAt)).toBe(question.createdAt)
    expect(new Date(model.updatedAt)).toBe(question.updatedAt)
    expect(model.deletedAt ? new Date(model.deletedAt) : model.deletedAt).toBe(question.deletedAt)
  });

  test.skip("****", () => {
    // given (前提条件)：操作を実行する前の状態
    // - データやモックを作ったりするところ

    // when (操作): 操作
    // - メソッドを呼んだりするところ

    // then (結果) : 操作した結果
    // - アサーションを呼ぶところ
  });
});
