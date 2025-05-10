import { type PrismaClient } from "@prisma/client";

import type { QuestionRepository } from "@/domain/repositories/question.repository";
import type { QuestionId } from "@/domain/value-objects/question/id.value-objects";

import { QuestionEntity } from "@/domain/entities/question";
import type { QuestionCategory, QuestionState, QuestionType } from "@/domain/entities/question"

export class SQLQuestionRepository implements QuestionRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * エンティティーを永続化
   * @param question QuestionEntity
   */
  async save(question: QuestionEntity): Promise<void> {
    // entityをDB保存用のデータに変換
    model = this.toModel(question)

    this.prisma.question.create({
      data: {
        ...model,
      },
    });
  }

  /**
   * uuidに一致する問題を取得
   * @param id QuestionId
   */
  async findByUuid(id: QuestionId): Promise<QuestionEntity> {
    model = this.toModel()

    const result = this.prisma.question.findUnique({
      where: {
        id: model.id,
        deletedAt: null
      }
    })

    return result
  }

  /**
   * エンティティーをモデルに変換
   */
  toModel(entity: QuestionEntity) {
    id: entity.id,
    uuid: entity.uuid,
    text: entity.text,
    correctAnswer: entity.correctAnswer,
    alternativeAnswers: entity.alternativeAnswers,
    explanation: entity.explanation,
    type: this.toModel$type(entity.type),
    state: this.toModel$state(entity.state),
    category: this.toModel$category(entity.category),
    createdAt: BigInt(entity.createdAt.getTime),
    updatedAt: BigInt(entity.updatedAt.getTime),
    deletedAt: entity.getDeletedAt ? BigInt(entity.getDeletedAt?.getTime): null,
  }

/**
 * エンティティーをモデルに変換; 問題の種類
 * @param type 問題の種類
 * @return number DBでは数値として扱う
 */
  toModel$type(type: QuestionType): number {
    switch(type)
    {
    case "SELECT":
      return 10;

    case "MULTIPLE_CHOICE":
      return 20

    case "SORT":
      return 30 

    default:
      throw new Error(`${__filename}, 問題が想定外の種類になっています ${type}`)
    }
  }

/**
 * エンティティーをモデルに変換; 問題の状態
 * @param state 問題の状態
 * @return number DBでは数値として扱う
 */
  toModel$state(state: QuestionState): number {
    switch(state)
    {
    case "ACTIVE":
      return 10;

    case "RETRY":
      return 20

    case "LAST_ATTEMPT":
      return 30 
    
    case "SKIPPED":
      return 40
    
    case "DIFFICULT":
      return 50

    default:
      throw new Error(`${__filename}, 問題が想定外の状態になっています ${state}`)
    }
  }

/**
 * エンティティーをモデルに変換; 問題の状態
 * @param category 問題の状態
 * @return number DBでは数値として扱う
 */
  toModel$category(category: QuestionCategory): number {
    switch(category)
    {
    case "HTTP":
      return 10;

    case "SQL":
      return 20

    case "TYPESCRIPT":
      return 30 
    
    default:
      throw new Error(`${__filename}, 問題が想定外のカテゴリーになっています ${category}`)
    }
  }
}

