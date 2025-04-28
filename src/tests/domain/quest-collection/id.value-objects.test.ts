// import { test, expect, describe } from "bun:test";

// import { QuestionCollectionId } from "@/domain/quest-collection/id.value-objects";

// describe("QuestionCollectionId Value Object", () => {
//   test("QuestionCollectionIdを生成できる", () => {
//     const id = new QuestionCollectionId("test-collection-id");
//     expect(id).toBeDefined();
//     expect(id).toBeInstanceOf(QuestionCollectionId);
//     expect(id.getValue).toBe("test-collection-id");
//   });

//   test("空の値を渡すとエラーが発生する", () => {
//     expect(() => new QuestionCollectionId("")).toThrow("Id cannot be empty");
//   });

//   test("3文字未満の値を渡すとエラーが発生する", () => {
//     expect(() => new QuestionCollectionId("ab")).toThrow(
//       "Id must be at least 3 characters long",
//     );
//   });

//   test("50文字を超える値を渡すとエラーが発生する", () => {
//     expect(() => new QuestionCollectionId("a".repeat(51))).toThrow(
//       "Id must be at most 50 characters long",
//     );
//   });

//   test("同じ値を持つIDは等価となる", () => {
//     const id1 = new QuestionCollectionId("collection-123");
//     const id2 = new QuestionCollectionId("collection-123");
//     expect(id1.equals(id2)).toBe(true);
//   });

//   test("異なる値を持つIDは等価とならない", () => {
//     const id1 = new QuestionCollectionId("collection-123");
//     const id2 = new QuestionCollectionId("collection-456");
//     expect(id1.equals(id2)).toBe(false);
//   });
// });
