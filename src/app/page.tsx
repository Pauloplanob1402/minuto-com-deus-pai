'use client';
import { useState, useEffect } from 'react';
import { DailyMessage } from '@/components/daily-message';
import { Skeleton } from '@/components/ui/skeleton';
import bancoDeDados from '@/lib/mensagens.json';

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

  if (!isMounted) {
    return (
      <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FFFDFB] via-[#F7F3F0] to-[#EFE9E4] dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
        <div className="w-full max-w-md px-5 flex flex-col gap-4">
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-64 w-full rounded-[28px]" />
          <Skeleton className="h-40 w-full rounded-[20px]" />
          <Skeleton className="h-12 w-full rounded-[16px]" />
        </div>
      </main>
    );
  }

  const typedBancoDeDados: BancoDeDados = bancoDeDados as any;
  const hoje = new Date();
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const dia = hoje.getDate();

  const mensagensDoMes = typedBancoDeDados.meses?.[mes]?.mensagens;
  const mensagemDoDia = mensagensDoMes?.find((m) => m.dia === dia);

  let mensagem: MensagemComponent;
  if (mensagemDoDia) {
    mensagem = {
      dia: mensagemDoDia.dia,
      titulo: mensagemDoDia.promessa,
      mensagem: mensagemDoDia.mensagem,
      versiculo: mensagemDoDia.versiculo,
      promessa: mensagemDoDia.promessa,
      mes: mes,
    };
  } else {
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
    <main
      className="flex min-h-dvh w-full flex-col items-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FFFDFB] via-[#F7F3F0] to-[#EFE9E4] dark:from-zinc-900 dark:via-zinc-950 dark:to-black"
    >
      <DailyMessage messages={[mensagem]} />
    </main>
  );
}
