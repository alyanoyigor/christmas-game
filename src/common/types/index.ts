export type HTMLElementEvent<U extends Event, T extends HTMLElement> =
  | U
  | {
      target: T;
      currentTarget: T;
    };
