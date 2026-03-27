import Link from 'next/link';
import Image from 'next/image';
import { converterData, getS3URL } from '@/funcoes/helpers';

export function SubEventoCard({ item }: any) {
  return (
    <Link
      href={`/evento/${item.id}`}
      className="cursor-pointer"
    >
      <div className="bg-gray-300 w-90 h-60 rounded-xl shadow-sm">
        <div className="relative w-90 h-45 text-center">
          <Image
            src={item.imagem ? getS3URL(item.imagem.chaveS3) : "/placeholder.png"}
            alt={item.imagem?.nome || "placeholder"}
            fill
            className="object-cover rounded-t-xl"
          />
        </div>

        <div className="px-4 py-1.5 text-shadow-xs">
          <h2 className="text-md">{item.nome}</h2>
          <div className="mt-1 flex flex-row justify-between items-center text-sm">
            <div>
              De {converterData(item.dataHoraInicio)} à {converterData(item.dataHoraFim)}
            </div>
            <div>
              {item.cidade.nome}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}