// import { test, expect, describe } from "bun:test";

// import { ClearStatusId } from "@/domain/clear-manage/id.value-objects";

// describe("ClearStatusId Value Object", () => {
//   test("ClearStatusIdを生成できる", () => {
//     const id = new ClearStatusId("clear-status-123");
//     expect(id).toBeDefined();
//     expect(id).toBeInstanceOf(ClearStatusId);
//     expect(id.getValue).toBe("clear-status-123");
//   });

//   test("空の値を渡すとエラーが発生する", () => {
//     expect(() => new ClearStatusId("")).toThrow("Id cannot be empty");
//   });

//   test("3文字未満の値を渡すとエラーが発生する", () => {
//     expect(() => new ClearStatusId("cs")).toThrow(
//       "Id must be at least 3 characters long",
//     );
//   });

//   test("50文字を超える値を渡すとエラーが発生する", () => {
//     expect(() => new ClearStatusId("c".repeat(51))).toThrow(
//       "Id must be at most 50 characters long",
//     );
//   });

//   test("同じ値を持つIDは等価となる", () => {
//     const id1 = new ClearStatusId("clear-status-123");
//     const id2 = new ClearStatusId("clear-status-123");
//     expect(id1.equals(id2)).toBe(true);
//   });

//   test("異なる値を持つIDは等価とならない", () => {
//     const id1 = new ClearStatusId("clear-status-123");
//     const id2 = new ClearStatusId("clear-status-456");
//     expect(id1.equals(id2)).toBe(false);
//   });
// });
