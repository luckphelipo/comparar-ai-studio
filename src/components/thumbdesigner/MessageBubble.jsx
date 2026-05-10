import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-yellow-500/20 to-primary/20 border border-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
      )}
      <div className={cn('max-w-[85%]', isUser && 'flex flex-col items-end')}>
        {message.content && (
          <div className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border'
          )}>
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="relative group/msg">
                <ReactMarkdown
                  className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                  components={{
                    code: ({ inline, className, children }) => {
                      if (inline) {
                        return <code className="px-1 py-0.5 rounded bg-secondary text-primary text-xs">{children}</code>;
                      }
                      return (
                        <div className="relative group/code my-2">
                          <pre className="bg-secondary rounded-lg p-3 overflow-x-auto text-xs text-muted-foreground whitespace-pre-wrap">
                            <code>{children}</code>
                          </pre>
                          <button
                            onClick={() => handleCopy(String(children))}
                            className="absolute top-2 right-2 p-1.5 rounded bg-border/50 hover:bg-border opacity-0 group-hover/code:opacity-100 transition-opacity"
                          >
                            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                          </button>
                        </div>
                      );
                    },
                    h3: ({ children }) => (
                      <h3 className="text-sm font-bold text-primary mt-4 mb-2 border-b border-primary/20 pb-1">{children}</h3>
                    ),
                    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                    p: ({ children }) => <p className="my-1.5 leading-relaxed text-muted-foreground">{children}</p>,
                    ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>,
                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                <button
                  onClick={() => handleCopy(message.content)}
                  className="absolute top-2 right-2 p-1.5 rounded bg-secondary/50 hover:bg-secondary opacity-0 group-hover/msg:opacity-100 transition-opacity"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}