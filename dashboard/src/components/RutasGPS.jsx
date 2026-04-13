import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, MapPin, Target, KeyRound, CheckCircle } from 'lucide-react';

// Función para centrar el mapa al hacer clic
function RecenterMap({ coords }) {
  const map = useMap();
  if (coords) map.flyTo(coords, 15, { duration: 1.5 });
  return null;
}

// Icono del pin
const pinRepartidor = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
  iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38]
});

export default function RutasGPS({ rutas }) {
  const centroJuarez = [31.6904, -106.4245];
  const [pedidoSel, setPedidoSel] = useState(null);
  
  // Estados para el Modal del PIN
  const [modalPin, setModalPin] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  const parseCoords = (destino) => {
    if (!destino || typeof destino !== 'string') return null;
    const clean = destino.replace(/Lat |Lon /g, '').trim();
    const parts = clean.split(',');
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    return (!isNaN(lat) && !isNaN(lng)) ? [lat, lng] : null;
  };

  const abrirModal = (ruta, e) => {
    e.stopPropagation();
    setPedidoSel(ruta);
    setPin('');
    setError('');
    setModalPin(true);
  };

  const handleValidar = async () => {
    if (pin.length !== 4) {
      setError("El PIN debe tener 4 números.");
      return;
    }
    
    setProcesando(true);
    setError('');

    try {
      // Limpiamos el "RT-" del ID para mandar solo el número a la BD
      const idLimpio = pedidoSel.id.replace('RT-', ''); 
      
      const res = await fetch("https://n8n.jacg.me/webhook/confirmar-entrega", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idLimpio, codigo: pin })
      });
      
      if (res.ok) {
        setModalPin(false);
        alert("¡Entrega confirmada! El pedido ya no está activo.");
        window.location.reload(); // Recarga para actualizar la lista
      } else {
        setError("PIN incorrecto o el pedido ya fue entregado.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 flex flex-col lg:flex-row gap-8 h-[600px] relative">
      
      {/* MAPA */}
      <div className="flex-1 glass-card overflow-hidden relative border-2 border-white shadow-2xl">
        <MapContainer center={centroJuarez} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          {pedidoSel && <RecenterMap coords={parseCoords(pedidoSel.destino)} />}
          
          {rutas?.map((ruta, i) => {
            const pos = parseCoords(ruta.destino);
            if (!pos || (pedidoSel && pedidoSel.id !== ruta.id)) return null;
            return (
              <Marker key={i} position={pos} icon={pinRepartidor}>
                <Popup><p className="font-bold">{ruta.repartidor}</p></Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
        {pedidoSel && !modalPin && (
          <button onClick={() => setPedidoSel(null)} className="absolute bottom-4 left-4 z-[1000] bg-white p-2 rounded-xl shadow-lg border border-slate-200 text-xs font-bold flex items-center gap-2 hover:bg-slate-50">
            <Target size={14} className="text-indigo-600"/> Ver todos
          </button>
        )}
      </div>

      {/* LISTA DE PEDIDOS */}
      <div className="w-full lg:w-[350px] glass-card bg-white p-6 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2 text-sm uppercase">
          <Navigation size={18} className="text-indigo-600" /> Logística Activa
        </h3>
        
        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {rutas?.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <MapPin size={40} className="mx-auto mb-2" />
              <p className="text-xs font-bold uppercase">Sin entregas</p>
            </div>
          ) : (
            rutas.map((ruta, i) => (
              <div key={i} onClick={() => setPedidoSel(ruta)} className={`p-4 rounded-2xl border transition-all cursor-pointer ${pedidoSel?.id === ruta.id ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-100' : 'bg-slate-50 border-slate-100 hover:border-indigo-200'}`}>
                <div className="flex justify-between font-bold text-sm text-slate-900 mb-1">
                  <span>{ruta.repartidor}</span>
                  <span className="text-indigo-600 font-mono text-[10px]">{ruta.eta}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-3">{ruta.info}</p>
                
                {/* BOTÓN PARA ABRIR MODAL DEL PIN */}
                <button 
                  onClick={(e) => abrirModal(ruta, e)} 
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                  <KeyRound size={14}/> Pedir PIN al cliente
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DEL PIN (ESTILO FLOTANTE) */}
      {modalPin && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center rounded-3xl">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-80 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Código de Seguridad</h3>
            <p className="text-sm text-slate-500 mb-6">Pídele al cliente el PIN de 4 dígitos que le mandó el bot.</p>
            
            <input 
              type="text" 
              maxLength="4" 
              placeholder="0000"
              className="w-full text-center text-4xl tracking-[0.3em] font-mono font-bold p-4 border-2 border-slate-200 rounded-xl mb-2 focus:border-indigo-600 outline-none transition-colors"
              value={pin} 
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} // Solo permite números
            />
            
            {error && <p className="text-xs text-red-500 font-bold mb-4">{error}</p>}
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setModalPin(false)} 
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button 
                onClick={handleValidar} 
                disabled={procesando || pin.length !== 4}
                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {procesando ? '...' : <><CheckCircle size={18}/> Validar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}