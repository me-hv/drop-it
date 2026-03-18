declare module "react" {
  export function useState<T>(initial: T): [T, (v: T) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function createElement(type: any, props: any, ...children: any[]): any;
  export type ReactNode = any;
  export type Key = string | number;
  export interface ChangeEvent<T = any> {
    target: { value: any };
  }
  export interface PropsWithChildren<P = {}> {
    children?: ReactNode;
  }
  export const Fragment: any;
  export const Component: any;
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
