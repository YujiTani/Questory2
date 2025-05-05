import {
  DeletedAt,
  type UpdatedAt,
  type CreatedAt,
} from "@/domain/value-objects/common/date.value-objects";

/**
 * 監査情報エンティティー
 */
export abstract class AuditableEntity<TId> {
  protected constructor(
    private readonly id: TId,
    protected readonly createdAt: CreatedAt,
    protected updatedAt: UpdatedAt,
    protected deletedAt: DeletedAt | null,
  ) {}

  get getId(): TId {
    return this.id;
  }

  get getCreatedAt(): Date {
    return this.createdAt.getValue;
  }

  getUpdatedAt(): Date {
    return this.updatedAt.getValue;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt?.getValue || null;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  updateTimestamp(): void {
    this.updatedAt = this.updatedAt.update();
  }

  delete(value: Date): void {
    this.deletedAt = DeletedAt.create(value);
  }

  restore(): void {
    this.deletedAt = null;
  }
}
