import Link from 'next/link';
import Image from 'next/image';
import { converterData, getS3URL } from '@/funcoes/helpers';

type EventoCardProps = {
  item: any;
};

export function EventoCard({ item }: EventoCardProps) {
  return (
    <Link
      href={`/evento/${item.id}`}
      className="cursor-pointer"
    >
      <div className="bg-gray-300 w-120 h-80 rounded-xl shadow-sm">
        <div className="relative w-120 h-60 text-center">
          <Image
            src={item.imagem ? getS3URL(item.imagem.chaveS3) : "/placeholder.png"}
            alt={item.imagem?.nome || "placeholder"}
            fill
            className="object-cover rounded-t-xl"
          />
        </div>

        <div className="px-4 py-3 text-shadow-xs">
          <h2 className="text-xl">{item.nome}</h2>
          <div className="mt-1 flex flex-row justify-between items-center">
            <div>
              De {converterData(item.dataHoraInicio)} à {converterData(item.dataHoraFim)}
            </div>
            <div>
              {item.cidade?.nome}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}