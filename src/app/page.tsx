"use client";

import { useState, useEffect } from 'react';
import { bancoDeDados } from '@/data/mensagens'; // Removido .js
import { DailyMessage } from '@/components/daily-message';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Preload OneSignal script
    const oneSignalScript = document.createElement('script');
    oneSignalScript.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
    oneSignalScript.async = true;
    document.head.appendChild(oneSignalScript);

    oneSignalScript.onload = () => {
      window.OneSignal = window.OneSignal || [];
      OneSignal.push(function() {
        OneSignal.init({
          appId: "942880a3-350b-454f-8d96-72f6763ae4ac",
        });
      });
    };
  }, []);

  const mainClasses = "flex min-h-dvh w-full flex-col items-center justify-center p-4 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FFFDFB] via-[#F7F3F0] to-[#EFE9E4] dark:from-zinc-900 dark:via-zinc-950 dark:to-black";

  if (!isMounted) {
    return (
        <main className={mainClasses}>
            <div className="w-full max-w-md">
                <Card className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/10 bg-white/40 border border-white/30">
                    <CardHeader className="text-center p-12 lg:p-16">
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
                       <Skeleton className="h-12 w-48 rounded-full" />
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
  }

  const hoje = new Date();
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const dia = hoje.getDate();

  const mensagemDoDia = bancoDeDados[mes]?.mensagens.find(m => m.dia === dia);
  
  const mensagem = mensagemDoDia
    ? { ...mensagemDoDia, mes } 
    : {
        titulo: 'Mensagem não encontrada',
        mensagem: 'Não há mensagem para o dia de hoje.',
        versiculo: '',
        promessa: ''
      };

  return (
    <main className={mainClasses}>
      <DailyMessage messages={[mensagem]} />
    </main>
  );
}
