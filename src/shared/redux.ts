import * as redux from "redux";

export type Reducer<S, A> = (state: S, action: A) => S;

export type ReducersMapObject<S> = {
  [P in keyof S]: Reducer<S[P], any>;
};

export function combineReducers<S>(reducers: ReducersMapObject<S>): Reducer<S, any> {
  const map: redux.ReducersMapObject = {};
  for (const key in reducers) {
    if (reducers.hasOwnProperty(key)) {
      const reducer = reducers[key];
      map[key] = reducer;
    }
  }
  return redux.combineReducers(map);
}
