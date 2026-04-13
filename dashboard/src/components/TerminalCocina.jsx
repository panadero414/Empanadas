import React from 'react';
import { Clock, CheckCircle2, CheckSquare } from 'lucide-react';

export default function TerminalCocina({ comandas, onPedidoListo }) {
  return (
    <div className="animate-in slide-in-from-right duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {comandas?.length === 0 ? (
          <div className="col-span-full p-20 text-center glass-card bg-white">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
            <h3 className="text-xl font-bold text-slate-800">¡Cocina Despejada!</h3>
            <p className="text-slate-500">No hay pedidos pendientes de preparación.</p>
          </div>
      ) : (
        comandas?.map((cmd, i) => (
          <div key={i} className="glass-card p-8 bg-white relative flex flex-col h-full">
            {cmd.urgente && (
              <div className="absolute -top-3 -right-3 bg-indigo-600 text-white font-bold text-[10px] px-4 py-1 rounded-full shadow-lg animate-pulse">
                URGENTE
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6 font-mono text-[10px] text-slate-400">
              <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">{cmd.id}</span>
              <span className="flex items-center gap-1 font-bold">
                <Clock size={12} className="text-indigo-500"/> {cmd.tiempo}
              </span>
            </div>

            <h4 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-50 pb-3">
              {cmd.cliente}
            </h4>
            
            <ul className="space-y-3 mb-8 font-medium text-sm text-slate-600 flex-1">
              {cmd.items?.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> 
                  {item}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onPedidoListo(cmd.id)}
              className="mt-auto w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all flex justify-center items-center gap-2 shadow-sm active:scale-95"
            >
              <CheckCircle2 size={18} /> Marcar como Listo
            </button>
          </div>
        ))
      )}
    </div>
  );
}