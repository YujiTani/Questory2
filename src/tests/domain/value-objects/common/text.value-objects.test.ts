import { test, expect, describe } from "bun:test";

import {
  Text,
  Name,
  Description,
} from "@/domain/value-objects/common/text.value-objects";

class TestText extends Text {
  protected validate(): void {
    this.validateNotEmpty("TestText");
    this.validateMinLength(3, "TestText");
    this.validateMaxLength(50, "TestText");
  }

  static create(value: string): TestText {
    return new TestText(value);
  }
}

class TestName extends Name {
  static create(value: string): TestName {
    return new TestName(value);
  }
}

// 1.生成テスト
describe("Text Value Object生成テスト", () => {
  test("abstract class Text を継承したクラスを使用してTextを生成できる", () => {
    const text = TestText.create("text value");
    expect(text).toBeDefined();
    expect(text).toBeInstanceOf(TestText);
    expect(text.getValue).toBe("text value");
  });

  test("空の値を渡すとエラーが発生する", () => {
    expect(() => TestText.create("")).toThrow("TestText cannot be empty");
  });

  test("3文字未満の値を渡すとエラーが発生する", () => {
    expect(() => TestText.create("ab")).toThrow(
      "TestText must be at least 3 characters long",
    );
  });

  test("50文字を超える値を渡すとエラーが発生する", () => {
    expect(() => TestText.create("a".repeat(51))).toThrow(
      "TestText must be at most 50 characters long",
    );
  });
});

// 2.等価性のテスト
describe("Text Value Object比較テスト", () => {
  test("同じ値を持つTextはひとつのTextとして扱われる", () => {
    const text1 = TestText.create("same text");
    const text2 = TestText.create("same text");
    expect(text1.equals(text2)).toBe(true);
  });

  test("異なる値を持つTextは別のTextとして扱われる", () => {
    const text1 = TestText.create("text1");
    const text2 = TestText.create("text2");
    expect(text1.equals(text2)).toBe(false);
  });

  test("異なるクラス同士は等価ではない", () => {
    const text = TestText.create("text");
    const name = TestName.create("text");
    expect(text.equals(name)).toBe(false);
  });
});

// 具体的な実装クラスのテスト
describe("Name Value Objectテスト", () => {
  test("正常に生成できる", () => {
    const name = TestName.create("User Name");
    expect(name).toBeDefined();
    expect(name.getValue).toBe("User Name");
  });

  test("空の値を渡すとエラーが発生する", () => {
    expect(() => TestName.create("")).toThrow("Name cannot be empty");
  });

  test("100文字を超える値を渡すとエラーが発生する", () => {
    expect(() => TestName.create("a".repeat(101))).toThrow(
      "Name must be at most 100 characters long",
    );
  });
});

describe("Description Value Objectテスト", () => {
  test("正常に生成できる", () => {
    const description = Description.create("This is a description");
    expect(description).toBeDefined();
    expect(description.getValue).toBe("This is a description");
  });

  test("空文字でも生成できる", () => {
    const description = Description.create("");
    expect(description).toBeDefined();
    expect(description.getValue).toBe("");
  });

  test("1000文字を超える値を渡すとエラーが発生する", () => {
    expect(() => Description.create("a".repeat(1001))).toThrow(
      "Description must be at most 1000 characters long",
    );
  });
});
