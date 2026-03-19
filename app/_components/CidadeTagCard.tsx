'use client';

import { useRouter } from 'next/navigation';
import "../cidade/page.css"

export function CidadeTagCard({ tags }: any) {
  const router = useRouter()

  const handleTagClick = (e: any, tag: any) => {
    e.stopPropagation()
    router.push(`/categoria/${tag.tag}`)
  };

  return (
    <div className="flex flex-row gap-1.5 justify-center mt-2">
      {tags.map((tag: any) => (
        <button
          key={tag.id}
          className="cidade-tag-card"
          onClick={(e) => handleTagClick(e, tag)}
        >
          <h3>{tag.tag}</h3>
        </button>
      ))}
    </div>
  );
}