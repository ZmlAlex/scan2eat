declare module "@uidotdev/usehooks" {
  // Add your type declarations here
  function useLockBody(): void;
  function useIntersectionObserver(options: {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
  }): [
    symbol,
    {
      isIntersecting: boolean;
      isVisible: boolean;
      [key: string]: string;
    }
  ];
}
