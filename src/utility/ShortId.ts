import {init} from "@paralleldrive/cuid2";

const create = init({
  length: 5,
})

export class ShortId {
  static create = create
}
