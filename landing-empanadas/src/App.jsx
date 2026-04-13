import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null);

  // El "mensajero" que va por los datos a tu n8n
  useEffect(() => {
    fetch('https://n8n.jacg.me/webhook/stats-landing')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error cargando estadísticas:", err));
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. HERO SECTION (Identidad y Llamados a la acción) */}
      <header className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-24 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black italic mb-4 uppercase tracking-tighter drop-shadow-lg">¡Que Chimba!</h1>
        <p className="text-xl md:text-2xl font-medium mb-10 max-w-2xl mx-auto">
          Auténticas empanadas colombianas en Ciudad Juárez. Pedidos individuales y para eventos.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <a href="https://wa.me/526561251080" target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full font-bold shadow-lg transition-transform hover:scale-105 w-full md:w-auto">
            📱 Pedir por WhatsApp
          </a>
        </div>
      </header>

      {/* 2. MÉTRICAS DIARIAS (Requisito estricto del PDF) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-10 text-center uppercase italic text-slate-800">El negocio en números</h2>
          
          {!data ? (
             <p className="text-center text-slate-400 font-bold">Cargando el sabor colombiano...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm text-center border-b-4 border-orange-500">
                <p className="text-4xl font-black text-orange-600">{data.stats?.total_vendidos || '0'}</p>
                <p className="text-slate-400 text-xs font-bold uppercase mt-2">Empanadas Vendidas</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm text-center border-b-4 border-indigo-500">
                <p className="text-4xl font-black text-indigo-600">{data.stats?.personas_atendidas || '0'}</p>
                <p className="text-slate-400 text-xs font-bold uppercase mt-2">Parceros Atendidos</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm text-center border-b-4 border-emerald-500">
                <p className="text-4xl font-black text-emerald-600">{data.stats?.comentarios_positivos || '0'}</p>
                <p className="text-slate-400 text-xs font-bold uppercase mt-2">Reseñas Positivas</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-3xl shadow-sm text-center">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Más Popular</p>
                <p className="text-xl font-black text-white">{data.stats?.mas_popular || 'Pollo'}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. RESEÑAS REALES (Extraídas de la Base de Datos) */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-black mb-8 italic uppercase text-slate-800">Lo que dicen en la calle</h2>
        <div className="space-y-4">
          {!data?.reviews ? (
            <p className="text-slate-400 italic">Todavía no hay comentarios...</p>
          ) : (
            data.reviews.map((rev, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm relative">
                <span className="text-5xl text-orange-200 absolute -top-4 left-4 italic font-serif">"</span>
                <p className="text-slate-700 relative z-10 text-lg font-medium italic pt-2">{rev.opinion_producto}</p>
                <p className="text-xs font-black mt-4 text-orange-500 uppercase tracking-widest">— {rev.nombres_apellidos}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. FOOTER (Redes sociales y privacidad) */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-xs uppercase tracking-widest px-6">
        <div className="flex justify-center gap-6 mb-6 text-white">
          <a href="#" className="hover:text-orange-500 font-bold">Facebook</a>
          <a href="#" className="hover:text-orange-500 font-bold">Instagram</a>
          <a href="#" className="hover:text-orange-500 font-bold">TikTok</a>
          <a href="#" className="hover:text-orange-500 font-bold">X</a>
        </div>
        <p className="mb-2">© 2026 Que Chimba Empanadas • Proyecto Final UTCJ</p>
        <p className="text-slate-600">Prohibido el ingreso a administradores • Solo para clientes</p>
      </footer>

    </div>
  )
}

export default App