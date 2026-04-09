import { useRef, useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAgent } from '@/hooks/useAgent';

export default function ChatSection() {
  const { messages, streaming } = useApp();
  const { sendMessage } = useAgent();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) return null;

  function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput('');
    sendMessage(text);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 glass border border-glass-border rounded-2xl overflow-hidden animate-fadeInUp">
      {/* Messages */}
      <div className="overflow-y-auto max-h-[300px] flex flex-col gap-3 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={['flex', msg.role === 'user' ? 'justify-end' : 'justify-start'].join(' ')}
          >
            <div
              className={[
                'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-blue text-white rounded-br-sm'
                  : 'bg-s2 text-text rounded-bl-sm border border-glass-border',
              ].join(' ')}
            >
              {msg.content || (msg.role === 'assistant' && streaming ? (
                <span className="animate-blink text-muted2">▋</span>
              ) : null)}
              {msg.role === 'assistant' && streaming && msg.content && (
                <span className="animate-blink ml-0.5 text-muted2">▋</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-glass-border px-4 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte algo sobre os voos..."
          disabled={streaming}
          className="flex-1 bg-transparent text-text text-sm placeholder-muted2 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || streaming}
          className={[
            'px-4 py-1.5 rounded-xl text-sm font-medium transition-all',
            input.trim() && !streaming
              ? 'bg-blue text-white hover:bg-blue/90'
              : 'text-muted2 cursor-not-allowed',
          ].join(' ')}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
