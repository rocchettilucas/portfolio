"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type JSX,
  type ReactNode,
} from "react";

export default function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  // `as` is constrained to intrinsic HTML tags (all of which forward refs); the local
  // widening keeps TS from expanding the full IntrinsicElements union at the JSX call site.
  const Tag = as as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
