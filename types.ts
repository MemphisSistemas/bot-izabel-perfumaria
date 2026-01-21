
export enum MessageType {
  BOT = 'BOT',
  USER = 'USER',
  MENU = 'MENU',
  FORM = 'FORM',
  SUBMENU = 'SUBMENU'
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string | string[];
  timestamp: Date;
  metadata?: any;
}

export interface VisitStats {
  day: number;
  month: number;
  year: number;
}

export interface VisitLogEntry {
  timestamp: string;
}

export interface AdminMessage {
  id: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  messageDate: string;
  message: string;
  timestamp: Date;
}

export interface AdminMessageInput {
  name: string;
  phone: string;
  email: string;
  date: string;
  message: string;
}
