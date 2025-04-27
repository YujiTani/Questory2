import type {
  CreatedAt,
  DeletedAt,
  UpdatedAt,
} from "@/domain/common/date.value-objects";

// 監査情報をもつエンティティの抽象クラス
export abstract class AuditableEntity<TId> {
  protected constructor(
    private readonly id: TId,
    protected readonly createdAt: CreatedAt,
    protected updatedAt: UpdatedAt,
    protected deletedAt: DeletedAt | null,
  ) {}

  getId(): TId {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt.getValue();
  }

  getUpdatedAt(): Date {
    return this.updatedAt.getValue();
  }

  getDeletedAt(): Date | null {
    return this.deletedAt?.getValue() || null;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
