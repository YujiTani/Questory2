import { test, expect, describe, mock, setSystemTime, beforeEach } from "bun:test";

import type { QuestionRepository } from "@/domain/repositories/question.repository";

import { CreateQuestionUseCase } from "@/application/use-cases/question/create-question.usecase";
import { QuestionEntity } from "@/domain/entities/question";

describe("create-question.usecase.tsのテスト", () => {
  let questionEntity: QuestionEntity
  let mockQuestionReositoy :QuestionRepository
  let createQuestionUseCase: CreateQuestionUseCase
  const date = new Date("2025-01-01T12:00:00Z");
  
  beforeEach(() => {
    setSystemTime(date);

    mockQuestionReositoy = {
      save: mock(async () => questionEntity),
      findById: mock(async () => questionEntity),
    }

    createQuestionUseCase = new CreateQuestionUseCase(
      mockQuestionReositoy,
    );
  })

  test("デフォルト設定で、問題が作成できる", async () => {
  beforeEach(() => {
    questionEntity = QuestionEntity.create(
      "test question",
      ["SELECT * From users"],
      [
        "SELECT ALL FROM table_name",
        "SELECT COLUMNS FROM table_name",
        "GET * FROM table_name",
      ],
      "SELECT文では * を使用することで全てのカラムを選択できます。",
    );
  })

    const result = await createQuestionUseCase.execute({
      text: "test question",
      correctAnswer: ["SELECT * From users"],
      alternativeAnswers: [
        "SELECT ALL FROM table_name",
        "SELECT COLUMNS FROM table_name",
        "GET * FROM table_name",
      ],
      explanation:
        "SELECT文では * を使用することで全てのカラムを選択できます。",
    });

    const expected = {
      text: "test question",
      correctAnswer: ["SELECT * From users"],
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

  test("カテゴリー:SQL、タイプ:SELECTで問題を作成できる", async () => {
    beforeEach(() => {
    questionEntity = QuestionEntity.create(
      "test question",
      ["SELECT * From users"],
      [
        "SELECT ALL FROM table_name",
        "SELECT COLUMNS FROM table_name",
        "GET * FROM table_name",
      ],
      "SELECT文では * を使用することで全てのカラムを選択できます。",
      "SELECT",
      "ACTIVE",
      "SQL",
    );
    })

    const result = await createQuestionUseCase.execute({
      text: "test question",
      correctAnswer: ["SELECT * From users"],
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
    });

    const expected = {
      text: "test question",
      correctAnswer: ["SELECT * From users"],
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

  test("カテゴリー:TYPESCRIPT、タイプ:SORTで問題を作成できる", async () => {
    beforeEach(() => {
    questionEntity = QuestionEntity.create(
      "TypeScriptの型について、正しい説明はどれですか？",
      [
        "TypeScriptはJavaScriptに静的型付けを追加した言語で、変数の型を事前に宣言できます。",
      ],
      [
        "TypeScriptはJavaScriptとまったく異なる別の言語で、互換性はありません。",
        "TypeScriptは型の宣言が必須で、動的型付けはサポートしていません。",
        "TypeScriptはCSSフレームワークの一種です。",
      ],
      "TypeScriptはJavaScriptのスーパーセットで、JavaScriptに静的型付けのシステムを追加した言語です。すべての有効なJavaScriptコードは有効なTypeScriptコードでもあり、型注釈はオプションです。",
      "SORT",
      "ACTIVE",
      "TYPESCRIPT",
    );
    })

    const result = await createQuestionUseCase.execute({
      text: "TypeScriptの型について、正しい説明はどれですか？",
      correctAnswer: [
        "TypeScriptはJavaScriptに静的型付けを追加した言語で、変数の型を事前に宣言できます。",
      ],
      alternativeAnswers: [
        "TypeScriptはJavaScriptとまったく異なる別の言語で、互換性はありません。",
        "TypeScriptは型の宣言が必須で、動的型付けはサポートしていません。",
        "TypeScriptはCSSフレームワークの一種です。",
      ],
      explanation:
        "TypeScriptはJavaScriptのスーパーセットで、JavaScriptに静的型付けのシステムを追加した言語です。すべての有効なJavaScriptコードは有効なTypeScriptコードでもあり、型注釈はオプションです。",
      type: "SORT",
      state: "ACTIVE",
      category: "TYPESCRIPT",
    });

    const expected = {
      text: "TypeScriptの型について、正しい説明はどれですか？",
      correctAnswer:
        ["TypeScriptはJavaScriptに静的型付けを追加した言語で、変数の型を事前に宣言できます。"],
      alternativeAnswers: [
        "TypeScriptはJavaScriptとまったく異なる別の言語で、互換性はありません。",
        "TypeScriptは型の宣言が必須で、動的型付けはサポートしていません。",
        "TypeScriptはCSSフレームワークの一種です。",
      ],
      explanation:
        "TypeScriptはJavaScriptのスーパーセットで、JavaScriptに静的型付けのシステムを追加した言語です。すべての有効なJavaScriptコードは有効なTypeScriptコードでもあり、型注釈はオプションです。",
      type: "SORT",
      state: "ACTIVE",
      category: "TYPESCRIPT",
      createdAt: "2025-01-01T12:00:00.000Z",
      updatedAt: "2025-01-01T12:00:00.000Z",
      deletedAt: null,
    };

    expect(result.toDTO()).toEqual(expect.objectContaining(expected));
  });
  test("カテゴリー:HTTP、タイプ:MULTIPLE_CHOICEで問題を作成できる", async () => {
    beforeEach( () => {
    questionEntity = QuestionEntity.create(
      "HTTPステータスコードのうち、クライアントエラーを示すものはどれですか？（複数選択）",
      ["404 Not Found", "400 Bad Request"],
      ["200 OK", "301 Moved Permanently", "500 Internal Server Error"],
      "HTTPステータスコードは3桁の数字で、最初の数字によって5つのクラスに分類されます。「4xx」で始まるコードはクライアントエラーを示し、「404 Not Found」はリソースが見つからない場合、「400 Bad Request」はリクエストの構文が不正な場合に返されます。一方、「2xx」は成功、「3xx」はリダイレクト、「5xx」はサーバーエラーを示します。",
      "MULTIPLE_CHOICE",
      "ACTIVE",
      "HTTP",
    );
    })

    const result = await createQuestionUseCase.execute({
      text: "HTTPステータスコードのうち、クライアントエラーを示すものはどれですか？（複数選択）",
      correctAnswer: ["404 Not Found", "400 Bad Request"],
      alternativeAnswers: [
        "200 OK",
        "301 Moved Permanently",
        "500 Internal Server Error",
      ],
      explanation:
        "HTTPステータスコードは3桁の数字で、最初の数字によって5つのクラスに分類されます。「4xx」で始まるコードはクライアントエラーを示し、「404 Not Found」はリソースが見つからない場合、「400 Bad Request」はリクエストの構文が不正な場合に返されます。一方、「2xx」は成功、「3xx」はリダイレクト、「5xx」はサーバーエラーを示します。",
      type: "MULTIPLE_CHOICE",
      state: "ACTIVE",
      category: "HTTP",
    });

    const expected = {
      text: "HTTPステータスコードのうち、クライアントエラーを示すものはどれですか？（複数選択）",
      correctAnswer: ["404 Not Found", "400 Bad Request"],
      alternativeAnswers: [
        "200 OK",
        "301 Moved Permanently",
        "500 Internal Server Error",
      ],
      explanation:
        "HTTPステータスコードは3桁の数字で、最初の数字によって5つのクラスに分類されます。「4xx」で始まるコードはクライアントエラーを示し、「404 Not Found」はリソースが見つからない場合、「400 Bad Request」はリクエストの構文が不正な場合に返されます。一方、「2xx」は成功、「3xx」はリダイレクト、「5xx」はサーバーエラーを示します。",
      type: "MULTIPLE_CHOICE",
      state: "ACTIVE",
      category: "HTTP",
      createdAt: "2025-01-01T12:00:00.000Z",
      updatedAt: "2025-01-01T12:00:00.000Z",
      deletedAt: null,
    };

    expect(result.toDTO()).toEqual(expect.objectContaining(expected));
  });
});
