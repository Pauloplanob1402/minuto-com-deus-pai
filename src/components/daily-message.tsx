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
    const text = `*${message.titulo}*\n\n${message.mensagem}\n\n_${message.versiculo}_\n\nBaixe o app: https://play.google.com/store/apps/details?id=com.planob.minutocomdeuspai&hl=pt_BR`;
    return encodeURIComponent(text);
  }, [message]);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-in-out px-4">

      {/* Data */}
      <div className="mb-4 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#b59a7a]">
          {formattedDate.split(',')[0]}
        </p>
        <p className="text-sm text-[#a08060]">
          {formattedDate} · Versículo do dia
        </p>
      </div>

      {/* Card do versículo */}
      <div className="relative rounded-[24px] bg-gradient-to-br from-[#fffdf9] to-[#f5ede0] border border-[#e8d9c4] px-8 py-10 mb-4 overflow-hidden">
        {/* Aspas decorativas */}
        <span
          className="absolute top-[-10px] left-4 text-[90px] leading-none text-[#e8d0b0] select-none pointer-events-none"
          style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
        >
          &ldquo;
        </span>

        {/* Versículo */}
        <p
          className="relative text-center text-2xl font-semibold text-[#2c1e10] leading-snug pt-6"
          style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
        >
          {message.titulo}
        </p>

        {/* Divisor dourado */}
        <div className="w-9 h-[2px] bg-[#c9a97a] rounded-full mx-auto my-5" />

        {/* Referência */}
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-[#b59a7a]">
          {message.versiculo}
        </p>
      </div>

      {/* Card da reflexão */}
      <div className="rounded-[20px] bg-white dark:bg-zinc-900 border border-[#ede5d8] dark:border-zinc-800 px-6 py-5 mb-6">
        <p className="text-center text-base text-[#5a4a38] dark:text-slate-300 leading-relaxed">
          {message.mensagem}
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pb-24">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <button className="w-full flex items-center justify-center gap-2 bg-[#2c7a4b] hover:bg-[#235f3b] active:scale-95 text-white font-medium text-sm rounded-[14px] px-5 py-4 transition-all duration-200">
            <Share className="h-4 w-4" />
            Compartilhar no WhatsApp
          </button>
        </a>

        <button
          className="w-14 h-14 flex items-center justify-center bg-white dark:bg-zinc-900 border border-[#e0d0bc] dark:border-zinc-700 rounded-[14px] text-[#b59a7a] hover:bg-[#fdf6ee] active:scale-95 transition-all duration-200"
          title="Salvar"
        >
          <Bookmark className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
