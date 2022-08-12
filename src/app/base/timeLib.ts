import {Scopes} from "pyyqww_t1/dist/Scoping/Scopes";

export module time {
  const dayMs = 86400000

  export function toDay(): Date {
    return new Date()
  }

  export function tmr(date: Date): Date {
    return Scopes.of(new Date(date)).apply((it) => it.setTime(it.getTime() + dayMs)).get()
  }

  export function yesterday(date: Date): Date {
    return Scopes.of(new Date(date)).apply((it) => it.setTime(it.getTime() - dayMs)).get()
  }

  export class CountDownTo {
    diffDate: number = 0

    constructor(private date: Date) {
      this.diffDate = date.getTime() - new Date().getTime()
    }

    days(): number {
      return Math.floor(this.diffDate / (1000 * 60 * 60 * 24));
    }

    hours(): number {
      return Math.floor((this.diffDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    }

    minutes(): number {
      return Math.floor((this.diffDate % (1000 * 60 * 60)) / (1000 * 60));
    }

    seconds(): number {
      return Math.floor((this.diffDate % (1000 * 60)) / 1000);
    }

    private innerFormat(): number[] {
      const days = this.days();
      const hours = this.hours();
      const minutes = this.minutes();
      const seconds = this.seconds();
      return [days, hours, minutes, seconds]
    }

    format() {
      const f = this.innerFormat()
      const days = f[0]
      const hours = f[1]
      const mins = f[2]
      const seconds = f[3]

      let msg = ""
      if (days > 0) {
        if (days == 1) {
          msg += ` ${days} day`
        } else {
          msg += ` ${days} days`
        }
      }
      if (hours > 0) {
        if (hours == 1) {
          msg += ` ${hours} hour`
        } else {
          msg += ` ${hours} hours`
        }
      }
      if (mins > 0) {
        if (mins == 1) {
          msg += ` ${mins} minute`
        } else {
          msg += ` ${mins} minutes`
        }
      }
      if (seconds == 1) {
        msg += ` ${seconds} second`
      } else {
        msg += ` ${seconds} seconds`
      }

      return msg
    }

  }
}
