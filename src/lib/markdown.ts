export function parseMarkdown(markdown: string): string {
  if (!markdown) return "";

  // 1. Escape HTML of the entire input to prevent stored XSS attacks
  let html = escapeHtml(markdown).replace(/\r\n/g, "\n");

  // 2. Code blocks: ```code```
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    // code is already escaped because we escaped the entire markdown!
    return `<pre className="bg-black/60 border border-white/10 p-4 rounded-lg my-4 overflow-x-auto text-xs font-mono text-cyan-300"><code>${code.trim()}</code></pre>`;
  });

  // Split into blocks by double newlines
  const blocks = html.split(/\n\n+/);
  const processedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";

    // If it's a code block (already wrapped)
    if (trimmed.startsWith("<pre")) return trimmed;

    // Headers: #, ##, ###
    if (trimmed.startsWith("# ")) {
      return `<h1 className="text-3xl font-black font-heading text-white mt-8 mb-4 uppercase tracking-wide border-b border-white/5 pb-2">${parseInline(trimmed.substring(2))}</h1>`;
    }
    if (trimmed.startsWith("## ")) {
      return `<h2 className="text-2xl font-bold font-heading text-white mt-6 mb-3 uppercase tracking-wider">${parseInline(trimmed.substring(3))}</h2>`;
    }
    if (trimmed.startsWith("### ")) {
      return `<h3 className="text-xl font-bold font-heading text-white mt-4 mb-2 uppercase">${parseInline(trimmed.substring(4))}</h3>`;
    }

    // Blockquotes: > quote
    if (trimmed.startsWith("> ")) {
      const quoteContent = trimmed.split("\n").map(line => line.substring(2).trim()).join("<br />");
      return `<blockquote className="border-l-4 border-cyan-400 bg-cyan-950/20 p-4 pl-5 rounded-r-lg my-4 italic text-neutral-300 font-light leading-relaxed">${parseInline(quoteContent)}</blockquote>`;
    }

    // Bullet Lists: - item or * item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed.split("\n").map((line) => {
        const content = line.substring(2).trim();
        return `<li className="ml-5 list-disc mb-1.5 text-neutral-300 leading-relaxed font-light">${parseInline(content)}</li>`;
      });
      return `<ul className="my-4 space-y-1">${items.join("")}</ul>`;
    }

    // Default: paragraph
    const lines = trimmed.split("\n").map(line => line.trim()).join("<br />");
    return `<p className="text-neutral-300 leading-relaxed font-light text-sm sm:text-base mb-4">${parseInline(lines)}</p>`;
  });

  return processedBlocks.filter(b => b !== "").join("\n");
}

function parseInline(text: string): string {
  let result = text;

  // Bold: **text**
  result = result.replace(/\*\*([\s\S]*?)\*\*/g, "<strong>$1</strong>");

  // Italics: *text*
  result = result.replace(/\*([\s\S]*?)\*/g, "<em>$1</em>");

  // Code: `code`
  result = result.replace(/`([^`]+)`/g, "<code className=\"bg-white/5 px-1.5 py-0.5 rounded text-xs font-mono text-pink-400\">$1</code>");

  // Links: [text](url) - Sanitized to prevent javascript: and data: protocol exploits
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const sanitizedUrl = sanitizeUrl(url);
    return `<a href="${sanitizedUrl}" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline transition-colors">${linkText}</a>`;
  });

  return result;
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  // Decode common URL entities to prevent bypassing validation (e.g. j&#97;vascript:)
  const decoded = trimmed
    .replace(/&#x([0-9a-f]+);/gi, (match, num) => String.fromCharCode(parseInt(num, 16)))
    .replace(/&#([0-9]+);/gi, (match, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&colon;/gi, ":");

  // Block javascript:, data:, and vbscript: URLs to prevent XSS
  if (
    decoded.startsWith("javascript:") || 
    decoded.startsWith("data:") || 
    decoded.startsWith("vbscript:")
  ) {
    return "#";
  }
  return url;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
