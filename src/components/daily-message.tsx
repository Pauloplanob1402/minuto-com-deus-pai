"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
    titulo: "Prepare seu coração",
    mensagem: "Deus tem uma palavra especial para você hoje. Este é um momento para silenciar, ouvir e receber a graça que Ele derrama sobre sua vida.",
    versiculo: "Salmos 46:10",
    promessa: "Aquietai-vos e sabei que eu sou Deus."
};

export function DailyMessage({ messages }: DailyMessageProps) {
  const { toast } = useToast();
  
  const message = messages[0]?.titulo === 'Mensagem não encontrada' ? fallbackMessage : messages[0] || fallbackMessage;

  const canShare = useMemo(() => typeof window !== 'undefined' && !!navigator.share, []);

  const handleShare = async () => {
    if (message && canShare) {
      const shareData = {
        title: `Uma mensagem para você: ${message.titulo}`,
        text: `*${message.titulo}*\n\n${message.mensagem}\n\n_${message.versiculo}_`,
      };
      try {
        await navigator.share(shareData);
      } catch (err) {
        toast({
            variant: "destructive",
            title: "Erro ao compartilhar",
            description: "Não foi possível compartilhar esta mensagem.",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-in-out">
      <Card className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/30 dark:border-zinc-800/30">
        <CardHeader className="text-center p-12 lg:p-16">
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
          {canShare && (
            <Button onClick={handleShare} size="lg" className="rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20 transition-all duration-300 ease-in-out transform hover:scale-105">
              <Share className="h-5 w-5 mr-3" />
              Compartilhar no WhatsApp
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
