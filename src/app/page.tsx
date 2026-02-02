import messagesData from '@/lib/mensagens.json';
import { DailyMessage } from '@/components/daily-message';

export default function Home() {
  const { mensagens } = messagesData;

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-background p-4">
      <DailyMessage messages={mensagens} />
    </main>
  );
}
