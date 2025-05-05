export interface Iterator<T> {
  // 次の要素があるのか確認
  hasNext(): boolean;

  // 次の要素を取得
  next(): T | null;

  // 現在の要素取得
  current(): T | null;
}

export interface Aggregate<T> {
  // イテレータを取得
  getIterator(): Iterator<T>;
}
