"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Message = {
  id: number;
  titulo: string;
  texto: string;
  autor: string;
};

interface DailyMessageProps {
  messages: Message[];
}

export function DailyMessage({ messages }: DailyMessageProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This ensures client-specific code runs only after hydration
    setIsClient(true);

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const messageIndex = (dayOfYear - 1) % messages.length;
    setMessage(messages[messageIndex]);
  }, [messages]);
  
  const canShare = useMemo(() => {
    if (isClient) {
      return !!navigator.share;
    }
    return false;
  }, [isClient]);

  const handleShare = async () => {
    if (message && canShare) {
      const shareData = {
        title: 'Minuto com Deus Pai',
        text: `*Minuto com Deus Pai*\n\n_"${message.texto}"_\n\n- ${message.autor}`,
      };
      try {
        await navigator.share(shareData);
      } catch (err) {
        toast({
            variant: "destructive",
            title: "Erro ao compartilhar",
            description: "Não foi possível compartilhar a mensagem.",
        });
      }
    }
  };

  if (!isClient || !message) {
    return (
      <Card className="w-full max-w-md animate-pulse shadow-lg">
        <CardHeader className="items-center text-center">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Skeleton className="h-10 w-48" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
      <Card className="w-full overflow-hidden shadow-lg">
        <CardHeader className="bg-secondary/50 text-center">
          <CardTitle className="font-headline text-3xl text-primary-foreground">{message.titulo}</CardTitle>
          <CardDescription className="pt-1 font-body text-base font-semibold text-primary-foreground/80">{message.autor}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="font-body text-lg italic leading-relaxed text-center text-foreground/90">
            "{message.texto}"
          </p>
        </CardContent>
        {canShare && (
          <CardFooter className="flex justify-center bg-muted/30 p-4">
            <Button onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
