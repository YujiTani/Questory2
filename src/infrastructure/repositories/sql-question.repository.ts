import { type PrismaClient } from "@prisma/client";

import type { QuestionRepository } from "@/domain/repositories/question.repository";

import { type QuestionEntity, questionTypes, type QuestionCategory, type QuestionState, type QuestionType, questionCategory, questionState } from "@/domain/entities/question"
import { type QuestionId } from "@/domain/value-objects/question/id.value-objects";


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
   * モデルからエンティティーに変換
   */
  toEntity(model: {
    id: string,
    text: string,
    correctAnswer: string[],
    alternativeAnswers: string[],
    explanation: string,
    type: number,
    state: number,
    category: number,
    createdAt: BigInt,
    updatedAt: BigInt,
    deletedAt: BigInt | null,
  }) {
    return {
      id: model.id,
      text: model.text,
      correctAnswer: model.correctAnswer,
      alternativeAnswers: model.alternativeAnswers,
      explanation: model.explanation,
      type: this.toEntity$type(model.type), 
      state: this.toEntity$state(model.state), 
      category: this.toEntity$category(model.category),
      createdAt: new Date(Number(model.createdAt)),
      updatedAt:  new Date(Number(model.updatedAt)),
      deletedAt: this.toEntity$deletedAt(model.deletedAt)
    }
  }

  /**
   * モデルをエンティティーに変換; 問題の種類
   * @param type number 問題の種類
   * @return QuestionType 数値をQuestionTypeに変換
   */
  toEntity$type(type: number): QuestionType {
    switch (type)
    {
      case 10:
        return questionTypes.select
      
      case 20:
        return questionTypes.multiple_choice

      case 30:
        return questionTypes.sort
      
      default:
        throw new Error(`${__filename}, 問題が想定外の値になっています ${type}`)
    }
  }
 
  /**
   * モデルをエンティティーに変換; 問題の状態
   * @param type number 問題の状態
   * @return QuestionType 数値をQuestionTypeに変換
   */
  toEntity$state(state: number): QuestionState {
    switch(state)
    {
      case 10:
        return questionState.active 

      case 20:
        return questionState.retry

      case 30:
        return questionState.last_attempt

      case 40:
        return questionState.skipped

      case 50:
        return questionState.difficult
      
    default:
      throw new Error(`${__filename}, 問題が想定外の状態になっています ${state}`)
    }
  }

  /**
   * モデルをエンティティーに変換; 問題の状態
   * @param type number 問題の状態
   * @return QuestionType 数値をQuestionTypeに変換
   */
  toEntity$category(category: number): QuestionCategory {
    switch(category)
    {
      case 10:
        return questionCategory.http

      case 20:
        return questionCategory.sql

      case 30:
        return questionCategory.typescript

    default:
      throw new Error(`${__filename}, 問題のカテゴリーが想定外の値になっています ${category}`)
    }
  }

  /**
   * モデルをエンティティーに変換; 論理削除フラグ
   * @param deletedAt BigInt | null
   * @return Date | null
   */
  toEntity$deletedAt(deletedAt: BigInt | null): Date | null {
    return deletedAt ? new Date(Number(deletedAt)) : null
  }

  /**
   * エンティティーをモデルに変換
   */
  toModel(entity: QuestionEntity) {
    return {
      uuid: entity.id,
      text: entity.text,
      correctAnswer: entity.correctAnswer,
      alternativeAnswers: entity.alternativeAnswers,
      explanation: entity.explanation,
      type: this.toModel$type(entity.type),
      state: this.toModel$state(entity.state),
      category: this.toModel$category(entity.category),
      createdAt: BigInt(entity.createdAt.getTime()),
      updatedAt: BigInt(entity.updatedAt.getTime()),
      deletedAt: entity.deletedAt ? BigInt(entity.deletedAt.getTime()): null,
    }
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

