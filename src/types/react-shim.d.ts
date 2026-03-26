declare module "react" {
  export function useState<T>(initial: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initial?: T | null): { current: T | null };
  export function createElement(type: any, props: any, ...children: any[]): any;
  export type ReactNode = any;
  export type Key = string | number;
  export interface MouseEvent<T = Element> {
    stopPropagation(): void;
    preventDefault(): void;
    target: T;
  }
  export interface ChangeEvent<T = any> {
    target: { value: any };
  }
  export interface PropsWithChildren<P = {}> {
    children?: ReactNode;
  }
  export const Fragment: any;
  export const Component: any;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;
  export default any;
}

declare namespace JSX {
  interface IntrinsicElements {
    div: any;
    span: any;
    p: any;
    main: any;
    h1: any;
    textarea: any;
    button: any;
    article: any;
  }
}
