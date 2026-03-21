'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import "../cidade/page.css"

export function CidadeTagCard({ tags }: any) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasScroll, setHasScroll] = useState(false);

  // Redirecionar corretamente ao clicar em uma categoria
  const handleTagClick = (e: any, tag: any) => {
    e.stopPropagation()
    router.push(`/categoria/${tag.tag}`)
  }

  // Alterar funcionamento do scroll sobre as categorias
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const checkScroll = () => {
      setHasScroll(container.scrollWidth > container.clientWidth);
    };

    const handleWheel = (e: WheelEvent) => {
      const isScrollingRight = e.deltaY > 0;
      const isScrollingLeft = e.deltaY < 0;

      const atStart = container.scrollLeft === 0;
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;

      if ((isScrollingRight && !atEnd) || (isScrollingLeft && !atStart)) {
        e.preventDefault();
        container.scrollBy({left: e.deltaY, behavior: 'smooth'});
      }
    };

    checkScroll();
    container.addEventListener('wheel', handleWheel)
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', checkScroll);
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`flex flex-row flex-nowrap gap-1.5 mt-2 overflow-x-auto scrollbar-hide 
                ${hasScroll ? 'justify-start' : 'justify-center'}`}
    >
      {tags.map((tag: any) => (
        <button
          key={tag.id}
          className="cidade-tag-card mt-1"
          onClick={(e) => handleTagClick(e, tag)}
        >
          <h3>{tag.tag}</h3>
        </button>
      ))}
    </div>
  );
}