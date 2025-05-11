import type { QuestionEntity } from "@/domain/entities/question";

/** 問題リポジトリーインターフェース */
export interface QuestionRepository {
  // 必須メソッド
  save(question: QuestionEntity): Promise<void>;
  findByUuid(id: string): Promise<QuestionEntity>;
}
