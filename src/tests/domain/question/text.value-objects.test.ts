import { test, expect, describe } from "bun:test";

import { QuestionText } from "@/domain/question/text.value-objects";

describe("QuestionText Value Object", () => {
  test("QuestionTextを生成できる", () => {
    const text = QuestionText.create("問題文サンプル");
    expect(text).toBeDefined();
    expect(text).toBeInstanceOf(QuestionText);
    expect(text.getValue).toBe("問題文サンプル");
  });

  test("空の値を渡すとエラーが発生する", () => {
    expect(() => QuestionText.create("")).toThrow("QuestText cannot be empty");
  });

  test("空白のみの値を渡すとエラーが発生する", () => {
    expect(() => QuestionText.create("   ")).toThrow(
      "QuestText cannot be empty",
    );
  });

  test("1000文字を超える値を渡すとエラーが発生する", () => {
    expect(() => QuestionText.create("a".repeat(1001))).toThrow(
      "QuestText must be at most 1000 characters long",
    );
  });

  test("同じ値を持つテキストは等価となる", () => {
    const text1 = QuestionText.create("同じ問題文");
    const text2 = QuestionText.create("同じ問題文");
    expect(text1.equals(text2)).toBe(true);
  });

  test("異なる値を持つテキストは等価とならない", () => {
    const text1 = QuestionText.create("問題文1");
    const text2 = QuestionText.create("問題文2");
    expect(text1.equals(text2)).toBe(false);
  });
});
