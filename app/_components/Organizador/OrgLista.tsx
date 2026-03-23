'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ModalConfirmacao } from './ModalConfirmacao';
import { converterData } from '@/funcoes/helpers';

function getValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function formatValue(value: any, type?: string) {
  if (value == null) return ''

  if (type === 'date') {
    return converterData(value)
  }

  return String(value)
}

export function OrgLista ({ data, columns, editBasePath, deleteAction, subEventSupport }: any) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      {/* Gambiarra para usar um modal de confirmação na hora de deletar */}
      <form ref={formRef} action={deleteAction}>
        <input
          type="hidden"
          name="id"
          value={selectedItem?.id ?? ''}
        />
      </form>

      {/* Corpo da tabela */}
      <table className="mb-3 w-full rounded-2xl shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col: any, i: number) => (
              <th key={i} className="p-3 text-left">
                {col.header}
              </th>
            ))}
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item: any) => (
            <tr key={item.id} className="border-t">
              {columns.map((col: any, i: number) => (
                <td key={i} className="p-3 max-w-60 truncate">
                  {formatValue(getValue(item, col.accessor), col.type)}
                </td>
              ))}

              <td className="p-3 text-center min-w-30 max-w-30 space-x-2">
                {/* Gerar botão de ação para lista de Eventos */}
                {subEventSupport && item.ehSimples == false && (
                  <Link
                    href={`${editBasePath}/${item.id}/subevento`}
                  >
                    <button
                      title="Criar Sub-Evento" 
                      className="p-2 bg-teal-200 rounded-xl cursor-pointer"
                    >
                      <Image 
                        src={"/add-subevento.png"}
                        alt="icone add sub-evento"
                        height={24}
                        width={24}
                      />
                    </button>
                  </Link>
                )}

                {editBasePath && (
                  <Link
                    href={`${editBasePath}/${item.id}/editar`}
                  >
                    <button
                      title="Editar" 
                      className="p-2 bg-yellow-400 rounded-xl cursor-pointer"
                    >
                      <Image 
                        src={"/editar.png"}
                        alt="icone editar"
                        height={24}
                        width={24}
                      />
                    </button>
                  </Link>
                )}

                {deleteAction && (
                  <button
                    title="Deletar" 
                    onClick={() => setSelectedItem(item)}
                    className="p-2 bg-red-600 rounded-xl cursor-pointer"
                  >
                    <Image 
                      src={"/deletar.png"}
                      alt="icone deletar"
                      height={24}
                      width={24}
                    />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <ModalConfirmacao
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={() => {
          formRef.current?.requestSubmit();
          setSelectedItem(null)
        }}
        title="Excluir item"
        description={`Tem certeza que deseja excluir "${selectedItem?.nome ?? 'este item'}"?`}
      />
    </>
  );
}