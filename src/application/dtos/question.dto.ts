import type { QuestionCategory, QuestionState, QuestionType } from "@/domain/entities/question";

export interface CreateQuestionDto {
  text: string;
  correctAnswer: string;
  alternativeAnswers: string[];
  explanation: string;
  type?: QuestionType;
  state?: QuestionState;
  category?: QuestionCategory;
}
