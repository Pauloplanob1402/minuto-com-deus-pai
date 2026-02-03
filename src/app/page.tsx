'use client';

import { useState, useEffect } from 'react';
import { DailyMessage } from '@/components/daily-message';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import bancoDeDados from '@/lib/mensagens.json';

// Updated TypeScript interfaces for the new JSON structure
interface MensagemJson {
  dia: number;
  mensagem: string;
  versiculo: string;
  promessa: string;
}

interface BancoDeDados {
  meses: {
    [key: string]: {
      mensagens: MensagemJson[];
    };
  };
}

// Interface for the object passed to the component
interface MensagemComponent {
  dia: number;
  titulo: string;
  mensagem: string;
  versiculo: string;
  promessa: string;
  mes?: string;
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mainClasses =
    'flex min-h-screen w-full flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FFFDFB] via-[#F7F3F0] to-[#EFE9E4] dark:from-zinc-900 dark:via-zinc-950 dark:to-black overflow-y-auto';

  if (!isMounted) {
    return (
      <main className={mainClasses}>
        <div className="w-full max-w-md">
          <Card className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/10 bg-white/40 border border-white/30">
            <CardHeader className="text-center p-12 lg:p-16">
              <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-10 w-3/4 mx-auto" />
            </CardHeader>
            <CardContent className="px-10 lg:px-14 pb-8">
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6 mx-auto" />
              </div>
              <Skeleton className="h-5 w-1/2 mx-auto mt-10" />
            </CardContent>
            <CardFooter className="px-12 lg:px-16 pb-12 pt-8 flex flex-col items-center gap-8">
              <Skeleton className="h-8 w-24 rounded-full" />
              <div className="pb-24 w-full flex justify-center">
                <Skeleton className="h-12 w-full max-w-xs rounded-full" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  const typedBancoDeDados: BancoDeDados = bancoDeDados as any;
  const hoje = new Date();
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const dia = hoje.getDate();

  // New robust search logic with fallback
  const mensagensDoMes = typedBancoDeDados.meses?.[mes]?.mensagens;
  const mensagemDoDia = mensagensDoMes?.find((m) => m.dia === dia);

  let mensagem: MensagemComponent;

  if (mensagemDoDia) {
    // Map the content as requested
    mensagem = {
      dia: mensagemDoDia.dia,
      titulo: mensagemDoDia.promessa, // Title is the promise
      mensagem: mensagemDoDia.mensagem, // Text is the message
      versiculo: mensagemDoDia.versiculo, // Reference is the versicle
      promessa: mensagemDoDia.promessa, // Promise banner still shows the promise
      mes: mes,
    };
  } else {
    // Friendly fallback if message is not found
    mensagem = {
      dia: dia,
      titulo: 'Ele está no controle',
      mensagem: 'Deus preparou algo especial para você hoje. Continue confiando!',
      versiculo: 'Salmos 37:5',
      promessa: 'Confie Nele',
      mes: mes,
    };
  }

  return (
    <main className={mainClasses}>
      <DailyMessage messages={[mensagem]} />
    </main>
  );
}
