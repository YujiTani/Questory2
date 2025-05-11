import { PrismaClient } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";


import { QuestionId } from "@/domain/value-objects/question/id.value-objects";
import { SQLQuestionRepository } from "@/infrastructure/repositories/sql-question.repository";
import { TestQuestionFactory } from "@/tests/factories/test-question.factory";

const prisma = new PrismaClient();

describe("sql-question.repository.tsのテスト", () => {
  // グローバルに扱う値の定義
  let sqlQuestionRepository: SQLQuestionRepository;
  let createSpy;
  const MOCK_UUID = "0196bf4a-c723-7000-9b4a-4a2e9507test"

  beforeEach(async () => {
    // テストごとにデータを初期化する
    await prisma.$transaction([prisma.question.deleteMany()]);
    await prisma.$disconnect();
    sqlQuestionRepository = new SQLQuestionRepository(prisma)
    
    createSpy = spyOn(QuestionId, "create");
    createSpy.mockImplementation(() => MOCK_UUID)
  });

  afterEach(() => {
    mock.restore();
  });

  test("saveしたものがfindByUuidで取得できること", async () => {
    // given (前提条件)：操作を実行する前の状態
    const entity = TestQuestionFactory.create()
    
    // when (操作): 操作
    await sqlQuestionRepository.save(entity);
    const foundQuestion = await sqlQuestionRepository.findByUuid(MOCK_UUID)

    // then (結果) : 操作した結果
    expect(foundQuestion.uuid).toBe(MOCK_UUID);
    expect(foundQuestion.text.getValue).toBe(entity.text.getValue);
    expect(foundQuestion.correctAnswers).toEqual(entity.correctAnswers);
    expect(foundQuestion.alternativeAnswers).toEqual(entity.alternativeAnswers);
    expect(foundQuestion.explanation.getValue).toBe(entity.explanation.getValue);
    expect(foundQuestion.type).toBe(entity.type);
    expect(foundQuestion.state).toBe(entity.state);
    expect(foundQuestion.category).toBe(entity.category);
    expect(foundQuestion.createdAt).toEqual(entity.createdAt);
    expect(foundQuestion.deletedAt).toBeNull();
  });

  test.skip("エンティティーからモデルにデータを変換する", async () => {
    // // given (前提条件)：操作を実行する前の状態
    // // - データやモックを作ったりするところ
    // const question = TestQuestionFactory.create()

    // // when (操作): 操作
    // // - メソッドを呼んだりするところ
    // const model = sqlQuestionRepository.toModel(question)

    // // then (結果) : 操作した結果
    // // - アサーションを呼ぶところ
    // expect(model.uuid).toBe(question.id)
    // expect(model.text).toBe(question.text)
    // expect(model.correctAnswer).toBe(question.correctAnswer)
    // expect(model.alternativeAnswers).toBe(question.alternativeAnswers)
    // expect(model.explanation).toBe(question.explanation)
    // expect(model.type).toBe(question.type)
    // expect(model.state).toBe(question.state)
    // expect(model.category).toBe(question.category)
    // expect(new Date(model.createdAt)).toBe(question.createdAt)
    // expect(new Date(model.updatedAt)).toBe(question.updatedAt)
    // expect(model.deletedAt ? new Date(model.deletedAt) : model.deletedAt).toBe(question.deletedAt)
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
