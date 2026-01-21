
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { X, Lock, LogOut, Users, MessageSquare, Trash2, FileText, User, Phone, Calendar, Mail } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(StorageService.getStats());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'ampsoftt@gmail.com' && password === 'AMAR') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Credenciais inválidas.');
    }
  };

  const handleClearVisits = () => {
    if (window.confirm("Deseja realmente zerar todas as contagens de visitas?")) {
      StorageService.resetStats();
      setStats(StorageService.getStats());
    }
  };

  const generatePDF = (type: 'clients' | 'full') => {
    const doc = new jsPDF(type === 'full' ? 'landscape' : 'portrait');
    const messages = StorageService.getAdminMessages();
    
    // Custom Header
    doc.setFontSize(22);
    doc.setTextColor(128, 0, 32); // Vinho
    doc.text('Izabel Perfumaria', type === 'full' ? 148 : 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    const title = type === 'clients' ? 'Relatório de Prospecção (Contatos Clientes)' : 'Relatório Completo de Atendimento';
    doc.text(title, type === 'full' ? 148 : 105, 30, { align: 'center' });

    // Summary Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleString('pt-BR');
    doc.text(`Gerado em: ${dateStr}`, type === 'full' ? 260 : 180, 40, { align: 'right' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 42, type === 'full' ? 280 : 190, 42);

    // Table Data
    let head = [];
    let body = [];

    if (type === 'clients') {
      head = [['#', 'NOME DO CLIENTE', 'TELEFONE', 'E-MAIL', 'DATA REGISTRO']];
      body = messages.map((m, i) => [
        i + 1,
        m.senderName.toUpperCase(),
        m.senderPhone,
        m.senderEmail.toLowerCase(),
        m.messageDate
      ]).reverse();
    } else {
      head = [['#', 'NOME', 'TELEFONE', 'E-MAIL', 'DATA', 'MENSAGEM']];
      body = messages.map((m, i) => [
        i + 1,
        m.senderName.toUpperCase(),
        m.senderPhone,
        m.senderEmail.toLowerCase(),
        m.messageDate,
        m.message
      ]).reverse();
    }

    autoTable(doc, {
      startY: 50,
      head: head,
      body: body,
      theme: 'grid',
      headStyles: { 
        fillColor: [128, 0, 32], 
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: 'center',
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [252, 231, 243] }, // Zebrado Rosa Claro
      styles: { 
        fontSize: 8, 
        cellPadding: 3,
        valign: 'middle',
        textColor: [0, 0, 0] // Garantir texto preto na tabela PDF
      },
      columnStyles: type === 'full' ? {
        5: { cellWidth: 100 } 
      } : {},
      margin: { top: 50 }
    });

    const fileName = type === 'clients' ? 'Clientes' : 'Completo';
    doc.save(`Izabel_Perfumaria_Relatorio_${fileName}_${Date.now()}.pdf`);
  };

  const messages = StorageService.getAdminMessages();

  if (!isLoggedIn) {
    return (
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-rose-600 p-6 flex justify-between items-center">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Login Admin
          </h2>
          <button onClick={onClose} className="text-rose-100 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">E-mail</label>
            <input 
              type="email" 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-black font-bold placeholder-gray-400"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Senha</label>
            <input 
              type="password" 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-black font-bold placeholder-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-rose-600 text-white p-3 rounded-xl font-bold shadow-lg hover:bg-rose-700 transition-colors"
          >
            Acessar Painel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[85vh] flex flex-col">
      <div className="bg-rose-600 p-6 flex justify-between items-center shrink-0">
        <div>
           <h2 className="text-white font-bold text-lg">Painel Administrativo</h2>
           <p className="text-rose-100 text-xs">Gestão Profissional – Izabel Perfumaria</p>
        </div>
        <button onClick={onClose} className="text-rose-100 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto space-y-6 text-black">
        {/* Visit Counters */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2 uppercase tracking-widest">
            <Users className="w-4 h-4 text-rose-500" />
            Estatísticas de Visitas
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-pink-50 p-4 rounded-2xl text-center border border-pink-100">
              <span className="block text-2xl font-black text-rose-600">{stats.day}</span>
              <span className="text-[10px] text-pink-400 font-bold uppercase">Hoje</span>
            </div>
            <div className="bg-pink-50 p-4 rounded-2xl text-center border border-pink-100">
              <span className="block text-2xl font-black text-rose-600">{stats.month}</span>
              <span className="text-[10px] text-pink-400 font-bold uppercase">Mês</span>
            </div>
            <div className="bg-pink-50 p-4 rounded-2xl text-center border border-pink-100">
              <span className="block text-2xl font-black text-rose-600">{stats.year}</span>
              <span className="text-[10px] text-pink-400 font-bold uppercase">Ano</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
             <button 
               onClick={handleClearVisits}
               className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
             >
               <Trash2 className="w-4 h-4" />
               Resetar Visitas
             </button>
             <button 
               onClick={() => generatePDF('clients')}
               className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
             >
               <FileText className="w-4 h-4" />
               Relatório Clientes
             </button>
             <button 
               onClick={() => generatePDF('full')}
               className="flex items-center justify-center gap-2 p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
             >
               <MessageSquare className="w-4 h-4" />
               Relatório Completo
             </button>
          </div>
        </section>

        {/* Client Messages List */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2 uppercase tracking-widest">
            <MessageSquare className="w-4 h-4 text-rose-500" />
            Mensagens Recebidas ({messages.length})
          </h3>
          {messages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">Nenhum contato registrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="p-4 bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-800 uppercase">{m.senderName}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {m.senderPhone}
                                </p>
                                <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {m.senderEmail}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1 font-bold">
                            <Calendar className="w-3 h-3" />
                            {m.messageDate}
                        </p>
                        <p className="text-[9px] text-gray-300">Entrada: {new Date(m.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-100">
                    <label className="text-[9px] uppercase font-black text-rose-400 block mb-1">Conteúdo da Mensagem:</label>
                    <p className="text-xs text-gray-700 leading-relaxed italic">"{m.message}"</p>
                  </div>
                </div>
              )).reverse()}
            </div>
          )}
        </section>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="w-full flex items-center justify-center gap-2 p-4 text-rose-600 font-bold border-2 border-rose-600 rounded-2xl hover:bg-rose-50 transition-colors mt-8 mb-4"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema Admin
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
