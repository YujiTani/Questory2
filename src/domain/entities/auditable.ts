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
    protected readonly _id: TId,
    protected readonly _createdAt: CreatedAt,
    protected _updatedAt: UpdatedAt,
    protected _deletedAt: DeletedAt | null,
  ) {}

  get id(): TId {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt.getValue;
  }

  get updatedAt(): Date {
    return this._updatedAt.getValue;
  }

  get deletedAt(): Date | null {
    return this._deletedAt?.getValue || null;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  updateTimestamp(): void {
    this._updatedAt = this._updatedAt.update();
  }

  delete(value: Date): void {
    this._deletedAt = DeletedAt.create(value);
  }

  restore(): void {
    this._deletedAt = null;
  }
}
