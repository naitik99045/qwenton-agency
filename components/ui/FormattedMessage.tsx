'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface FormattedMessageProps {
  content: string;
  className?: string;
}

export function FormattedMessage({ content, className = '' }: FormattedMessageProps) {
  if (!content) return null;

  // Split by code blocks first (```...```)
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const parts = content.split(codeBlockRegex);

  return (
    <div className={`space-y-2 leading-relaxed text-xs sm:text-sm ${className}`}>
      {parts.map((part, pIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0]?.trim();
          const isLanguage = firstLine && !firstLine.includes(' ') && firstLine.length < 15;
          const codeBody = isLanguage ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={pIdx} className="my-2 rounded-control bg-[#1E1E24] text-[#E6EEF8] p-3 text-xs font-mono overflow-x-auto shadow-inner border border-black/20">
              {isLanguage && (
                <div className="text-[10px] uppercase font-bold text-ink-muted/80 pb-1 mb-1 border-b border-white/10">
                  {firstLine}
                </div>
              )}
              <pre className="whitespace-pre">{codeBody}</pre>
            </div>
          );
        }

        // Process paragraphs in non-code block
        const paragraphs = part.split(/\n\n+/);
        return (
          <React.Fragment key={pIdx}>
            {paragraphs.map((para, paraIdx) => (
              <p key={paraIdx} className="whitespace-pre-wrap break-words">
                {renderInlineMarkdown(para)}
              </p>
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  // Regex matches:
  // 1. Markdown link: [label](url)
  // 2. Bold text: **text**
  // 3. Inline code: `code`
  // 4. Raw URL: https?://[^\s<]+
  const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|(https?:\/\/[^\s<]+))/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    const [fullMatch, , linkText, linkUrl, boldText, inlineCode, rawUrl] = match;
    const matchIndex = match.index;

    // Plain text before token
    if (matchIndex > lastIndex) {
      nodes.push(text.substring(lastIndex, matchIndex));
    }

    if (linkText && linkUrl) {
      // Markdown link
      const isInternal = linkUrl.startsWith('/') || linkUrl.startsWith('#');
      if (isInternal) {
        nodes.push(
          <Link
            key={matchIndex}
            href={linkUrl}
            className="font-bold text-primary underline underline-offset-2 hover:text-primary-deep inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-primary/10 transition-colors"
          >
            <span>{linkText}</span>
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={matchIndex}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#2B6CB0] underline underline-offset-2 hover:text-[#1A4971] inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-[#EBF8FF] transition-colors"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3 inline shrink-0" />
          </a>
        );
      }
    } else if (boldText) {
      nodes.push(<strong key={matchIndex} className="font-bold text-ink">{boldText}</strong>);
    } else if (inlineCode) {
      nodes.push(
        <code key={matchIndex} className="px-1.5 py-0.5 rounded bg-black/5 text-[#9C4221] font-mono text-[11px] border border-border/50">
          {inlineCode}
        </code>
      );
    } else if (rawUrl) {
      nodes.push(
        <a
          key={matchIndex}
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline underline-offset-2 hover:text-primary-deep inline-flex items-center gap-0.5 max-w-[280px] sm:max-w-md truncate"
        >
          <span className="truncate">{rawUrl}</span>
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes;
}
