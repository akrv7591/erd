declare module 'akrv-zustand-middleware-yjs' {
  import { StateCreator, StoreMutatorIdentifier } from 'zustand';
  import * as Y from 'yjs';

  type Yjs = <
    T extends unknown,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  >(
    doc: Y.Doc,
    name: string,
    f: StateCreator<T, Mps, Mcs>,
  ) => StateCreator<T, Mps, Mcs>;

  const _default: Yjs;
  export default _default;
}
