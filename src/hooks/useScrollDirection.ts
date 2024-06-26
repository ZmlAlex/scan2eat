import _ from "lodash";
import * as React from "react";

const THRESHOLD = 0;

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = React.useState<"up" | "down">(
    "up"
  );

  const blocking = React.useRef(false);
  const prevScrollY = React.useRef(0);

  React.useEffect(() => {
    prevScrollY.current = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - prevScrollY.current) >= THRESHOLD) {
        const newScrollDirection =
          scrollY > prevScrollY.current ? "down" : "up";

        setScrollDirection(newScrollDirection);

        prevScrollY.current = scrollY > 0 ? scrollY : 0;
      }

      blocking.current = false;
    };

    const onScroll = () => {
      if (!blocking.current) {
        blocking.current = true;
        window.requestAnimationFrame(updateScrollDirection);
      }
    };

    // * optimize scroll perfomance
    const throttledOnScroll = _.throttle(onScroll, 200);

    window.addEventListener("scroll", throttledOnScroll);

    return () => window.removeEventListener("scroll", throttledOnScroll);
  }, [scrollDirection]);

  return scrollDirection;
};
