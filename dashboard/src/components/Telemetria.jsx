import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Users } from 'lucide-react';

export default function Telemetria({ datos }) {
  const { dataVentas, actividadReciente, kpiIngresos, kpiVolumen } = datos;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Ingresos Totales" value={kpiIngresos} icon={<DollarSign size={20}/>} color="bg-emerald-50 text-emerald-600" />
        <KpiCard title="Pedidos" value={kpiVolumen} icon={<TrendingUp size={20}/>} color="bg-indigo-50 text-indigo-600" />
        <KpiCard title="Clientes Activos" value="12" icon={<Users size={20}/>} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6">Rendimiento de Ventas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataVentas}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="ingresos" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6">Últimos Pedidos</h3>
          <div className="space-y-4 overflow-y-auto max-h-80 pr-2">
            {actividadReciente?.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                <div>
                  <p className="text-sm font-bold text-slate-800 uppercase">{act.cliente}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{act.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">{act.monto}</p>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 uppercase">{act.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color }) {
  return (
    <div className="glass-card p-6 flex items-center gap-5">
      <div className={`p-3 rounded-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}