'use client';
import { useMemo, useState, useEffect } from 'react';
import { Share, Bookmark, BookmarkCheck, Flame } from 'lucide-react';

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

function getDateParts() {
  const today = new Date();
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(today);
  const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(today);
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    dayMonth: dayMonth.charAt(0).toUpperCase() + dayMonth.slice(1),
  };
}

function getStreak(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const data = JSON.parse(localStorage.getItem('mcdup_streak') || '{}');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastVisit === today) return data.count || 1;
    if (data.lastVisit === yesterday) {
      const newCount = (data.count || 1) + 1;
      localStorage.setItem('mcdup_streak', JSON.stringify({ lastVisit: today, count: newCount }));
      return newCount;
    }
    localStorage.setItem('mcdup_streak', JSON.stringify({ lastVisit: today, count: 1 }));
    return 1;
  } catch {
    return 1;
  }
}

function getSaved(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('mcdup_saved_today') === new Date().toDateString();
  } catch {
    return false;
  }
}

// Quebra texto longo em múltiplas linhas para o canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Retângulo com bordas arredondadas no canvas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Gera imagem do card usando Canvas API pura — sem dependências
async function generateCardImage(message: Message, dayMonth: string): Promise<Blob> {
  const scale = 2;
  const W = 640;
  const canvas = document.createElement('canvas');

  // Aguarda a fonte Lora carregar (já está no layout.tsx)
  await document.fonts.ready;

  // Calcula altura dinâmica baseada no texto
  canvas.width = W * scale;
  const tempCtx = canvas.getContext('2d')!;
  tempCtx.scale(scale, scale);
  tempCtx.font = `600 36px Georgia, serif`;
  const titleLines = wrapText(tempCtx, message.titulo, W - 100);
  const titleHeight = titleLines.length * 48;

  const H = 100 + titleHeight + 120 + 40; // margem + título + referência + rodapé
  canvas.height = H * scale;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  // Fundo com gradiente quente
  const bg = ctx.createLinearGradient(0, 0, W * 0.3, H);
  bg.addColorStop(0, '#fffdf9');
  bg.addColorStop(1, '#f5ede0');
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, W, H, 32);
  ctx.fill();

  // Borda sutil
  ctx.strokeStyle = '#e8d9c4';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 0, 0, W, H, 32);
  ctx.stroke();

  // Aspas decorativas
  ctx.fillStyle = '#dfc8a0';
  ctx.font = `400 52px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.fillText('\u201C', W / 2, 68);

  // Título (versículo)
  ctx.fillStyle = '#2c1e10';
  ctx.font = `600 36px Georgia, serif`;
  ctx.textAlign = 'center';
  let currentY = 110;
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, currentY);
    currentY += 48;
  }

  // Linha divisória dourada
  const dividerY = currentY + 20;
  ctx.strokeStyle = '#c9a97a';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(W / 2 - 24, dividerY);
  ctx.lineTo(W / 2 + 24, dividerY);
  ctx.stroke();

  // Referência bíblica
  ctx.fillStyle = '#b59a7a';
  ctx.font = `700 13px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(message.versiculo.toUpperCase(), W / 2, dividerY + 28);

  // Data discreta no rodapé
  ctx.fillStyle = '#c9a97a';
  ctx.font = `400 12px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(dayMonth + ' · Minuto com Deus Pai', W / 2, H - 18);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('canvas vazio'))),
      'image/png'
    )
  );
}

export function DailyMessage({ messages }: DailyMessageProps) {
  const message =
    messages[0]?.titulo === 'Mensagem não encontrada'
      ? fallbackMessage
      : messages[0] || fallbackMessage;

  const { weekday, dayMonth } = useMemo(() => getDateParts(), []);
  const [streak, setStreak] = useState(0);
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    setStreak(getStreak());
    setSaved(getSaved());
  }, []);

  function handleSave() {
    if (saved) return;
    try {
      localStorage.setItem('mcdup_saved_today', new Date().toDateString());
    } catch {}
    setSaved(true);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  }

  async function handleShare() {
    setSharing(true);

    try {
      // Tenta Web Share API com imagem gerada no canvas
      if (typeof navigator !== 'undefined' && navigator.share) {
        const blob = await generateCardImage(message, dayMonth);
        const file = new File([blob], 'minuto-com-deus-pai.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: message.titulo,
            text: `${message.titulo}\n\n${message.versiculo}`,
          });
          setSharing(false);
          return;
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setSharing(false);
        return;
      }
      // qualquer outro erro: cai no fallback silenciosamente
    }

    // Fallback: WhatsApp com texto (funciona em qualquer browser)
    const text = encodeURIComponent(
      `✝️ *${message.titulo}*\n\n${message.mensagem}\n\n_${message.versiculo}_\n\n🙏 Deus colocou essa mensagem no meu coração e eu quis compartilhar com você.\n\n📲 Baixe o app gratuito: https://play.google.com/store/apps/details?id=com.planob.minutocomdeuspai&hl=pt_BR`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setSharing(false);
  }

  return (
    <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-in-out px-5">

      {/* Streak — aparece a partir do 2º dia */}
      {streak > 1 && (
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <Flame
            className="h-4 w-4"
            style={{ color: '#e07a30', filter: 'drop-shadow(0 0 4px #e07a3088)' }}
          />
          <p
            className="font-semibold text-[#c0692a]"
            style={{ fontSize: '0.82rem', letterSpacing: '0.03em' }}
          >
            {streak} dias seguidos
          </p>
        </div>
      )}

      {/* Data — uma só vez, hierarquia clara */}
      <div className="mb-5 text-center">
        <p
          className="font-bold tracking-wide text-[#2c1e10]"
          style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontSize: 'clamp(1.3rem, 5vw, 1.6rem)',
          }}
        >
          {weekday}
        </p>
        <p
          className="text-[#b59a7a] mt-1"
          style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1rem)' }}
        >
          {dayMonth}
        </p>
      </div>

      {/* Card do versículo */}
      <div
        className="relative rounded-[28px] border border-[#e8d9c4] px-7 pt-5 pb-8 mb-4"
        style={{
          background: 'linear-gradient(145deg, #fffdf9 0%, #f5ede0 100%)',
          boxShadow:
            '0 2px 4px rgba(180,130,60,0.06), 0 8px 24px rgba(180,130,60,0.13), 0 1px 0 rgba(255,255,255,0.9) inset',
        }}
      >
        <p
          className="text-center text-[#dfc8a0] leading-none mb-2 select-none"
          style={{ fontFamily: 'var(--font-lora), Georgia, serif', fontSize: '2rem' }}
        >
          ❝
        </p>

        <p
          className="text-center font-semibold text-[#2c1e10] leading-snug"
          style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontSize: 'clamp(1.75rem, 5.5vw, 2.15rem)',
          }}
        >
          {message.titulo}
        </p>

        <div className="w-8 h-[2px] bg-[#c9a97a] rounded-full mx-auto my-4" />

        <p
          className="text-center font-bold tracking-widest uppercase text-[#b59a7a]"
          style={{ fontSize: '0.72rem' }}
        >
          {message.versiculo}
        </p>
      </div>

      {/* Card da reflexão */}
      <div
        className="rounded-[20px] bg-white dark:bg-zinc-900 border border-[#ede5d8] dark:border-zinc-800 px-6 py-6 mb-5"
        style={{ boxShadow: '0 2px 8px rgba(180,130,60,0.06)' }}
      >
        <p
          className="text-center text-[#5a4a38] dark:text-slate-300 leading-relaxed"
          style={{ fontSize: 'clamp(1.15rem, 4.2vw, 1.3rem)' }}
        >
          {message.mensagem}
        </p>
      </div>

      {/* Chamada */}
      <div className="text-center mb-4 px-2">
        <p
          className="font-semibold text-[#2c7a4b]"
          style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1rem)' }}
        >
          🕊️ Você pode ser instrumento de Deus hoje
        </p>
        <p className="text-xs text-[#a08060] mt-1 leading-relaxed">
          Compartilhe — essa mensagem pode chegar em quem mais precisa.
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pb-28">
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2c7a4b] hover:bg-[#235f3b] active:scale-95 disabled:opacity-70 text-white font-semibold rounded-[16px] px-5 py-4 transition-all duration-200 shadow-lg shadow-green-900/20"
          style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}
        >
          <Share className="h-5 w-5 shrink-0" />
          {sharing ? 'Preparando...' : 'Compartilhar'}
        </button>

        {/* Bookmark com feedback visual */}
        <button
          onClick={handleSave}
          className={`
            w-14 h-14 flex items-center justify-center rounded-[16px] border transition-all duration-300
            ${saved
              ? 'bg-[#2c7a4b] border-[#2c7a4b] text-white shadow-md shadow-green-900/20 scale-105'
              : 'bg-white dark:bg-zinc-900 border-[#e0d0bc] dark:border-zinc-700 text-[#b59a7a] hover:bg-[#fdf6ee] active:scale-95'
            }
            ${justSaved ? 'scale-110' : ''}
          `}
          title={saved ? 'Mensagem salva' : 'Salvar mensagem'}
        >
          {saved
            ? <BookmarkCheck className="h-5 w-5" />
            : <Bookmark className="h-5 w-5" />
          }
        </button>
      </div>

      {/* Toast de confirmação do salvar */}
      <div
        className={`
          fixed bottom-8 left-1/2 -translate-x-1/2 z-50
          bg-[#2c1e10] text-white text-sm font-medium px-5 py-3 rounded-2xl
          shadow-xl transition-all duration-500
          ${justSaved ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        ✨ Mensagem salva com carinho
      </div>
    </div>
  );
}
