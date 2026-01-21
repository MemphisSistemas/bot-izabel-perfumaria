import React, { useState, useEffect, useRef } from 'react';
import { MessageType, ChatMessage, AdminMessageInput } from '../types';
import { MENU_OPTIONS, SOCIAL_LINKS, PROMO_OPTIONS } from '../constants';
import { StorageService } from '../services/StorageService';
import { ChevronRight, ExternalLink, MapPin, Send, RotateCcw, LogOut, User, Phone, Calendar, MessageSquare, Mail, Trash2 } from 'lucide-react';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userName, setUserName] = useState<string>('');
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formMemo, setFormMemo] = useState('');
  
  const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getInitialMessages = (name: string): ChatMessage[] => {
    const hour = new Date().getHours();
    let greeting = "Bom dia";
    if (hour >= 12 && hour < 18) greeting = "Boa tarde";
    else if (hour >= 18 || hour < 5) greeting = "Boa noite";

    const welcomeMsg = `Olá ${name ? name : ''}, ${greeting}! \nMeu nome é Karolina, sou a assistente virtual da Izabel Perfumaria. Estou aqui para te ajudar 😊 \n\nEscolha uma das opções abaixo no menu para se informar.`;

    return [
      {
        id: '1',
        type: MessageType.BOT,
        content: welcomeMsg,
        timestamp: new Date()
      },
      {
        id: '2',
        type: MessageType.MENU,
        content: 'Menu Principal',
        timestamp: new Date()
      }
    ];
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || params.get('n') || '';
    setUserName(name);
    setFormName(name);
    setMessages(getInitialMessages(name));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPhone(maskPhone(e.target.value));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleMenuClick = (id: number) => {
    setLastSelectedId(id);
    const selected = MENU_OPTIONS.find(opt => opt.id === id);
    if (!selected) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      content: selected.label,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let botContent: string | string[] = '';
      let botType: MessageType = MessageType.BOT;

      switch (id) {
        case 1:
          botContent = "A Izabel Perfumaria trabalha com representações das marcas queridinhas do mercado, como: O Boticário, Eudora, Natura, Avon e Herbalife, oferecendo produtos de qualidade e confiança para nossos clientes.";
          break;
        case 2:
          botContent = "Endereço: Rua da Conceição, Nº 160\nBairro: Coqueiro\nCidade: Manhuaçu – MG\nCEP: 36900-354\nE-mail: izabelperfumaria1961@gmail.com\nLoja virtual: izabelperfumaria.com.br\nTelefone: (33) 9 8447-6776";
          break;
        case 3:
          botContent = "Acesse nossa loja virtual:\nhttps://izabelperfumaria.com.br\n\nEscolha seu produto, adicione ao carrinho e finalize sua compra utilizando: Cartão de crédito, PIX ou Boleto Bancário, com prazo de até 7 dias.";
          break;
        case 4:
          botContent = "Selecione uma das promoções abaixo:";
          botType = MessageType.SUBMENU;
          break;
        case 5:
          handleCallAction();
          return;
        case 6:
          botContent = "Nosso horário de atendimento é:\n🕘 Segunda a Domingo: \n08:00 às 00:00";
          break;
        case 7:
          botContent = "Siga nossas redes sociais:";
          break;
        case 8:
          window.open('https://izabelperfumaria.com.br/', 'loja_izabel');
          botContent = "Estou abrindo nossa loja virtual oficial para você. Boas compras! 🛍️✨";
          break;
      }

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: botType,
        content: botContent,
        timestamp: new Date(),
        metadata: { originalMenuId: id, showBackButton: true }
      };

      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  const handleBack = () => {
    setLastSelectedId(null);
    // Em vez de acumular mensagens infinitamente, limpamos a tela para o menu inicial
    // para evitar a sensação de "várias instâncias" abertas na mesma conversa.
    setMessages(getInitialMessages(userName));
  };

  const handleCallAction = () => {
    const today = new Date().toLocaleDateString('pt-BR');
    setFormDate(today);
    
    window.location.href = 'tel:33984476776';
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        type: MessageType.FORM,
        content: 'Deixe seus dados abaixo para retornarmos o contato.',
        timestamp: new Date(),
        metadata: { showBackButton: true }
      };
      setMessages(prev => [...prev, botResponse]);
    }, 2000);
  };

  const handleClearForm = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormMemo('');
  };

  const isFormValid = () => {
    return formName.trim().length > 2 && 
           formPhone.replace(/\D/g, '').length === 11 && 
           validateEmail(formEmail) &&
           formMemo.trim().length > 0;
  };

  const handleSubmitForm = () => {
    const data: AdminMessageInput = {
      name: formName,
      phone: formPhone,
      email: formEmail,
      date: formDate,
      message: formMemo
    };

    StorageService.saveAdminMessage(data);
    handleClearForm();
    
    const confirmation: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.BOT,
      content: `A Izabel Perfumaria agradece seu contato, breve entraremos em contato aguarde...`,
      timestamp: new Date(),
      metadata: { showBackButton: true }
    };
    setMessages(prev => [...prev, confirmation]);
  };

  const handleExit = () => {
    const exitMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.BOT,
      content: 'Obrigado por visitar a Izabel Perfumaria! Redirecionando para nosso WhatsApp... 👋',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, exitMsg]);
    setTimeout(() => {
        window.location.href = "https://wa.me/5533984476776";
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#FDF2F8]">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.type === MessageType.USER ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                msg.type === MessageType.USER 
                  ? 'bg-rose-600 text-white rounded-tr-none' 
                  : 'bg-white text-black rounded-tl-none border border-pink-100'
              }`}
            >
              {typeof msg.content === 'string' && (
                <div className="whitespace-pre-wrap text-sm font-medium leading-relaxed">
                  {msg.content}
                </div>
              )}

              {msg.type === MessageType.MENU && (
                <div className="mt-3 space-y-2">
                  {MENU_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleMenuClick(opt.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm font-medium transition-colors border group ${
                        lastSelectedId === opt.id 
                          ? 'bg-[#800020] text-white border-[#800020]' 
                          : 'bg-pink-50 hover:bg-pink-100 text-gray-800 border-pink-100'
                      }`}
                    >
                      <span className={`flex-shrink-0 p-1.5 rounded-lg shadow-sm ${lastSelectedId === opt.id ? 'bg-white/20' : 'bg-white'}`}>
                        {React.cloneElement(opt.icon as React.ReactElement, { 
                          className: `w-5 h-5 ${lastSelectedId === opt.id ? 'text-white' : 'text-pink-600'}` 
                        })}
                      </span>
                      <span className="flex-1">{opt.id}. {opt.label}</span>
                      <ChevronRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${lastSelectedId === opt.id ? 'text-white' : 'text-pink-400'}`} />
                    </button>
                  ))}
                  <button
                    onClick={handleExit}
                    className="w-full flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-left text-sm font-bold transition-colors border border-gray-200"
                  >
                    <span className="flex-shrink-0 bg-white p-1.5 rounded-lg shadow-sm">
                      <LogOut className="w-5 h-5 text-gray-500" />
                    </span>
                    <span className="flex-1">Sair do ChatBot</span>
                  </button>
                </div>
              )}

              {msg.type === MessageType.SUBMENU && (
                <div className="mt-3 space-y-2">
                  {PROMO_OPTIONS.map((promo) => (
                    <a
                      key={promo.id}
                      href={`./${promo.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 p-3 bg-rose-50 hover:bg-rose-100 rounded-xl text-left text-sm font-medium transition-colors border border-rose-100"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-rose-600">
                        {promo.id}
                      </span>
                      <span className="flex-1 text-gray-800">{promo.label}</span>
                      <ExternalLink className="w-4 h-4 text-rose-400" />
                    </a>
                  ))}
                </div>
              )}

              {msg.metadata?.originalMenuId === 7 && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 bg-white border-2 border-pink-500 text-pink-600 rounded-xl font-bold hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {msg.metadata?.originalMenuId === 2 && (
                <div className="mt-3">
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Rua+da+Conceicao+160+Manhuacu+MG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-3 bg-[#800020] text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    <MapPin className="w-4 h-4" />
                    Ver no Google Maps
                  </a>
                </div>
              )}

              {msg.type === MessageType.FORM && (
                <div className="mt-4 space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-pink-500 ml-1">Digite seu nome</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                        <input 
                          type="text"
                          className="w-full pl-10 pr-3 py-2 text-sm border border-pink-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white text-black placeholder-gray-400 font-bold"
                          placeholder="Seu nome completo"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                        />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-pink-500 ml-1">Seu Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                        <input 
                          type="tel"
                          className="w-full pl-10 pr-3 py-2 text-sm border border-pink-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white text-black placeholder-gray-400 font-bold"
                          placeholder="(99) 99999-9999"
                          value={formPhone}
                          onChange={handlePhoneChange}
                        />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-pink-500 ml-1">Endereço de E-mail válido</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                        <input 
                          type="email"
                          className={`w-full pl-10 pr-3 py-2 text-sm border rounded-xl focus:ring-2 outline-none transition-all text-black placeholder-gray-400 bg-white font-bold ${
                            formEmail && !validateEmail(formEmail) 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-pink-100 focus:ring-rose-500'
                          }`}
                          placeholder="exemplo@dominio.com"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                        />
                      </div>
                      {formEmail && !validateEmail(formEmail) && (
                        <p className="text-[9px] text-red-500 font-bold mt-1 ml-1">Por favor, insira um e-mail válido.</p>
                      )}
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-pink-500 ml-1">Data de hoje</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                        <input 
                          type="text"
                          readOnly
                          className="w-full pl-10 pr-3 py-2 text-sm border border-pink-50 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed font-bold"
                          value={formDate}
                        />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-pink-500 ml-1">Mensagem (Memo)</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-pink-300" />
                        <textarea 
                          className="w-full pl-10 pr-3 py-2 text-sm border border-pink-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none min-h-[100px] bg-white text-black placeholder-gray-400 font-bold"
                          placeholder="Escreva aqui sua dúvida ou pedido..."
                          value={formMemo}
                          onChange={(e) => setFormMemo(e.target.value)}
                        />
                      </div>
                   </div>

                   <div className="flex gap-2">
                     <button 
                       onClick={handleClearForm}
                       className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                     >
                       <Trash2 className="w-4 h-4" />
                       Limpar
                     </button>
                     <button 
                       onClick={handleSubmitForm}
                       className="flex-[2] flex items-center justify-center gap-2 p-3 bg-rose-600 text-white rounded-xl font-bold disabled:bg-gray-200 disabled:text-gray-400 shadow-lg hover:bg-rose-700 transition-all active:scale-95"
                       disabled={!isFormValid()}
                     >
                       <Send className="w-4 h-4" />
                       Enviar Mensagem
                     </button>
                   </div>
                </div>
              )}

              <span className="block text-[10px] opacity-60 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* VOLTAR Button */}
            {msg.type !== MessageType.USER && msg.type !== MessageType.MENU && msg.metadata?.showBackButton && (
              <button
                onClick={handleBack}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-xs font-bold shadow-md hover:bg-red-700 transition-colors self-start ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                Voltar ao Menu Principal
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-white border-t border-pink-100 flex items-center justify-center">
         <p className="text-xs text-pink-400 font-medium italic">Assistente disponível • Atendimento Automático</p>
      </div>
    </div>
  );
};

export default ChatWindow;