"use client";

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  firstParagraphRef?: React.RefObject<HTMLParagraphElement | null>;
}

export default function MarkdownRenderer({ content, className = "", firstParagraphRef }: MarkdownRendererProps) {
  let isFirstParagraph = true;
  
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Headers
          h1: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
            return (
              <h1 id={id} className="text-3xl font-bold text-white mb-6 border-b border-slate-700 pb-2">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
            return (
              <h2 id={id} className="text-2xl font-bold text-blue-400 mb-4 mt-8">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
            return (
              <h3 id={id} className="text-xl font-semibold text-slate-200 mb-3 mt-6">
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
            return (
              <h4 id={id} className="text-lg font-semibold text-slate-300 mb-2 mt-4">
                {children}
              </h4>
            );
          },
          h5: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
            return (
              <h5 id={id} className="text-base font-semibold text-slate-300 mb-2 mt-3">
                {children}
              </h5>
            );
          },
          h6: ({ children }) => {
            const id = String(children).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
            return (
              <h6 id={id} className="text-sm font-semibold text-slate-300 mb-2 mt-3">
                {children}
              </h6>
            );
          },
          
          // Paragraphs
          p: ({ children }) => {
            const paragraph = (
              <p 
                ref={isFirstParagraph ? firstParagraphRef : undefined}
                className="text-slate-300 leading-relaxed mb-4"
              >
                {children}
              </p>
            );
            isFirstParagraph = false;
            return paragraph;
          },
          
          // Code blocks
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const inline = !match;
            
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className="rounded-lg mb-4"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-slate-800 text-blue-300 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-300">
              {children}
            </li>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 mb-4">
              {children}
            </blockquote>
          ),
          
          // Horizontal rules
          hr: () => (
            <hr className="border-slate-700 my-8" />
          ),
          
          // Images
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              className="rounded-lg border border-slate-700 max-w-full h-auto mb-4" 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
