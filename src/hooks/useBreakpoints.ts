import React from "react";
import { type Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";

// TODO: TRANSFORM INTO ES?
import * as tailwindConfig from "../../tailwind.config.cjs";

const fullConfig = resolveConfig(tailwindConfig as unknown as Config);
const breakpoints = fullConfig.theme?.screens as Record<
  "sm" | "md" | "lg" | "xl" | "2xl",
  string
>;

export function useBreakpoint(breakpointKey: keyof typeof breakpoints) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(
      `(min-width: ${breakpoints[breakpointKey]})`
    );
    const listener = () => setMatches(!!mediaQueryList.matches);
    listener();
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [breakpointKey]);

  return matches;
}
