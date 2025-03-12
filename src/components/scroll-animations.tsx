"use client";

import { useEffect, useRef } from 'react';

interface ScrollAnimationsProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-in';
  delay?: number;
}

export function ScrollAnimations({ children, animation = 'fade-up', delay = 0 }: ScrollAnimationsProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up':
        return 'opacity-0 translate-y-8';
      case 'fade-in':
        return 'opacity-0';
      case 'slide-in':
        return 'opacity-0 -translate-x-8';
      default:
        return 'opacity-0';
    }
  };

  const getTransitionStyle = () => {
    return {
      transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    };
  };

  return (
    <div
      ref={elementRef}
      className={`transform ${getAnimationClass()} [&.animate]:opacity-100 [&.animate]:translate-y-0 [&.animate]:translate-x-0`}
      style={getTransitionStyle()}
    >
      {children}
    </div>
  );
}