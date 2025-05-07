import { beforeEach, describe, expect, test } from "bun:test";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";

import type { PrismaClient } from "@prisma/client";

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

  test("saveしたものがfindByIdで取得できること", async () => {
    // given (前提条件)：操作を実行する前の状態
    const question = TestQuestionFactory.create();

    // when (操作): 操作
    await sqlQuestionRepositoy.save(question);
    const foundQuestion =  await sqlQuestionRepositoy.findById(question.getId)

    // then (結果) : 操作した結果
    // DBへの保存が成功したことをチェックしたい

    // FIXME: ここに返すのはEntityなのか？DB登録に使うのはDTOのはず？DTOからentityに戻すにはreconstructメソッドを使うように設計したい
    expect(foundQuestion.id).toBe(question.getId);
    expect(foundQuestion.text).toBe(question.text);
    expect(foundQuestion.correctAnswer).toBe(question.correctAnswer);
    expect(foundQuestion.alternativeAnswers).toBe(question.alternativeAnswers);
    expect(foundQuestion.explanation).toBe(question.explanation);
    expect(foundQuestion.type).toBe(question.type);
    expect(foundQuestion.state).toBe(question.state);
    expect(foundQuestion.category).toBe(question.category);
    expect(foundQuestion.createdAt).toBe(question.createdAt);
    expect(foundQuestion.updatedAt).toBe(question.updatedAt);
    expect(foundQuestion.deletedAt).toBe(question.deletedAt);
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
