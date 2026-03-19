
import { OrgMenuCard } from "../_components/OrgMenuCard";
import "../globals.css";

export default function organizador () {
  return (
    <div className="flex flex-row justify-center">
      <main className="w-2/5">
        <h1 className="titulo text-center">Seção de Organizadores</h1>
        <div className="mt-10 flex flex-row flex-wrap gap-4 justify-center">
          <OrgMenuCard 
            imgSrc="/eventos.png"
            imgAlt="evento icone"
            texto="Eventos"
            href="/organizador/evento"
          />

          <OrgMenuCard 
            imgSrc="/cidades.png"
            imgAlt="cidade icone"
            texto="Cidades"
            href="/organizador/cidade"
          />

          <OrgMenuCard 
            imgSrc="/tags.png"
            imgAlt="categoria icone"
            texto="Categorias"
            href="/organizador/categoria"
          />

          <OrgMenuCard 
            imgSrc="/pontovendas.png"
            imgAlt="pontos de venda icone"
            texto="Pontos de Venda"
            href="/organizador/ponto-venda"
          />

          <OrgMenuCard 
            imgSrc="/vendas.png"
            imgAlt="vendas icone"
            texto="Vendas"
            href="/organizador/vendas"
          />

          <OrgMenuCard 
            imgSrc="/ingressos.png"
            imgAlt="ingressos icone"
            texto="Ingressos"
            href="/organizador/ingressos"
          />
        </div>
      </main>
    </div>
  );
}
