import Link from 'next/link';
import { CidadeTagCard } from '../_components/CidadeTagCard';

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
        <p className="mt-2">{item.descricao}</p>

        {item.tags.length > 0 && <hr className="my-3" />}

        <CidadeTagCard tags={item.tags} />
      </div>
    </Link>
  );
}