"use client";
import { useEffect, useState, type RefObject } from "react";

export function useSceneActivity(element: RefObject<HTMLElement | null>) {
  const [hidden, setHidden] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    if (element.current) observer.observe(element.current);
    return () => { document.removeEventListener("visibilitychange", update); observer.disconnect(); };
  }, [element]);
  return hidden || offscreen;
}
