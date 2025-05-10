import { beforeEach, describe, expect, test } from "bun:test";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";

import type { PrismaClient } from "@prisma/client";

import { SQLQuestionRepository } from "@/infrastructure/repositories/sql-question.repository";
import { TestQuestionFactory } from "@/tests/factories/test-question.factory";

describe.only("sql-question.repository.tsのテスト", () => {
  // グローバルに扱う値の定義
  let prismaMock: DeepMockProxy<PrismaClient>;
  let sqlQuestionRepositoy: SQLQuestionRepository;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    sqlQuestionRepositoy = new SQLQuestionRepository(prismaMock);
  });

  test("saveしたものがfindByIdで取得できること", async () => {
    // given (前提条件)：操作を実行する前の状態
    const question = TestQuestionFactory.create()
    
    // when (操作): 操作
    await sqlQuestionRepositoy.save(question);
    const foundQuestion =  (await sqlQuestionRepositoy.findByUuid(question.getId))


    // then (結果) : 操作した結果
    // 実際にはentityで返すが、テストでは比較のためにDTOに変換している
    const questionDTO = question.toDTO()
    const foundQuestionDTO = foundQuestion.toDTO()

    expect(foundQuestionDTO.id).toBe(questionDTO.id);
    expect(foundQuestionDTO.text).toBe(questionDTO.text);
    expect(foundQuestionDTO.correctAnswer).toBe(questionDTO.correctAnswer);
    expect(foundQuestionDTO.alternativeAnswers).toBe(questionDTO.alternativeAnswers);
    expect(foundQuestionDTO.explanation).toBe(questionDTO.explanation);
    expect(foundQuestionDTO.type).toBe(questionDTO.type);
    expect(foundQuestionDTO.state).toBe(questionDTO.state);
    expect(foundQuestionDTO.category).toBe(questionDTO.category);
    expect(foundQuestionDTO.createdAt).toBe(questionDTO.createdAt);
    expect(foundQuestionDTO.updatedAt).toBe(questionDTO.updatedAt);
    expect(foundQuestionDTO.deletedAt).toBe(questionDTO.deletedAt);
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
    expect(model.id).toBe(question.id)
    expect(model.uuid).toBe(question.uuid)
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
