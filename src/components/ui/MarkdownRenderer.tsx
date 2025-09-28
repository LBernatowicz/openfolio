"use client";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Simple Markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    if (!text) return text;

    // Convert line breaks to <br>
    let html = text.replace(/\n/g, '<br>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-slate-200 mb-3 mt-6">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-blue-400 mb-4 mt-8">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mb-6 border-b border-slate-700 pb-2">$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Code blocks with language specification
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto mb-4"><code class="text-slate-200 font-mono text-sm">$2</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-blue-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg border border-slate-700 max-w-full h-auto mb-4" />');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li class="text-slate-300">• $1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="text-slate-300">$1</li>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-slate-400 mb-4">$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="border-slate-700 my-8" />');

    // Wrap lists
    html = html.replace(/(<li class="text-slate-300">[\s\S]*?<\/li>)/g, '<ul class="list-none text-slate-300 mb-4 space-y-1">$1</ul>');

    // Paragraphs
    html = html.replace(/^(?!<[h1-6]|<ul|<ol|<li|<blockquote|<pre|<hr)(.*)$/gim, '<p class="text-slate-300 leading-relaxed mb-4">$1</p>');

    return html;
  };

  const htmlContent = parseMarkdown(content);

  return (
    <div 
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
