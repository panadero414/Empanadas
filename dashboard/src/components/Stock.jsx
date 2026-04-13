import React from 'react';

export default function Stock({ inventario }) {
  return (
    <div className="animate-in slide-in-from-right duration-500 editorial-panel bg-white p-8">
      <div className="flex justify-between items-center mb-10 border-b-editorial pb-4">
        <h3 className="text-2xl font-heading">CATÁLOGO DE INSUMOS</h3>
        <button className="border-editorial px-6 py-2 font-heading text-xs hover:bg-[var(--ink)] hover:text-white transition-all shadow-[4px_4px_0px_var(--ink)]">
          + REGISTRAR_ENTRADA
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b-editorial bg-[var(--bg-creme)]">
              <th className="py-4 px-4 font-bold">ID_REF</th>
              <th className="py-4 px-4 font-bold">DESCRIPCIÓN</th>
              <th className="py-4 px-4 font-bold">STOCK_REAL</th>
              <th className="py-4 px-4 font-bold">ESTADO</th>
            </tr>
          </thead>
          <tbody className="divide-y border-editorial">
            {inventario?.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-4 px-4">{item.id}</td>
                <td className="py-4 px-4 font-bold uppercase">{item.item}</td>
                <td className="py-4 px-4">{item.stock} {item.unidad}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 border-editorial font-bold ${
                    item.status === 'Crítico' ? 'bg-[var(--accent-red)] text-white' : 
                    item.status === 'Advertencia' ? 'bg-amber-300' : 'bg-emerald-400'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}