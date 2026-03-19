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
      <div className="evento-card">
        <div className="relative w-120 h-60 text-center">
          <Image
            src={item.imagem ? getS3URL(item.imagem.chaveS3) : "/placeholder.png"}
            alt={item.imagem?.nome || "placeholder"}
            fill
            className="object-cover rounded-t-xl"
          />
        </div>

        <div className="evento-card-data">
          <h2 className="text-xl">{item.nome}</h2>
          <p className='mt-1'>
            De {converterData(item.dataHoraInicio)} à {converterData(item.dataHoraFim)}
          </p>
        </div>
      </div>
    </Link>
  );
}