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
  // 正常系
  test("2025年1月1日というデータを作成できる", () => {
    const date = new Date("2025-01-01T00:00:00.000Z");
    const dateObj = TestDate.create(date);
    expect(dateObj).toBeDefined();
    expect(dateObj).toBeInstanceOf(TestDate);
    expect(dateObj.getValue.getTime()).toEqual(1735689600000);
  });

  test("2050年1月1日というデータを作成できる", () => {
    const date = new Date("2050-01-01T00:00:00.000Z");
    const dateObj = TestDate.create(date);
    expect(dateObj).toBeDefined();
    expect(dateObj).toBeInstanceOf(TestDate);
    expect(dateObj.getValue.getTime()).toEqual(2524608000000);
  });

  test("2025年1月1日0時0分0秒のデータを取得できる", () => {
    const date = new Date("2025-01-01T00:00:00.000Z");
    const dateObj = TestDate.create(date);
    expect(dateObj.getValue.getFullYear()).toEqual(2025);
    expect(dateObj.getValue.getMonth()).toEqual(0); // 月は0から始まるので1月は0
    expect(dateObj.getValue.getDate()).toEqual(1);
    expect(dateObj.getValue.getHours()).toEqual(0);
    expect(dateObj.getValue.getMinutes()).toEqual(0);
    expect(dateObj.getValue.getSeconds()).toEqual(0);
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
  test("同じ日時で作成した場合、等しい値として扱う", () => {
    const dateObj1 = TestDate.create(new Date("2023-01-01T00:00:00.000Z"));
    const dateObj2 = TestDate.create(new Date("2023-01-01T00:00:00.000Z"));
    expect(dateObj1.equals(dateObj2)).toBeTruthy();
  });

  test("異なる日時で作成した場合、異なる値をして扱う", () => {
    const dateObj1 = TestDate.create(new Date("2023-01-01T00:00:00.000Z"));
    const dateObj2 = TestDate.create(new Date("2023-01-02T00:00:00.000Z"));
    expect(dateObj1.equals(dateObj2)).toBeFalsy();
  });

  test("異なるクラス同士は等価ではない", () => {
    const date = new Date("2025-01-01T00:00:00.000Z");
    const testDate = TestDate.create(date);
    const createdAt = CreatedAt.create(date);
    expect(testDate.equals(createdAt)).toBeFalsy();
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
    const date = new Date("2025-01-01T00:00:00.000Z");
    const dateObj = TestDate.create(date);
    expect(dateObj.toMilliseconds()).toEqual(1735689600000);
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
    expect(createdAt.getValue.getTime()).toBe(date.getTime());
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
    expect(deletedAt.getValue.getTime()).toBe(date.getTime());
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
