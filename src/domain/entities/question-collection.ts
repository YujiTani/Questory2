import { AuditableEntity } from "@/domain/entities/auditable";
import {
  questionCategory,
  type QuestionCategory,
  type QuestionEntity,
} from "@/domain/entities/question";
import {
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from "@/domain/value-objects/common/date.value-objects";
import { type Name } from "@/domain/value-objects/common/text.value-objects";
import { QuestionCollectionId } from "@/domain/value-objects/question-collection/id.value-objects";

export const questionCollectionState = {
  active: "ACTIVE",
  waited: "WAITED",
  cleared: "CLEARED",
} as const;
export type QuestionCollectionState =
  (typeof questionCollectionState)[keyof typeof questionCollectionState];

export class QuestionCollectionEntity extends AuditableEntity<QuestionCollectionId> {
  protected constructor(
    id: QuestionCollectionId,
    private name: Name,
    private questions: QuestionEntity[],
    private state: QuestionCollectionState,
    private category: QuestionCategory,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
    deletedAt: DeletedAt | null = null,
  ) {
    super(id, createdAt, updatedAt, deletedAt);
  }

  /**
   * 問題コレクションを作成
   */
  static create(
    name: Name,
    questions: QuestionEntity[],
    state: QuestionCollectionState = questionCollectionState.waited,
    category: QuestionCategory = questionCategory.sql,
  ): QuestionCollectionEntity {
    return new QuestionCollectionEntity(
      QuestionCollectionId.create(),
      name,
      questions,
      state,
      category,
      CreatedAt.create(),
      UpdatedAt.create(),
      DeletedAt.createNull(),
    );
  }

  /**
   * 問題コレクションを復元
   * DBから取得したデータを元に、問題コレクションエンティティーを復元
   */
  static reconstruct(
    id: QuestionCollectionId,
    name: Name,
    questions: QuestionEntity[],
    state: QuestionCollectionState,
    category: QuestionCategory,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
    deletedAt: DeletedAt,
  ): QuestionCollectionEntity {
    return new QuestionCollectionEntity(
      id,
      name,
      questions,
      state,
      category,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  setState(newState: QuestionCollectionState) {
    this.state = newState;
    this.updatedAt.update();
  }
}
