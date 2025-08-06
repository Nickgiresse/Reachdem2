"use client";


import { useEffect, useRef, type ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
}

export default function ScrollAnimation({ children }: ScrollAnimationProps) {
  // Using NodeListOf<Element> type for the tags ref
  const tagsRef = useRef<NodeListOf<Element> | null>(null);

  const handleScroll = () => {
    const pageTop = window.scrollY;
    const pageBottom = pageTop + window.innerHeight;

    if (!tagsRef.current) return;

    tagsRef.current.forEach((tag) => {
      if (!tag) return;

      const tagTop = tag.getBoundingClientRect().top + pageTop;
      if (tagTop < pageBottom) {
        tag.classList.add("visible");
      } else {
        tag.classList.remove("visible");
      }
    });
  };

  useEffect(() => {
    // Initialize refs after component mounts
    tagsRef.current = document.querySelectorAll(".div");

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Run once to check initial positions
    handleScroll();

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <>{children}</>;
}
