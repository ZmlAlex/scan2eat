declare module "@uidotdev/usehooks" {
  // Add your type declarations here
  function useLockBodyScroll(): void;
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

declare module "tailwindcss-animate";
