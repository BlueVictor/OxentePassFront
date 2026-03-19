import Link from 'next/link';
import Image from 'next/image';

type OrgMenuCardProps = {
  imgSrc: string;
  imgAlt: string;
  texto: string;
  href: string;
};

export function OrgMenuCard ({ imgSrc, imgAlt , texto, href }: OrgMenuCardProps) {
  return (
    <Link
      href={href}
      className="
        flex flex-col items-center justify-center
        w-50 h-40
        rounded-xl border border-slate-200
        bg-white shadow-sm
        transition duration-200 hover:-translate-y-1 hover:shadow-md
      "
    >
      <div className=" mb-2">
        <Image 
          src={imgSrc}
          alt={imgAlt}
          height={50}
          width={50}
        />
      </div>

      <span className="text-3xl text-center">
        {texto}
      </span>
    </Link>
  );
}