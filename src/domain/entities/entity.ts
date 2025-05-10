// エンティティーのベースクラス
export interface PropertiesCore
{
	id?: number;
}

export default abstract class Entity<T extends PropertiesCore>
{
	protected readonly properties: T;

	protected constructor(properties: T)
	{
		this.properties = properties;
	}

	/**
	 * エンティティーのプロパティーを取得
	 * @returns プロパティー
	 */
	getProperties(): T
	{
		return this.properties;
	}

	/**
	 * エンティティーが永続化されているか？
	 * @returns Yes/No
	 */
	persisted(): boolean
	{
		return this.properties.id !== undefined;
	}

	/**
	 * IDを取得
	 * @returns ID
	 */
	get id(): number
	{
		if(this.properties.id === undefined)
		{
			throw new Error(`${__filename}, ID is not set yet`);
		}

		return this.properties.id;
	}

	/**
	 * IDを設定（リポジトリーから呼び出す）
	 * @param id 新しいID
	 */
	set _id(id: number)
	{
		if(this.properties.id !== undefined)
		{
			// すでに設定されている場合はエラー
			throw new Error(`${__filename}, ID is already set`);
		}

		this.properties.id = id;
	}
}
