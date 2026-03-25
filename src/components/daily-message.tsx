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
const STORAGE_DATE_KEY = 'minuto_mensagem_data';

// Frases de gatilho para notificação das 6:30
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

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// Salvar mensagem no localStorage
function salvarMensagemLocal(msg: Message) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msg));
    localStorage.setItem(STORAGE_DATE_KEY, getTodayKey());
  } catch (_) {}
}

// Carregar mensagem salva (hoje ou ontem)
function carregarMensagemLocal(): Message | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return null;
}

// Agendar notificação local às 6:30
async function agendarNotificacao() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const frase = FRASES_NOTIFICACAO[Math.floor(Math.random() * FRASES_NOTIFICACAO.length)];

  // Calcular ms até próximo 6:30
  const agora = new Date();
  const proximo630 = new Date();
  proximo630.setHours(6, 30, 0, 0);
  if (agora >= proximo630) {
    proximo630.setDate(proximo630.getDate() + 1);
  }
  const msAte630 = proximo630.getTime() - agora.getTime();

  // Salvar no localStorage para o service worker usar
  try {
    localStorage.setItem('minuto_notif_frase', frase);
    localStorage.setItem('minuto_notif_delay', String(msAte630));
    localStorage.setItem('minuto_notif_agendada', 'true');
  } catch (_) {}

  // Disparar via setTimeout (funciona quando o app está aberto)
  setTimeout(() => {
    new Notification('Minuto com Deus Pai 🙏', {
      body: frase,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
    });
    // Re-agendar para o dia seguinte
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
    // Verificar conexão
    const online = navigator.onLine;
    setIsOffline(!online);

    if (online) {
      // Online: usar mensagem do dia e salvar
      setMensagemExibida(messageFromProps);
      salvarMensagemLocal(messageFromProps);
    } else {
      // Offline: carregar mensagem salva
      const salva = carregarMensagemLocal();
      setMensagemExibida(salva || fallbackMessage);
    }

    // Escutar mudanças de conexão
    const handleOnline = () => {
      setIsOffline(false);
      setMensagemExibida(messageFromProps);
      salvarMensagemLocal(messageFromProps);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Agendar notificação das 6:30
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
      style={{ minHeight: '100dvh', padding: '0' }}
    >
      {/* Indicador offline */}
      {isOffline && (
        <div className="w-full text-center py-1 text-xs font-medium bg-amber-100 text-amber-700">
          📵 Modo offline — exibindo mensagem salva
        </div>
      )}

      {/* Conteúdo principal — ocupa toda a tela */}
      <div
        className="flex flex-col flex-1 w-full animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-in-out"
        style={{ padding: '20px 20px 0' }}
      >
        {/* Data */}
        <div className="text-center mb-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#b59a7a]">
            {formattedDate.split(',')[0]}
          </p>
          <p className="text-sm text-[#a08060] mt-0.5">
            {formattedDate} · Versículo do dia
          </p>
        </div>

        {/* Card do versículo — cresce para preencher espaço */}
        <div
          className="relative flex-1 flex flex-col justify-center rounded-[28px] border border-[#e8d9c4] px-7 py-8 mb-4 overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #fffdf9 0%, #f5ede0 100%)', minHeight: '280px' }}
        >
          {/* Aspas decorativas */}
          <span
            className="absolute top-[-14px] left-5 leading-none text-[#e8d0b0] select-none pointer-events-none"
            style={{ fontFamily: 'var(--font-lora), Georgia, serif', fontSize: '100px' }}
          >
            &ldquo;
          </span>

          {/* Versículo */}
          <p
            className="relative text-center font-semibold text-[#2c1e10] leading-snug pt-6"
            style={{
              fontFamily: 'var(--font-lora), Georgia, serif',
              fontSize: 'clamp(1.5rem, 5vw, 1.85rem)',
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

        {/* Card da reflexão — também cresce */}
        <div
          className="flex-1 flex items-center rounded-[20px] bg-white dark:bg-zinc-900 border border-[#ede5d8] dark:border-zinc-800 px-6 py-5 mb-5"
          style={{ minHeight: '140px' }}
        >
          <p
            className="text-center text-[#5a4a38] dark:text-slate-300 leading-relaxed w-full"
            style={{ fontSize: 'clamp(1rem, 3.8vw, 1.15rem)' }}
          >
            {message.mensagem}
          </p>
        </div>
      </div>

      {/* Rodapé fixo — chamada + botões */}
      <div style={{ padding: '0 20px 0' }}>
        {/* Chamada para compartilhar */}
        <div className="text-center mb-3 px-2">
          <p className="text-sm font-semibold text-[#2c7a4b]">
            🕊️ Você pode ser instrumento de Deus hoje
          </p>
          <p className="text-xs text-[#a08060] mt-1 leading-relaxed">
            Compartilhe — essa mensagem pode chegar em quem mais precisa.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pb-8" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
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
