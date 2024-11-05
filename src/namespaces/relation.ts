export namespace RELATION {
  export enum TYPE {
    ONE = 'one',
    MANY = 'many',
  }

  export enum NAME {
    ONE_TO_ONE = `${TYPE.ONE}-to-${TYPE.ONE}`,
    ONE_TO_MANY = `${TYPE.ONE}-to-${TYPE.MANY}`,
    MANY_TO_MANY = `${TYPE.MANY}-to-${TYPE.MANY}`,
  }

  export const NAME_LIST = Array.from(Object.values(NAME))
}
