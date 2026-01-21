
import { VisitStats, AdminMessage, VisitLogEntry, AdminMessageInput } from '../types';

const STATS_KEY = 'izabel_perfumaria_stats';
const MESSAGES_KEY = 'izabel_perfumaria_messages';
const HISTORY_KEY = 'izabel_perfumaria_history';

export const StorageService = {
  getStats: (): VisitStats => {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : { day: 0, month: 0, year: 0 };
  },

  getHistory: (): VisitLogEntry[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  incrementVisit: () => {
    const stats = StorageService.getStats();
    stats.day += 1;
    stats.month += 1;
    stats.year += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));

    const history = StorageService.getHistory();
    history.push({ timestamp: new Date().toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  resetStats: () => {
    const zeroStats = { day: 0, month: 0, year: 0 };
    localStorage.setItem(STATS_KEY, JSON.stringify(zeroStats));
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  },

  saveAdminMessage: (data: AdminMessageInput) => {
    const messages = StorageService.getAdminMessages();
    const newMessage: AdminMessage = {
      id: Date.now().toString(),
      senderName: data.name,
      senderPhone: data.phone,
      senderEmail: data.email,
      messageDate: data.date,
      message: data.message,
      timestamp: new Date()
    };
    messages.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  },

  getAdminMessages: (): AdminMessage[] => {
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  }
};
