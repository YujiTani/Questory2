import { test, expect, describe } from "bun:test";

import { Id } from "@/domain/common/id.value-objects";

class TestId extends Id {
  static create(value: string): TestId {
    return new TestId(value);
  }
}

// 1.生成テスト
describe("Id Value Object生成テスト", () => {
  test("abstract class Id を継承したクラスを使用してIdを生成できる", () => {
    const id = TestId.create("1234");
    expect(id).toBeDefined();
    expect(id).toBeInstanceOf(TestId);
    expect(id.getValue).toBe("1234");
  });

  test("空の値を渡すとエラーが発生する", () => {
    expect(() => TestId.create("")).toThrow("Id cannot be empty");
  });

  test("3文字未満の値を渡すとエラーが発生する", () => {
    expect(() => TestId.create("12")).toThrow(
      "Id must be at least 3 characters long",
    );
  });

  test("50文字を超える値を渡すとエラーが発生する", () => {
    expect(() => TestId.create("a".repeat(51))).toThrow(
      "Id must be at most 50 characters long",
    );
  });
});

// 2.等価性のテスト
describe("Id Value Object比較テスト", () => {
  test("同じ値を持つIDはひとつのIDとして扱われる", () => {
    const id1 = TestId.create("1234");
    const id2 = TestId.create("1234");
    expect(id1.equals(id2)).toBe(true);
  });
});

// FIX: 不変性が実証できていないので、やり方を調べる必要がある
// 3.不変性のテスト
// describe('Id Value Object不変性テスト', () => {
//     test('Idの値は変更できない', () => {
// const id = TestId.create('immutable_id')
// const originalId = id.getValue()
//         // id.getValue()を直接変更することはできない
//         try {
//             // @ts-ignore
//             id.value = 'new_value' // TypeScriptの型チェックを回避するために直接アクセス
//             expect.unreachable();
//         } catch (e) {
//             // 例外が発生することを期待
//             expect(e).toBeInstanceOf(Error);
//         }

//         expect(id.getValue()).toBe(originalId);
//     })
// })
