import type { QuestionEntity } from "@/domain/entities/question";

/** 問題リポジトリー */
export interface QuestionRepository {
  /** 問題を保存 */
  save(question: QuestionEntity): Promise<QuestionEntity>;
}
