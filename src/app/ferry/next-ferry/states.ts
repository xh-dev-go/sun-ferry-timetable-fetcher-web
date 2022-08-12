import {createAction, createReducer, on} from "@ngrx/store";

export interface SomeState {
  value: number
}

export const first = 1

const BASE = "NextFerryComponent"
export const Add = createAction(`[${BASE}] Add`)
export const Deduct = createAction(`[${BASE}] Deduct`)
export const custReducer = createReducer(
  first,
  on(Add, (state) => {
    return state + 1
  }),
  on(Deduct, (state) => {
    return state - 1
  })
)
