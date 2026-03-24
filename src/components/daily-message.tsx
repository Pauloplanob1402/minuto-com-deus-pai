'use client';
import { useMemo } from 'react';
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

export function DailyMessage({ messages }: DailyMessageProps) {
  const message =
    messages[0]?.titulo === 'Mensagem não encontrada'
      ? fallbackMessage
      : messages[0] || fallbackMessage;

  const formattedDate = useMemo(() => getFormattedDate(), []);

  const shareText = useMemo(() => {
    if (!message) return '';
    const text = `✝️ *${message.titulo}*\n\n${message.mensagem}\n\n_${message.versiculo}_\n\n🙏 Deus colocou essa mensagem no meu coração e eu quis compartilhar com você.\n\n📲 Baixe o app gratuito: https://play.google.com/store/apps/details?id=com.planob.minutocomdeuspai&hl=pt_BR`;
    return encodeURIComponent(text);
  }, [message]);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-in-out px-5">

      {/* Data */}
      <div className="mb-4 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#b59a7a]">
          {formattedDate.split(',')[0]}
        </p>
        <p className="text-sm text-[#a08060] mt-0.5">
          {formattedDate} · Versículo do dia
        </p>
      </div>

      {/* Card do versículo — aspas integradas ao layout, não flutuando */}
      <div
        className="relative rounded-[28px] border border-[#e8d9c4] px-7 pt-6 pb-8 mb-4 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #fffdf9 0%, #f5ede0 100%)' }}
      >
        {/* Aspas decorativas — menores, integradas ao fluxo */}
        <p
          className="text-center leading-none text-[#e0c9a8] select-none mb-1"
          style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontSize: '52px',
            lineHeight: '0.7',
          }}
        >
          &ldquo;
        </p>

        {/* Versículo — fonte maior e com mais presença */}
        <p
          className="relative text-center font-semibold text-[#2c1e10] leading-snug mt-3"
          style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontSize: 'clamp(1.7rem, 5.5vw, 2.1rem)',
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

      {/* Card da reflexão — fonte maior e mais respirada */}
      <div className="rounded-[20px] bg-white dark:bg-zinc-900 border border-[#ede5d8] dark:border-zinc-800 px-6 py-6 mb-5">
        <p
          className="text-center text-[#5a4a38] dark:text-slate-300 leading-relaxed"
          style={{ fontSize: 'clamp(1.15rem, 4.2vw, 1.3rem)' }}
        >
          {message.mensagem}
        </p>
      </div>

      {/* Chamada para compartilhar */}
      <div className="text-center mb-3 px-2">
        <p className="text-sm font-semibold text-[#2c7a4b]">
          🕊️ Você pode ser instrumento de Deus hoje
        </p>
        <p className="text-xs text-[#a08060] mt-1 leading-relaxed">
          Compartilhe essa mensagem — ela pode chegar em quem mais precisa.
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pb-28">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
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
  );
}
