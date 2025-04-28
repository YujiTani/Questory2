import { AuditableEntity } from "@/domain/common/auditable";
import {
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from "@/domain/common/date.value-objects";
import { Description } from "@/domain/common/text.value-objects";
import { QuestionId } from "@/domain/question/id.value-objects";
import { QuestionText } from "@/domain/question/text.value-objects";

/**
 * 問題の出題形式
 * - select: 選択肢から1つを選ぶ形式
 * - multiple_choice: 複数選択する形式
 * - sort: 並び替え形式
 */
export const _questionTypes = {
  select: "SELECT",
  multiple_choice: "MULTIPLE_CHOICE",
  sort: "SORT",
} as const;
export type QuestionType = (typeof _questionTypes)[keyof typeof _questionTypes];

/**
 * 問題のカテゴリー
 * - sql: SQL問題
 * - http: HTTP問題
 * - typescript: TypeScript問題
 */
export const _questionCategory = {
  sql: "SQL",
  http: "HTTP",
  typescript: "TYPESCRIPT",
} as const;
export type QuestionCategory =
  (typeof _questionCategory)[keyof typeof _questionCategory];

/**
 * 問題の状態
 * - active: 問題が出題されている状態
 * - retry: 問題が再出題されている状態
 * - last_attempt: 問題が最後の試行状態
 * - skipped: 問題がスキップされた状態
 * - difficult: 苦手問題として登録された状態
 */
export const _status = {
  active: "ACTIVE",
  retry: "RETRY",
  last_attempt: "LAST_ATTEMPT",
  skipped: "SKIPPED",
  difficult: "DIFFICULT",
} as const;
export type Status = (typeof _status)[keyof typeof _status];

/**
 * 問題エンティティー
 */
export class QuestionEntity extends AuditableEntity<QuestionId> {
  protected constructor(
    id: QuestionId,
    private text: QuestionText,
    private correctAnswer: QuestionText,
    private alternativeAnswers: QuestionText[],
    private explanation: Description,
    private type: QuestionType, // default: select
    private state: Status, // default: active
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
    correctAnswer: string,
    alternativeAnswers: string[],
    explanation: string,
    type: QuestionType = _questionTypes.select,
    state: Status = _status.active,
    category: QuestionCategory = _questionCategory.sql,
  ): QuestionEntity {
    return new QuestionEntity(
      QuestionId.create(),
      QuestionText.create(text),
      QuestionText.create(correctAnswer),
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
    correctAnswer: QuestionText,
    alternativeAnswers: QuestionText[],
    explanation: Description,
    type: QuestionType,
    state: Status,
    category: QuestionCategory,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
    deletedAt: DeletedAt | null,
  ): QuestionEntity {
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
}
