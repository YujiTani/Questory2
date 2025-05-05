import { AuditableEntity } from "@/domain/entities/auditable";
import { CreatedAt, DeletedAt, UpdatedAt } from "@/domain/value-objects/common/date.value-objects";
import { Description } from "@/domain/value-objects/common/text.value-objects";
import { QuestionId } from "@/domain/value-objects/question/id.value-objects";
import { QuestionText } from "@/domain/value-objects/question/text.value-objects";

/**
 * 問題の出題形式
 * - select: 選択肢から1つを選ぶ形式
 * - multiple_choice: 複数選択する形式
 * - sort: 並び替え形式
 */
export const questionTypes = {
  select: "SELECT",
  multiple_choice: "MULTIPLE_CHOICE",
  sort: "SORT",
} as const;
export type QuestionType = (typeof questionTypes)[keyof typeof questionTypes];

/**
 * 問題のカテゴリー
 * - sql: SQL問題
 * - http: HTTP問題
 * - typescript: TypeScript問題
 */
export const questionCategory = {
  sql: "SQL",
  http: "HTTP",
  typescript: "TYPESCRIPT",
} as const;
export type QuestionCategory =
  (typeof questionCategory)[keyof typeof questionCategory];

/**
 * 問題の状態
 * - active: 問題が出題されている状態
 * - retry: 問題が再出題されている状態
 * - last_attempt: 問題が最後の試行状態
 * - skipped: 問題がスキップされた状態
 * - difficult: 苦手問題として登録された状態
 */
export const questionState = {
  active: "ACTIVE",
  retry: "RETRY",
  last_attempt: "LAST_ATTEMPT",
  skipped: "SKIPPED",
  difficult: "DIFFICULT",
} as const;
export type QuestionState = (typeof questionState)[keyof typeof questionState];

/**
 * 問題エンティティー
 */
export class QuestionEntity extends AuditableEntity<QuestionId> {
  protected constructor(
    id: QuestionId,
    private text: QuestionText,
    private correctAnswer: QuestionText[],
    private alternativeAnswers: QuestionText[],
    private explanation: Description,
    private type: QuestionType, // default: select
    private state: QuestionState, // default: active
    private category: QuestionCategory, // default: SQL
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
    deletedAt: DeletedAt | null = null,
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  /**
   * 問題を作成
   */
  static create(
    text: string,
    correctAnswer: string[],
    alternativeAnswers: string[],
    explanation: string,
    type: QuestionType = questionTypes.select,
    state: QuestionState = questionState.active,
    category: QuestionCategory = questionCategory.sql,
  ): QuestionEntity {
    if (type !== "MULTIPLE_CHOICE" && correctAnswer.length > 1 ) {
      throw new Error("MULTIPLE_CHOICE以外のtypeでは、解答は一つしか許されない")
    }

    return new QuestionEntity(
      QuestionId.create(),
      QuestionText.create(text),
      correctAnswer.map((answer) => QuestionText.create(answer)),
      alternativeAnswers.map((answer) => QuestionText.create(answer)),
      Description.create(explanation),
      type,
      state,
      category,
      CreatedAt.create(),
      UpdatedAt.create(),
      DeletedAt.createNull(),
    );
  }

  /**
   * 問題を復元
   * DBから取得したデータを元に、問題エンティティーを復元
   */
  static reconstruct(
    id: QuestionId,
    text: QuestionText,
    correctAnswer: QuestionText[],
    alternativeAnswers: QuestionText[],
    explanation: Description,
    type: QuestionType,
    state: QuestionState,
    category: QuestionCategory,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
    deletedAt: DeletedAt | null,
  ): QuestionEntity {
    if (type !== "MULTIPLE_CHOICE" && correctAnswer.length > 1 ) {
      throw new Error("MULTIPLE_CHOICE以外のtypeでは、解答は一つしか許されない")
    }

    return new QuestionEntity(
      id,
      text,
      correctAnswer,
      alternativeAnswers,
      explanation,
      type,
      state,
      category,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  public get getState(): QuestionState {
    return this.state;
  }

  private set setState(newState: QuestionState) {
    this.state = newState;
    this.updatedAt.update();
  }

  /**
   * 問題を取得する
   * @return 問題内容, 解答配列, 問題の出題形式, カテゴリー
   */
  get getQuestionInfo() {
    return {
      text: this.text.getValue,
      answer:
        this.type === "MULTIPLE_CHOICE"
          ? this.shuffleAnswersBySortType
          : this.shuffleAnswers,
      type: this.type,
      category: this.category,
    };
  }

  private get shuffleAnswers() {
    return [
      ...this.correctAnswer.map(answer => answer.getValue),
      ...this.alternativeAnswers.map((answer) => answer.getValue),
    ].sort(() => Math.random() - 0.5);
  }

  private get shuffleAnswersBySortType() {
    const answers = [
      ...this.correctAnswer.map(answer => answer.getValue),
      ...this.alternativeAnswers.map((answer) => answer.getValue),
    ];
    const answerParts = answers.flat().toString().split(" ");
    return answerParts.sort(() => Math.random() - 0.5);
  }

  public get getExplanation() {
    return this.explanation.getValue;
  }

  private isCorrectAnswer(userAnswer: string | string[]): boolean {
    switch (this.type) {
      case questionTypes.select:
        return this.isCorrectAnswerBySelectType(userAnswer as string);
      case questionTypes.multiple_choice:
        return Array.isArray(userAnswer)
          ? this.isCorrectAnswerByMultipleChoiceType(userAnswer as string[])
          : false;
      case questionTypes.sort:
        return this.isCorrectAnswerBySelectType(userAnswer as string);
      default:
        throw new Error("Invalid question type");
    }
  }

  private isCorrectAnswerBySelectType(userAnswer: string) {
    return this.correctAnswer[0].getValue === userAnswer;
  }

  private isCorrectAnswerByMultipleChoiceType(userAnswer: string[]) {
    const correctAnswerValues = this.correctAnswer.map(answer => answer.getValue);
    return userAnswer.every((answer) => correctAnswerValues.includes(answer)
    );
  }

  /**
   * 問題に解答する
   * @param userAnswer ユーザーの解答 | ユーザーの選択した複数の選択肢
   * @returns 解答結果
   */
  public answerQuestion(userAnswer: string | string[]): boolean {
    // スキップ状態で問題を解答することはできない
    if (this.state === questionState.skipped) {
      throw new Error("This question has been skipped");
    }

    const result = this.isCorrectAnswer(userAnswer);

    // 苦手問題として登録されている状態で正答すると、Active状態に戻る
    if (result && this.state === questionState.difficult) {
      this.setState = questionState.active;
    }

    /**
     * 問題に間違えるたびに状態を変更
     * Active -> Retry
     * Retry -> LastAttempt
     * LastAttempt -> Skipped
     */
    switch (this.getState) {
      case questionState.active:
        this.setState = questionState.retry;
        break;
      case questionState.retry:
        this.setState = questionState.last_attempt;
        break;
      case questionState.last_attempt:
        this.setState = questionState.skipped;
        break;
      default:
        throw new Error("Invalid question state");
    }

    return result;
  }

  toDTO() {
    return {
      text: this.text.getValue,
      correctAnswer: this.correctAnswer.map(a => a.getValue),
      alternativeAnswers: this.alternativeAnswers.map(a => a.getValue),
      explanation: this.explanation.getValue,
      type: this.type,
      state: this.state,
      category: this.category,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString() || null,
    }
  }
}
