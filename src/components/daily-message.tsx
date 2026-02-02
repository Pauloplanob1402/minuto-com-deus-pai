'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Share } from 'lucide-react';
import { Button } from './ui/button';

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
  titulo: 'Prepare seu coração',
  mensagem:
    'Deus tem uma palavra especial para você hoje. Este é um momento para silenciar, ouvir e receber a graça que Ele derrama sobre sua vida.',
  versiculo: 'Salmos 46:10',
  promessa: 'Aquietai-vos e sabei que eu sou Deus.',
};

// Function to get and format the date elegantly
function getFormattedDate() {
  const today = new Date();
  // Formats to "segunda-feira, 02 de fevereiro"
  let formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(today);

  // Capitalize weekday and month: "Segunda-feira, 02 de Fevereiro"
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
  const message = messages[0]?.titulo === 'Mensagem não encontrada' ? fallbackMessage : messages[0] || fallbackMessage;

  const formattedDate = useMemo(() => getFormattedDate(), []);

  // Create the robust WhatsApp share link
  const shareText = useMemo(() => {
    if (!message) return '';
    const text = `*${message.titulo}*\n\n${message.mensagem}\n\n_${message.versiculo}_`;
    return encodeURIComponent(text);
  }, [message]);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-in-out">
      <Card className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/30 dark:border-zinc-800/30">
        <CardHeader className="text-center p-12 lg:p-16">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 tracking-wide">
            {formattedDate}
          </p>
          <CardTitle className="font-serif text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-100 tracking-wide">
            {message.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-10 lg:px-14 pb-8">
          <p className="text-center text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-loose">
            {message.mensagem}
          </p>
          <p className="text-center italic text-slate-500 dark:text-slate-400 mt-10">
            {message.versiculo}
          </p>
        </CardContent>
        <CardFooter className="px-12 lg:px-16 pb-12 pt-8 flex flex-col items-center gap-8">
          {message.promessa && (
            <div className="rounded-full bg-amber-100/50 dark:bg-amber-900/30 py-2 px-5">
              <p className="font-sans text-sm font-medium text-amber-700 dark:text-amber-300">{message.promessa}</p>
            </div>
          )}
          <div className="pb-24 w-full flex justify-center"> {/* Safe area for Android Nav Bar */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full max-w-xs">
              <Button
                size="lg"
                className="w-full rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <Share className="h-5 w-5 mr-3" />
                Compartilhar no WhatsApp
              </Button>
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
