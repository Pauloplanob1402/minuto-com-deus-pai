"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Share, Heart, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

type Message = {
  dia?: number;
  mes?: string;
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
  const [favorites, setFavorites] = useState<Message[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const message = messages[0]?.titulo === 'Mensagem não encontrada' ? fallbackMessage : messages[0] || fallbackMessage;
  const messageId = message.mes && message.dia ? `${message.mes}-${message.dia}` : null;

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favoritos');
      const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      setFavorites(parsedFavorites);
      if (messageId) {
        setIsFavorited(parsedFavorites.some((fav: Message) => fav.mes === message.mes && fav.dia === message.dia));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      setFavorites([]);
    }
  }, [message.dia, message.mes, messageId]);

  const handleFavorite = () => {
    if (!messageId) return;

    let updatedFavorites = [...favorites];
    if (isFavorited) {
      updatedFavorites = updatedFavorites.filter(fav => !(fav.mes === message.mes && fav.dia === message.dia));
      toast({ title: "Removido dos Favoritos" });
    } else {
      updatedFavorites.push(message);
      toast({ title: "Adicionado aos Favoritos!" });
    }
    
    localStorage.setItem('favoritos', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    setIsFavorited(!isFavorited);
  };
  
  const clearFavorites = () => {
      localStorage.removeItem('favoritos');
      setFavorites([]);
      setIsFavorited(false);
      toast({ title: "Favoritos limpos!", description: "Sua lista de mensagens favoritas foi esvaziada." });
  }

  const canShare = useMemo(() => typeof window !== 'undefined' && !!navigator.share, []);

  const handleShare = async () => {
    if (message && canShare) {
        const shareData = { title: `Uma mensagem para você: ${message.titulo}`, text: `*${message.titulo}*\n\n${message.mensagem}\n\n_${message.versiculo}_` };
        try { await navigator.share(shareData); } catch (err) { toast({ variant: "destructive", title: "Erro ao compartilhar" }); }
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-in-out">
        <Card className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/30 dark:border-zinc-800/30">
          {messageId && (
            <div className="absolute top-6 right-6 z-10">
              <button onClick={handleFavorite} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <Heart className={`h-6 w-6 transition-all ${isFavorited ? 'text-red-500 fill-current' : 'text-slate-500 dark:text-slate-400'}`} />
              </button>
            </div>
          )}
          <CardHeader className="text-center p-10 lg:p-14">
            <CardTitle className="font-serif text-3xl lg:text-4xl font-medium text-slate-800 dark:text-slate-100 tracking-wide">{message.titulo}</CardTitle>
          </CardHeader>
          <CardContent className="px-10 lg:px-14 pb-8">
            <p className="text-center text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-loose">{message.mensagem}</p>
            <p className="text-center italic text-slate-500 dark:text-slate-400 mt-10">{message.versiculo}</p>
          </CardContent>
          <CardFooter className="p-10 lg:p-14 pt-8 flex flex-col items-center gap-8">
            {message.promessa && <div className="rounded-full bg-amber-100/50 dark:bg-amber-900/30 py-2 px-5"><p className="font-sans text-sm font-medium text-amber-700 dark:text-amber-300">{message.promessa}</p></div>}
            {canShare && <button onClick={handleShare} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300"><Share className="h-4 w-4" /><span className="text-sm font-medium">Levar essa paz a alguém</span></button>}
          </CardFooter>
        </Card>
      </div>
      
      {favorites.length > 0 && (
          <div className="mt-12 animate-in fade-in-0 duration-1000 ease-in-out">
            <Card className="w-full overflow-hidden rounded-[2.5rem] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/30 dark:border-zinc-800/30">
                <CardHeader>
                    <CardTitle className="font-serif text-2xl text-slate-700 dark:text-slate-200 text-center">Meus Favoritos</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="divide-y divide-slate-200/50 dark:divide-zinc-800/50">
                        {favorites.map(fav => (
                            <li key={`${fav.mes}-${fav.dia}`} className="py-3 px-2">
                                <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{fav.titulo}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="flex justify-center pt-4">
                    <Button variant="ghost" size="sm" onClick={clearFavorites} className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500">
                        <Trash2 className="h-4 w-4 mr-2"/>
                        Limpar Favoritos
                    </Button>
                </CardFooter>
            </Card>
          </div>
      )}
    </div>
  );
}
