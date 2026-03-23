import Link from 'next/link';
import { CidadeTagCard } from './CidadeTagCard';

type CidadeCardProps = {
  item: any;
};

export function CidadeCard({ item }: CidadeCardProps) {
  return (
    <Link
      href={`/cidade/${item.id}`}
      className="cursor-pointer"
    >
      <div className="cidade-card">
        <h2 className="text-2xl">{item.nome}</h2>

        <div className="flex-1 flex items-center justify-center">
          <p className="mt-2 line-clamp-3">
            {item.descricao}
          </p>
        </div>

        <div>
          {item.tags.length > 0 && <hr className="my-3" />}
          <CidadeTagCard tags={item.tags} />
        </div>
      </div>
    </Link>
  );
}