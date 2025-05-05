import { test, expect, describe } from "bun:test";

import { Name } from "@/domain/value-objects/common/text.value-objects";
import { QuestionCollectionName } from "@/domain/value-objects/question-collection/text.value-objects";

describe("QuestionCollectionName Value Object", () => {
  test("QuestionCollectionNameを生成できる", () => {
    const name = QuestionCollectionName.create("テストコレクション");
    expect(name).toBeDefined();
    expect(name).toBeInstanceOf(Name);
    expect(name.getValue).toBe("テストコレクション");
  });

  test("空の値を渡すとエラーが発生する", () => {
    expect(() => QuestionCollectionName.create("")).toThrow(
      "Name cannot be empty",
    );
  });

  test("空白のみの値を渡すとエラーが発生する", () => {
    expect(() => QuestionCollectionName.create("   ")).toThrow(
      "Name cannot be empty",
    );
  });

  test("100文字を超える値を渡すとエラーが発生する", () => {
    expect(() => QuestionCollectionName.create("a".repeat(101))).toThrow(
      "Name must be at most 100 characters long",
    );
  });

  test("同じ値を持つ名前は等価となる", () => {
    const name1 = QuestionCollectionName.create("テストコレクション");
    const name2 = QuestionCollectionName.create("テストコレクション");
    expect(name1.equals(name2)).toBe(true);
  });

  test("異なる値を持つ名前は等価とならない", () => {
    const name1 = QuestionCollectionName.create("テストコレクション1");
    const name2 = QuestionCollectionName.create("テストコレクション2");
    expect(name1.equals(name2)).toBe(false);
  });
});
