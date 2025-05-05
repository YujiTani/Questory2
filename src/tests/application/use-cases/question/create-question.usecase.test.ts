import { test, expect, describe, mock, setSystemTime } from "bun:test";

import { CreateQuestionUseCase } from "@/application/use-cases/question/create-question.usecase";
import { QuestionEntity } from "@/domain/entities/question";

describe("create-question.usecase.tsのテスト", () => {
  test("デフォルト設定で、問題が作成できる", async () => {
    const date = new Date("2025-01-01T12:00:00Z")
    setSystemTime(date);
  
    const questionEntity = QuestionEntity.create(
      "test question",
      "SELECT * From users",
      [
        "SELECT ALL FROM table_name",
        "SELECT COLUMNS FROM table_name",
        "GET * FROM table_name",
      ],
      "SELECT文では * を使用することで全てのカラムを選択できます。",

    )
    const mockQuestionReositoy = {
      save: mock(async () => questionEntity)
    }

    const createQuestionUseCase = new CreateQuestionUseCase(mockQuestionReositoy)

    const result = await createQuestionUseCase.execute(
      {
      text: "test question",
      correctAnswer: "SELECT * From users",
      alternativeAnswers: [
        "SELECT ALL FROM table_name",
        "SELECT COLUMNS FROM table_name",
        "GET * FROM table_name",
      ],
      explanation: "SELECT文では * を使用することで全てのカラムを選択できます。",
      }
    );

    const expected = {
      text: "test question",
      correctAnswer: "SELECT * From users",
      alternativeAnswers: [
        "SELECT ALL FROM table_name",
        "SELECT COLUMNS FROM table_name",
        "GET * FROM table_name",
      ],
      explanation:
        "SELECT文では * を使用することで全てのカラムを選択できます。",
      type: "SELECT",
      state: "ACTIVE",
      category: "SQL",
      createdAt: "2025-01-01T12:00:00.000Z",
      updatedAt: "2025-01-01T12:00:00.000Z",
      deletedAt: null,
    };

    expect(result.toDTO()).toEqual(expect.objectContaining(expected));
  });

  test("カテゴリー:SQL、タイプ:SELECTで問題を作成できる", () => {})
  test("カテゴリー:TYPESCRIPT、タイプ:SORTで問題を作成できる", () => {})
  test("カテゴリー:HTTP、タイプ:MULTIPLE_CHOICEで問題を作成できる", () => {})
});
