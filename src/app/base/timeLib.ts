import { Injectable } from '@angular/core';
import {Scopes} from "pyyqww_t1/dist/Scoping/Scopes";

export module time{
  const dayMs = 86400000
  export function toDay():Date{
    return new Date()
  }
  export function tmr(date: Date):Date{
    return Scopes.of(new Date(date)).apply((it) => it.setTime(it.getTime() + dayMs)).get()
  }
  export function yesterday(date: Date):Date{
    return Scopes.of(new Date(date)).apply((it) => it.setTime(it.getTime() - dayMs)).get()
  }
}
