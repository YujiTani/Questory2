import { Description } from "@/domain/value-objects/common/text.value-objects";
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

export interface PropertiesEssential
{
  text: string,
  correctAnswers: string[],
  alternativeAnswers: string[],
  explanation: string,
}

export interface Properties extends PropertiesEssential
{
  type: string,
  state: QuestionState,
  category: QuestionCategory,
  id: number | null,
  uuid: string | null,
  createdAt: Date,
  deletedAt: Date | null,
}

/**
 * 問題エンティティー
 */
export class QuestionEntity {
  private _id: number | null

  private _uuid: string | null

  private readonly _text: QuestionText

  private readonly _correctAnswers: QuestionText[]

  private readonly _alternativeAnswers: QuestionText[]

  private readonly _explanation: Description

  private readonly _type: string

  private _state: string

  private readonly _category: string

  private readonly _createdAt: Date

  private _deletedAt: Date | null
  
  private constructor(
    text: string,
    correctAnswers: string[],
    alternativeAnswers: string[],
    explanation: string,
    type?: string,
    state?: string,
    category?: string,
    id: number | null = null,
    uuid: string | null = null,
    createdAt: Date = new Date(),
    deletedAt: Date | null = null,
  ) {
    this._id = id
    this._uuid = uuid
    this._text = QuestionText.create(text)
    this._correctAnswers = correctAnswers.map(answer => QuestionText.create(answer))
    this._alternativeAnswers = alternativeAnswers.map(answer => QuestionText.create(answer))
    this._explanation = Description.create(explanation)
    this._type = type ?? questionTypes.select
    this._state = state ?? questionState.active
    this._category = category ?? questionCategory.sql
    this._createdAt = createdAt
    this._deletedAt = deletedAt
  }

  /**
   * 問題エンティティーを作成
   * @param properties 必須プロパティ
   * @return 問題エンティティー
   */
  static create(
    properties: PropertiesEssential
  ): QuestionEntity {
    return new QuestionEntity(
      properties.text,
      properties.correctAnswers,
      properties.alternativeAnswers,
      properties.explanation
    );
  }

  /**
   * モデルを問題エンティティーに変換; リポジトリーで呼び出す
   * @param properties 全プロパティー
   * @returns 問題エンティティー
   */
  static reconstruct(properties: Properties): QuestionEntity {
    return new QuestionEntity(
      properties.text,
      properties.correctAnswers,
      properties.alternativeAnswers,
      properties.explanation,
      properties.type,
      properties.state,
      properties.category,
      properties.id,
      properties.uuid,
      properties.createdAt,
      properties.deletedAt,
    )
  }

  /** Getter */
  get uuid() {
    return this._uuid;
  }

  public setUuid(uuid: string )
  {
    this._uuid = uuid;
  }

  get text() {
    return this._text;
  }

  get correctAnswers() {
    return this._correctAnswers
  }

  get alternativeAnswers() {
    return this._alternativeAnswers
  }

  get explanation() {
    return this._explanation
  }

  get type() {
    return this._type
  }

  get state() {
    return this._state;
  }

  private set setState(newState: QuestionState) {
    this._state = newState;
  }

  get category() {
    return this._category
  }

  get createdAt() {
    return this._createdAt
  }

  get deletedAt() {
    return this._deletedAt
  }

  	/**
	 * エンティティーが永続化されているか？
	 * @returns Yes/No
	 */
	isPersisted()
	{
		return !!this._id;
	}

  /**
   * 問題を取得する
   * @return 問題内容, 解答配列, 問題の出題形式, カテゴリー
   */
  get getQuestionInfo() {
    return {
      text: this.text,
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
      ...this._correctAnswers,
      ...this._alternativeAnswers
    ].sort(() => Math.random() - 0.5);
  }

  private get shuffleAnswersBySortType() {
    const answers = [
      ...this.correctAnswers,
      ...this.alternativeAnswers,
    ];
    const answerParts = answers.flat().toString().split(" ");
    return answerParts.sort(() => Math.random() - 0.5);
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
        throw new Error(`${__filename}, Invalid question type`);
    }
  }

  private isCorrectAnswerBySelectType(userAnswer: string) {
    return this.correctAnswers[0].getValue === userAnswer;
  }

  private isCorrectAnswerByMultipleChoiceType(userAnswer: string[]) {
    const correctAnswerValues = this.correctAnswers.map(
      (answer) => answer.getValue,
    );
    return userAnswer.every((answer) => correctAnswerValues.includes(answer));
  }

  /**
   * 問題に解答する
   * @param userAnswer ユーザーの解答 | ユーザーの選択した複数の選択肢
   * @returns 解答結果
   */
  public answerQuestion(userAnswer: string | string[]): boolean {
    // スキップ状態で問題を解答することはできない
    if (this.state === questionState.skipped) {
      throw new Error(`${__filename}, This question has been skipped`);
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
    switch (this.state) {
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
        throw new Error(`${__filename}, Invalid question state`);
    }

    return result;
  }
}
