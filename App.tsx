
import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import AdminPanel from './components/AdminPanel';
import { StorageService } from './services/StorageService';
import { X } from 'lucide-react';

const App: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  useEffect(() => {
    StorageService.incrementVisit();
  }, []);

  const profileImageUrl = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#FDF2F8] flex flex-col items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-md bg-white h-screen md:h-[90vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-gradient-to-r from-pink-500 to-rose-700 p-4 flex items-center gap-3 shadow-md z-10">
          <div 
            onClick={() => setIsImageEnlarged(true)}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden border-2 border-pink-200 cursor-pointer active:scale-95 transition-transform"
          >
             <img 
               src={`${profileImageUrl}&w=200&h=200`} 
               alt="Karolina" 
               className="w-full h-full object-cover" 
             />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Izabel Perfumaria</h1>
            <p className="text-pink-100 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Karolina • Assistente Virtual
            </p>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden">
          <ChatWindow />
        </main>

        {/* Footer Admin Access */}
        <footer className="p-2 text-center">
           <button 
             onClick={() => setIsAdminOpen(true)}
             className="text-[10px] text-pink-300 hover:text-pink-500 transition-colors uppercase tracking-widest"
           >
             Acesso Administrativo
           </button>
        </footer>

        {/* Image Zoom Overlay */}
        {isImageEnlarged && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
            onClick={() => setIsImageEnlarged(false)}
          >
            <div className="relative max-w-sm w-full animate-in zoom-in duration-300">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsImageEnlarged(false); }}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img 
                  src={`${profileImageUrl}&w=800`} 
                  alt="Karolina Completa" 
                  className="w-full h-auto object-contain max-h-[80vh]" 
                />
              </div>
              <div className="mt-4 text-center">
                 <p className="text-white font-bold text-xl">Karolina</p>
                 <p className="text-pink-200 text-sm">Sua Assistente Virtual</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Overlay */}
        {isAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <AdminPanel onClose={() => setIsAdminOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
