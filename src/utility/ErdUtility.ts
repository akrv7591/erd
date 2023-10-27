import {IErd} from "../atoms/erdsAtom";

export class ErdUtility {
  private erd: IErd

  constructor(erd: IErd) {
    this.erd = erd
  }

  get nodes() {
    return this.erd.nodes
  }
}
