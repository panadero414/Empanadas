import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ChefHat, Bike, Package, RefreshCw, Hexagon, 
  Activity, Server, ShieldCheck, Clock 
} from 'lucide-react';
import './App.css';

import Telemetria from './components/Telemetria';
import TerminalCocina from './components/TerminalCocina';
import RutasGPS from './components/RutasGPS';
import Stock from './components/Stock';

// --- 🔴 WEBHOOKS DE N8N ---
const N8N_WEBHOOK_URL = "https://n8n.jacg.me/webhook/datos-dashboard";
const N8N_UPDATE_URL = "https://n8n.jacg.me/webhook/actualizar-pedido";
const N8N_CONFIRM_URL = "https://n8n.jacg.me/webhook-test/confirmar-entrega";

export default function App() {
  const [cargando, setCargando] = useState(false);
  const [activeTab, setActiveTab] = useState('telemetria');
  const [horaLocal, setHoraLocal] = useState('');
  const [dbData, setDbData] = useState({
    dataVentas: [], actividadReciente: [], inventarioCompleto: [], 
    comandasCocina: [], rutasActivas: [], kpiIngresos: "$0", kpiVolumen: "0"
  });

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setHoraLocal(new Date().toLocaleTimeString('es-MX', { hour12: false }) + ' MDT');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Función principal para obtener datos
  const obtenerDatosDeDB = async () => {
    setCargando(true);
    try {
      const res = await fetch(N8N_WEBHOOK_URL);
      const json = await res.json();
      const datos = Array.isArray(json) ? json[0] : json;
      setDbData(prev => ({ ...prev, ...datos }));
    } catch (e) { 
      console.error("Error al sincronizar:", e); 
    } finally { 
      setCargando(false); 
    }
  };

  // --- 🟢 FUNCIÓN PARA PASAR PEDIDO A "LISTO" ---
  const marcarPedidoComoListo = async (pedidoId) => {
    // Limpiamos el ID (de "CMD-7" a "7")
    const idLimpio = pedidoId.replace('CMD-', '');
    
    try {
      const respuesta = await fetch(N8N_UPDATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idLimpio, nuevoEstado: 'Listo' })
      });

      if (respuesta.ok) {
        // Si la DB se actualizó, refrescamos la pantalla automáticamente
        obtenerDatosDeDB();
      }
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
    }
  };

  useEffect(() => { obtenerDatosDeDB(); }, []);

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      
      {/* SIDEBAR CON LED */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 space-y-8 relative overflow-hidden">
        <div className="led-strip-container">
          <div className="led-active"></div>
        </div>

        <div className="flex items-center gap-3 px-2 z-10">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Hexagon size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Parcerito <span className="text-indigo-600">AI</span></h1>
        </div>

        <nav className="flex-1 space-y-2 z-10">
          <NavItem icon={<LayoutDashboard size={20}/>} text="Dashboard" active={activeTab === 'telemetria'} onClick={() => setActiveTab('telemetria')} />
          <NavItem icon={<ChefHat size={20}/>} text="Cocina" active={activeTab === 'cocina'} onClick={() => setActiveTab('cocina')} />
          <NavItem icon={<Bike size={20}/>} text="Logística" active={activeTab === 'gps'} onClick={() => setActiveTab('gps')} />
          <NavItem icon={<Package size={20}/>} text="Inventario" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
        </nav>

        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-xs font-bold">JR</div>
            <div>
              <p className="text-sm font-semibold">Joel Alejandro</p>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Admin Root</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 overflow-y-auto p-10 bg-slate-100">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight capitalize">{activeTab}</h2>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2 font-medium">
              <Clock size={14} className="text-indigo-500"/> {horaLocal} • <Activity size={14} className="text-emerald-500"/> Sistema Operativo
            </p>
          </div>
          <button onClick={obtenerDatosDeDB} className="group flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-2xl shadow-sm border border-slate-200 hover:shadow-indigo-100 hover:shadow-lg transition-all active:scale-95">
            <RefreshCw size={18} className={cargando ? "animate-spin text-indigo-600" : "group-hover:rotate-180 transition-transform duration-500"} /> 
            Sincronizar
          </button>
        </header>

        <div className="max-w-[1400px] mx-auto">
          {activeTab === 'telemetria' && <Telemetria datos={dbData} />}
          {activeTab === 'cocina' && <TerminalCocina comandas={dbData.comandasCocina} onPedidoListo={marcarPedidoComoListo} />}
          {activeTab === 'gps' && <RutasGPS rutas={dbData.rutasActivas} />}
          {activeTab === 'stock' && <Stock inventario={dbData.inventarioCompleto} />}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, text, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      {icon} <span>{text}</span>
    </button>
  );
}