'use client';
import { useMemo, useEffect, useState } from 'react';
import { Share, Bookmark } from 'lucide-react';

type Message = {
  titulo: string;
  mensagem: string;
  versiculo: string;
  promessa: string;
};

interface DailyMessageProps {
  messages: Message[];
}

const fallbackMessage: Message = {
  titulo: 'Ele está no controle',
  mensagem: 'Deus preparou algo especial para você hoje. Continue confiando!',
  versiculo: 'Salmos 37:5',
  promessa: 'Confie Nele',
};

const STORAGE_KEY = 'minuto_mensagem_salva';

const FRASES_NOTIFICACAO = [
  'Deus quer um minuto com você ☀️',
  'Seu minuto com Deus está pronto 🙏',
  'Comece seu dia com o Pai — Ele tem uma palavra para você 📖',
  'Antes de qualquer coisa, um minuto com Deus ✨',
  'Bom dia! Seu Pai Celestial reservou uma mensagem especial para você 💛',
  'O dia começa melhor quando começa com Deus ☀️🙏',
  'Um minuto com Deus pode mudar seu dia inteiro 📖',
];

function getFormattedDate() {
  const today = new Date();
  let formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(today);
  formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  const deIndex = formattedDate.indexOf(' de ');
  if (deIndex !== -1) {
    const monthIndex = deIndex + 4;
    formattedDate =
      formattedDate.slice(0, monthIndex) +
      formattedDate.charAt(monthIndex).toUpperCase() +
      formattedDate.slice(monthIndex + 1);
  }
  return formattedDate;
}

function salvarMensagemLocal(msg: Message) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msg));
  } catch (_) {}
}

function carregarMensagemLocal(): Message | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return null;
}

async function agendarNotificacao() {
  if (!('Notification' in window)) return;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const frase = FRASES_NOTIFICACAO[Math.floor(Math.random() * FRASES_NOTIFICACAO.length)];
  const agora = new Date();
  const proximo630 = new Date();
  proximo630.setHours(6, 30, 0, 0);
  if (agora >= proximo630) proximo630.setDate(proximo630.getDate() + 1);
  const msAte630 = proximo630.getTime() - agora.getTime();

  setTimeout(() => {
    new Notification('Minuto com Deus Pai 🙏', {
      body: frase,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
    });
    agendarNotificacao();
  }, msAte630);
}

export function DailyMessage({ messages }: DailyMessageProps) {
  const [mensagemExibida, setMensagemExibida] = useState<Message | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const messageFromProps =
    messages[0]?.titulo === 'Mensagem não encontrada'
      ? fallbackMessage
      : messages[0] || fallbackMessage;

  useEffect(() => {
    const online = navigator.onLine;
    setIsOffline(!online);
    if (online) {
      setMensagemExibida(messageFromProps);
      salvarMensagemLocal(messageFromProps);
    } else {
      const salva = carregarMensagemLocal();
      setMensagemExibida(salva || fallbackMessage);
    }
    const handleOnline = () => {
      setIsOffline(false);
      setMensagemExibida(messageFromProps);
      salvarMensagemLocal(messageFromProps);
    };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    agendarNotificacao();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const message = mensagemExibida || messageFromProps;
  const formattedDate = useMemo(() => getFormattedDate(), []);

  const shareText = useMemo(() => {
    if (!message) return '';
    const text = `✝️ *${message.titulo}*\n\n${message.mensagem}\n\n_${message.versiculo}_\n\n🙏 Deus colocou essa mensagem no meu coração e eu quis compartilhar com você.\n\n📲 Baixe o app gratuito: https://play.google.com/store/apps/details?id=com.planob.minutocomdeuspai&hl=pt_BR`;
    return encodeURIComponent(text);
  }, [message]);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div
      className="flex flex-col w-full max-w-md"
      style={{ minHeight: '100dvh' }}
    >
      {/* Indicador offline */}
      {isOffline && (
        <div className="w-full text-center py-1 text-xs font-medium bg-amber-100 text-amber-700">
          📵 Modo offline — exibindo mensagem salva
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 px-5 pt-6 pb-0">

        {/* Data — apenas uma vez, sem "Versículo do dia" */}
        <div className="text-center mb-5">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#b59a7a]">
            {formattedDate}
          </p>
        </div>

        {/* Card do versículo — sem aspas, padding reduzido */}
        <div
          className="relative flex-1 flex flex-col justify-center rounded-[24px] border border-[#e8d9c4] px-6 py-7 mb-4 overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #fffdf9 0%, #f5ede0 100%)', minHeight: '220px' }}
        >
          {/* Versículo — fonte grande para impacto máximo */}
          <p
            className="text-center font-semibold text-[#2c1e10] leading-snug"
            style={{
              fontFamily: 'var(--font-lora), Georgia, serif',
              fontSize: 'clamp(1.6rem, 5.5vw, 2rem)',
            }}
          >
            {message.titulo}
          </p>

          {/* Divisor dourado */}
          <div className="w-10 h-[2px] bg-[#c9a97a] rounded-full mx-auto my-5" />

          {/* Referência bíblica */}
          <p className="text-center text-xs font-bold tracking-widest uppercase text-[#b59a7a]">
            {message.versiculo}
          </p>
        </div>

        {/* Card da reflexão — fonte grande e impactante */}
        <div
          className="flex-1 flex items-center rounded-[20px] bg-white dark:bg-zinc-900 border border-[#ede5d8] dark:border-zinc-800 px-6 py-6 mb-5"
          style={{ minHeight: '160px' }}
        >
          <p
            className="text-center text-[#3d2e1e] dark:text-slate-200 leading-relaxed w-full font-medium"
            style={{ fontSize: 'clamp(1.1rem, 4.2vw, 1.3rem)' }}
          >
            {message.mensagem}
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <div className="px-5">
        {/* Chamada para compartilhar */}
        <div className="text-center mb-3">
          <p className="text-sm font-semibold text-[#2c7a4b]">
            🕊️ Você pode ser instrumento de Deus hoje
          </p>
          <p className="text-xs text-[#a08060] mt-1">
            Compartilhe — essa mensagem pode chegar em quem mais precisa.
          </p>
        </div>

        {/* Botões */}
        <div
          className="flex gap-3"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <button
              className="w-full flex items-center justify-center gap-2 bg-[#2c7a4b] hover:bg-[#235f3b] active:scale-95 text-white font-semibold rounded-[16px] px-5 py-4 transition-all duration-200 shadow-lg shadow-green-900/20"
              style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}
            >
              <Share className="h-5 w-5 shrink-0" />
              Compartilhar no WhatsApp
            </button>
          </a>
          <button
            className="w-14 h-14 flex items-center justify-center bg-white dark:bg-zinc-900 border border-[#e0d0bc] dark:border-zinc-700 rounded-[16px] text-[#b59a7a] hover:bg-[#fdf6ee] active:scale-95 transition-all duration-200"
            title="Salvar"
          >
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
