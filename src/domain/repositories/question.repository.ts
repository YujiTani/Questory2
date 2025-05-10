import type { QuestionEntity } from "@/domain/entities/question";
import type { QuestionId } from "@/domain/value-objects/question/id.value-objects";

/** 問題リポジトリーインターフェース */
export interface QuestionRepository {
  // 必須メソッド
  save(question: QuestionEntity): Promise<void>;
  findByUuid(id: QuestionId): Promise<QuestionEntity>;
}
