import type { QuestionEntity } from "@/domain/entities/question";
import type { QuestionId } from "@/domain/value-objects/question/id.value-objects";

/** 問題リポジトリー */
export interface QuestionRepository {
  /** 問題を保存 */
  save(question: QuestionEntity): Promise<QuestionEntity>
  findById(id: QuestionId): Promise<QuestionEntity>
}
