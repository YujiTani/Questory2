import { test, expect, describe } from "bun:test";

import {
  DateValueObject,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "@/domain/common/date.value-objects";

class TestDate extends DateValueObject {
  static create(date: Date): TestDate {
    return new TestDate(date);
  }
}

// 1.生成テスト
describe("DateValueObject生成テスト", () => {
  test("abstract class DateValueObject を継承したクラスを使用してDateを生成できる", () => {
    const date = new Date();
    const dateObj = TestDate.create(date);
    expect(dateObj).toBeDefined();
    expect(dateObj).toBeInstanceOf(TestDate);
    expect(dateObj.getValue().getTime()).toBe(date.getTime());
  });

  test("不正な日付を渡すとエラーが発生する", () => {
    const invalidDate = new Date("invalid date");
    expect(() => TestDate.create(invalidDate)).toThrow(
      "TestDate must be a valid date",
    );
  });
});

// 2.等価性のテスト
describe("DateValueObject比較テスト", () => {
  test("同じ時間を持つDateValueObjectはひとつのDateValueObjectとして扱われる", () => {
    const date = new Date("2023-01-01T00:00:00.000Z");
    const dateObj1 = TestDate.create(date);
    const dateObj2 = TestDate.create(new Date("2023-01-01T00:00:00.000Z"));
    expect(dateObj1.equals(dateObj2)).toBe(true);
  });

  test("異なる時間を持つDateValueObjectは別のDateValueObjectとして扱われる", () => {
    const dateObj1 = TestDate.create(new Date("2023-01-01T00:00:00.000Z"));
    const dateObj2 = TestDate.create(new Date("2023-01-02T00:00:00.000Z"));
    expect(dateObj1.equals(dateObj2)).toBe(false);
  });

  test("異なるクラス同士は等価ではない", () => {
    const date = new Date();
    const testDate = TestDate.create(date);
    const createdAt = CreatedAt.create(date);
    expect(testDate.equals(createdAt)).toBe(false);
  });
});

// 3.フォーマット変換のテスト
describe("DateValueObjectフォーマットテスト", () => {
  test("toISOString()でISO形式の文字列を取得できる", () => {
    const date = new Date("2023-01-01T00:00:00.000Z");
    const dateObj = TestDate.create(date);
    expect(dateObj.toISOString()).toBe("2023-01-01T00:00:00.000Z");
  });

  test("toMilliseconds()でミリ秒のタイムスタンプを取得できる", () => {
    const date = new Date("2023-01-01T00:00:00.000Z");
    const dateObj = TestDate.create(date);
    expect(dateObj.toMilliseconds()).toBe(date.getTime());
  });
});

// 具体的な実装クラスのテスト
describe("CreatedAt Value Objectテスト", () => {
  test("引数なしで現在時刻のCreatedAtを生成できる", () => {
    const before = Date.now();
    const createdAt = CreatedAt.create();
    const after = Date.now();

    expect(createdAt).toBeDefined();
    expect(createdAt.toMilliseconds()).toBeGreaterThanOrEqual(before);
    expect(createdAt.toMilliseconds()).toBeLessThanOrEqual(after);
  });

  test("指定した日付でCreatedAtを生成できる", () => {
    const date = new Date("2023-01-01T00:00:00.000Z");
    const createdAt = CreatedAt.create(date);
    expect(createdAt.getValue().getTime()).toBe(date.getTime());
  });
});

describe("UpdatedAt Value Objectテスト", () => {
  test("引数なしで現在時刻のUpdatedAtを生成できる", () => {
    const before = Date.now();
    const updatedAt = UpdatedAt.create();
    const after = Date.now();

    expect(updatedAt).toBeDefined();
    expect(updatedAt.toMilliseconds()).toBeGreaterThanOrEqual(before);
    expect(updatedAt.toMilliseconds()).toBeLessThanOrEqual(after);
  });

  test("update()で新しいUpdatedAtを生成できる", () => {
    const date = new Date("2023-01-01T00:00:00.000Z");
    const updatedAt = UpdatedAt.create(date);

    // 少し待機して更新
    const newUpdatedAt = updatedAt.update();

    expect(newUpdatedAt).toBeDefined();
    expect(newUpdatedAt.toMilliseconds()).toBeGreaterThan(
      updatedAt.toMilliseconds(),
    );
  });
});

describe("DeletedAt Value Objectテスト", () => {
  test("指定した日付でDeletedAtを生成できる", () => {
    const date = new Date("2023-01-01T00:00:00.000Z");
    const deletedAt = DeletedAt.create(date);
    expect(deletedAt.getValue().getTime()).toBe(date.getTime());
  });

  test("createNull()でnullを生成できる", () => {
    expect(DeletedAt.createNull()).toBeNull();
  });

  test("delete()でnullを返す", () => {
    const date = new Date("2023-01-01T00:00:00.000Z");
    const deletedAt = DeletedAt.create(date);
    expect(deletedAt.delete()).toBeNull();
  });
});
