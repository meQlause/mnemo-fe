import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Sparkles, Tag, Heart, FileText } from 'lucide-react';
import type { AIStreamState } from '@/utils/types';

interface AIPanelProps {
  state: AIStreamState;
  onAnalyze: () => void;
  hasContent: boolean;
}

function SentimentBadge({ label }: { label: string }) {
  if (!label) return null;
  const lower = label.toLowerCase();
  if (lower.includes('positive')) return <Badge variant="emerald">{label}</Badge>;
  if (lower.includes('negative')) return <Badge variant="crimson">{label}</Badge>;
  return <Badge variant="default">{label}</Badge>;
}

export function AIPanel({ state, onAnalyze, hasContent }: AIPanelProps) {
  const hasResults = state.summary || state.tags.length > 0 || state.sentiment;

  return (
    <div className="border border-[--color-border] rounded-[--radius-lg] bg-[--color-paper-warm] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[--color-border-soft]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[--color-accent]" />
          <span className="text-xs font-medium text-[--color-ink-soft] uppercase tracking-wider">
            AI Analysis
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAnalyze}
          loading={state.loading}
          disabled={!hasContent || state.loading}
          className="text-xs h-7 px-2.5"
        >
          {hasResults ? 'Re-analyze' : 'Analyze'}
        </Button>
      </div>

      {!hasResults && !state.loading && (
        <div className="px-4 py-5 text-center">
          <p className="text-xs text-[--color-ink-mute]">
            Click analyze to get AI insights about this note.
          </p>
        </div>
      )}

      {(hasResults || state.loading) && (
        <div className="px-4 py-3 flex flex-col gap-4">
          {/* Summary */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3 h-3 text-[--color-ink-mute]" />
              <span className="text-xs font-medium text-[--color-ink-mute] uppercase tracking-wider">
                Summary
              </span>
            </div>
            <p className="text-xs text-[--color-ink-soft] leading-relaxed">
              {state.summary || (state.loading && state.streamingField === 'summary' ? '…' : '')}
            </p>
          </div>

          {/* Tags */}
          {(state.tags.length > 0 || state.streamingField === 'tags') && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Tag className="w-3 h-3 text-[--color-ink-mute]" />
                <span className="text-xs font-medium text-[--color-ink-mute] uppercase tracking-wider">
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {state.tags.map((tag) => (
                  <Badge key={tag} variant="sky">
                    {tag}
                  </Badge>
                ))}
                {state.streamingField === 'tags' && (
                  <span className="text-xs text-[--color-ink-mute] animate-pulse-soft">…</span>
                )}
              </div>
            </div>
          )}

          {/* Sentiment */}
          {(state.sentiment || state.streamingField === 'sentiment') && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Heart className="w-3 h-3 text-[--color-ink-mute]" />
                <span className="text-xs font-medium text-[--color-ink-mute] uppercase tracking-wider">
                  Sentiment
                </span>
              </div>
              <SentimentBadge label={state.sentiment} />
              {state.streamingField === 'sentiment' && !state.sentiment && (
                <span className="text-xs text-[--color-ink-mute] animate-pulse-soft">…</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
