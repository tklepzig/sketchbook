export type Reducer<S, A> = (state: S, action: A) => S;

export interface ReducersMapObject {
    [key: string]: Reducer<any, any>;
  }
export function combineReducers<S>(reducers: ReducersMapObject): Reducer<S, any>;
