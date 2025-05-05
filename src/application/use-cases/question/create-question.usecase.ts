import type { CreateQuestionDto } from "@/application/dtos/question.dto";
import type { QuestionRepository } from "@/domain/repositories/question.repository";

import { QuestionEntity } from "@/domain/entities/question";


export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  /** 実行メソッド */
  async execute(dto: CreateQuestionDto): Promise<QuestionEntity> {
    // MEMO： validationは、手前でしてるはずなのでここでは行わない
    const question = QuestionEntity.create(
      dto.text,
      dto.correctAnswer,
      dto.alternativeAnswers,
      dto.explanation,
      dto.type,
      dto.state,
    );

    // エラーハンドリングはquestionRepositoryの中で行う
    await this.questionRepository.save(question)
    return question
  }
}
