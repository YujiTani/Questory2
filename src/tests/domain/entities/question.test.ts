import { test, expect, describe, beforeEach, afterEach } from "bun:test";

import { QuestionEntity } from "@/domain/entities/question";
import { CreatedAt, UpdatedAt } from "@/domain/value-objects/common/date.value-objects";
import { Description } from "@/domain/value-objects/common/text.value-objects";
import { QuestionId } from "@/domain/value-objects/question/id.value-objects";
import { QuestionText } from "@/domain/value-objects/question/text.value-objects";

describe("QuestionEntity", () => {
  // テスト用のデータ
  const sampleText = "SQLのSELECT文で全てのカラムを選択するには？";
  const sampleCorrectAnswer = "SELECT * FROM table_name";
  const sampleAlternativeAnswers = [
    "SELECT ALL FROM table_name",
    "SELECT COLUMNS FROM table_name",
    "GET * FROM table_name",
  ];
  const sampleExplanation =
    "SELECT文では * を使用することで全てのカラムを選択できます。";
  let questionEntity: QuestionEntity;

  describe("静的メソッド", () => {
    beforeEach(() => {
      // 各テスト前に新しいQuestionEntityを生成
      questionEntity = QuestionEntity.create(
        sampleText,
        sampleCorrectAnswer,
        sampleAlternativeAnswers,
        sampleExplanation,
      );
    });

    afterEach(() => {
      // 各テスト後にquestionEntityをnullにリセット
      questionEntity = QuestionEntity.create(
        sampleText,
        sampleCorrectAnswer,
        sampleAlternativeAnswers,
        sampleExplanation,
      );
    });

    test("create() - 問題を作成できる", () => {
      expect(questionEntity).toBeInstanceOf(QuestionEntity);
      expect(questionEntity.getId).toBeDefined();
      const info = questionEntity.getQuestionInfo;
      expect(info.type).toBe("SELECT");
      expect(info.category).toBe("SQL");
    });

    test("create() - カスタムパラメータで問題を作成できる", () => {
      const question = QuestionEntity.create(
        sampleText,
        sampleCorrectAnswer,
        sampleAlternativeAnswers,
        sampleExplanation,
        "MULTIPLE_CHOICE",
        "ACTIVE",
        "TYPESCRIPT",
      );

      const info = question.getQuestionInfo;
      expect(info.type).toBe("MULTIPLE_CHOICE");
      expect(info.category).toBe("TYPESCRIPT");
    });

    test("reconstruct() - 問題を復元できる", () => {
      const id = QuestionId.create();
      const text = QuestionText.create(sampleText);
      const correctAnswer = QuestionText.create(sampleCorrectAnswer);
      const alternativeAnswers = sampleAlternativeAnswers.map((a) =>
        QuestionText.create(a),
      );
      const explanation = Description.create(sampleExplanation);
      const createdAt = CreatedAt.create();
      const updatedAt = UpdatedAt.create();
      const deletedAt = null;

      const question = QuestionEntity.reconstruct(
        id,
        text,
        correctAnswer,
        alternativeAnswers,
        explanation,
        "SELECT",
        "ACTIVE",
        "SQL",
        createdAt,
        updatedAt,
        deletedAt,
      );

      expect(question).toBeInstanceOf(QuestionEntity);
      expect(question.getId).toBe(id);
    });
  });

  describe("問題情報の取得", () => {
    test("getQuestionInfo - 問題情報が正しく取得できる", () => {
      const info = questionEntity.getQuestionInfo;
      expect(info.text).toBe("SQLのSELECT文で全てのカラムを選択するには？");
      expect(info.answer.length).toBe(4);
      expect(info.answer.includes("SELECT * FROM table_name")).toBe(true);
      expect(info.answer.includes("SELECT ALL FROM table_name")).toBe(true);
      expect(info.answer.includes("SELECT COLUMNS FROM table_name")).toBe(true);
      expect(info.answer.includes("GET * FROM table_name")).toBe(true);
      expect(info.type).toBe("SELECT");
      expect(info.category).toBe("SQL");
    });

    test("getExplanation - 説明文が正しく取得できる", () => {
      expect(questionEntity.getExplanation).toBe(
        "SELECT文では * を使用することで全てのカラムを選択できます。",
      );
    });

    test("shuffleAnswers - 選択肢をシャッフルする", () => {
      const info1 = questionEntity.getQuestionInfo;
      const info2 = questionEntity.getQuestionInfo;
      expect(info1.answer.length).toBe(4);
      expect(info2.answer.length).toBe(4);
      expect(info1.answer).not.toEqual(info2.answer);
    });
  });

  describe("問題解答のテスト", () => {
    test("answerQuestion - 正解の場合はtrueを返す", () => {
      const result = questionEntity.answerQuestion("SELECT * FROM table_name");
      expect(result).toBe(true);
    });

    test("answerQuestion - 不正解の場合はfalseを返す", () => {
      const result = questionEntity.answerQuestion(
        "SELECT ALL FROM table_name",
      );
      expect(result).toBe(false);
    });

    test("answerQuestion - multiple_choiceタイプの問題で正解の場合", () => {
      const multipleChoiceQuestion = QuestionEntity.create(
        "TypeScriptの基本型を選択してください",
        "string number boolean",
        ["object array function", "any unknown never"],
        "TypeScriptの基本型はstring, number, booleanです。",
        "MULTIPLE_CHOICE",
      );

      const result = multipleChoiceQuestion.answerQuestion([
        "string",
        "number",
        "boolean",
      ]);
      expect(result).toBe(true);
    });

    test("answerQuestion - multiple_choiceタイプの問題で不正解の場合", () => {
      const multipleChoiceQuestion = QuestionEntity.create(
        "TypeScriptの基本型を選択してください",
        "string number boolean",
        ["object array function", "any unknown never"],
        "TypeScriptの基本型はstring, number, booleanです。",
        "MULTIPLE_CHOICE",
      );

      const result = multipleChoiceQuestion.answerQuestion([
        "string",
        "object",
      ]);
      expect(result).toBe(false);
    });

    test("answerQuestion - 不正なタイプの問題でエラーを投げる", () => {
      const invalidQuestion = QuestionEntity.reconstruct(
        QuestionId.create(),
        QuestionText.create(sampleText),
        QuestionText.create(sampleCorrectAnswer),
        sampleAlternativeAnswers.map((a) => QuestionText.create(a)),
        Description.create(sampleExplanation),
        // @ts-expect-error 不正なタイプを指定
        "INVALID_TYPE",
        "ACTIVE",
        "SQL",
        CreatedAt.create(),
        UpdatedAt.create(),
        null,
      );

      expect(() => invalidQuestion.answerQuestion("test")).toThrow(
        "Invalid question type",
      );
    });

    test("answerQuestion - skipped状態の問題で解答するとエラーを投げる", () => {
      const skippedQuestion = QuestionEntity.create(
        sampleText,
        sampleCorrectAnswer,
        sampleAlternativeAnswers,
        sampleExplanation,
        "SELECT",
        "SKIPPED",
      );

      expect(() => skippedQuestion.answerQuestion("test")).toThrow(
        "This question has been skipped",
      );
    });
  });

  describe("問題状態の変更", () => {
    // FIXME: テストの修正をする
    // test("問題に不正解すると状態がactiveからretryに変わる", () => {
    //   expect(questionEntity.answerQuestion("SELECT ALL FROM table_name")).toBe(false);
    //   expect(questionEntity.getState).toBe("RETRY");
    // });

    // FIXME: テストの修正をする
    // test("問題に連続で不正解すると状態がretry→last_attempt→skippedに変わる", () => {
    //   expect(questionEntity.answerQuestion("SELECT ALL FROM table_name")).toBe(false);
    //   expect(questionEntity.answerQuestion("SELECT ALL FROM table_name")).toBe(false);
    //   expect(questionEntity.getState).toBe("LAST_ATTEMPT");
    // });

    // FIXME: テストの修正をする
    // test("difficult状態の問題に正解するとactive状態に戻る", () => {
    //   // difficult状態の問題を作成
    //   const difficultQuestion = QuestionEntity.create(
    //     sampleText,
    //     sampleCorrectAnswer,
    //     sampleAlternativeAnswers,
    //     sampleExplanation,
    //     "SELECT",
    //     "DIFFICULT"
    //   );

    //   expect(difficultQuestion.answerQuestion(sampleCorrectAnswer)).toBe(true);
    //   expect(difficultQuestion.getState).toBe("ACTIVE");
    // });

    test("不正な状態の問題でエラーを投げる", () => {
      const invalidQuestion = QuestionEntity.reconstruct(
        QuestionId.create(),
        QuestionText.create(sampleText),
        QuestionText.create(sampleCorrectAnswer),
        sampleAlternativeAnswers.map((a) => QuestionText.create(a)),
        Description.create(sampleExplanation),
        "SELECT",
        // @ts-expect-error テスト用に不正な値を設定
        "INVALID_STATE",
        "SQL",
        CreatedAt.create(),
        UpdatedAt.create(),
        null,
      );

      expect(() => invalidQuestion.answerQuestion(sampleCorrectAnswer)).toThrow(
        "Invalid question state",
      );
    });
  });
});
