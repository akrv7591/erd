export type SetStateObject<S> = (obj: Partial<S> | ((obj: S) => Partial<S>)) => void
