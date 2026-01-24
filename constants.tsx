import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  ShoppingCart, 
  Tag, 
  PhoneCall, 
  Clock, 
  Share2,
  Instagram,
  Facebook,
  MessageCircle,
  ExternalLink,
  Code
} from 'lucide-react';

export const COLORS = {
  rosaClaro: '#FCE7F3', // Tailwind pink-100
  rosaEscuro: '#DB2777', // Tailwind pink-600
  vinho: '#800020',
  preto: '#000000',
  branco: '#FFFFFF'
};

export const MENU_OPTIONS = [
  { id: 1, label: 'Como trabalhamos', icon: <Briefcase className="w-5 h-5 text-pink-600" /> },
  { id: 2, label: 'Nosso endereço', icon: <MapPin className="w-5 h-5 text-pink-600" /> },
  { id: 3, label: 'Comprar / Adquirir produtos', icon: <ShoppingCart className="w-5 h-5 text-pink-600" /> },
  { id: 4, label: 'Produtos em promoção', icon: <Tag className="w-5 h-5 text-pink-600" /> },
  { id: 5, label: 'Falar com atendente', icon: <PhoneCall className="w-5 h-5 text-pink-600" /> },
  { id: 6, label: 'Horário de funcionamento', icon: <Clock className="w-5 h-5 text-pink-600" /> },
  { id: 7, label: 'Redes sociais', icon: <Share2 className="w-5 h-5 text-pink-600" /> },
  { id: 8, label: 'Acesse nossa loja', icon: <ExternalLink className="w-5 h-5 text-pink-600" /> },
  { id: 9, label: 'Desenvolvimento', icon: <Code className="w-5 h-5 text-pink-600" /> },
];

export const SOCIAL_LINKS = [
  { label: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: 'https://www.instagram.com/izabelperfumaria2025/' },
  { label: 'Facebook', icon: <Facebook className="w-5 h-5" />, url: 'https://www.facebook.com/share/p/1AVek7Ugkz/' },
  { label: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, url: 'https://wa.me/5533984476776' },
];

export const PROMO_OPTIONS = [
  { id: 1, label: 'Super Promoção 1', file: 'Promocao1.pdf' },
  { id: 2, label: 'Super Promoção 2', file: 'Promocao2.pdf' },
  { id: 3, label: 'Super Promoção 3', file: 'Promocao3.pdf' },
  { id: 4, label: 'Super Promoção 4', file: 'Promocao4.pdf' },
];