import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part);
}

export function MarkdownArticle({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }
    if (line.startsWith("## ")) { const heading = line.slice(3); blocks.push(<h2 id={heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")} key={index}>{heading}</h2>); index++; continue; }
    if (line.startsWith("### ")) { blocks.push(<h3 key={index}>{line.slice(4)}</h3>); index++; continue; }
    if (/^[-*] /.test(line)) {
      const start = index; const items: string[] = [];
      while (index < lines.length && /^[-*] /.test(lines[index].trim())) items.push(lines[index++].trim().slice(2));
      blocks.push(<ul key={start}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>); continue;
    }
    if (/^\d+\. /.test(line)) {
      const start = index; const items: string[] = [];
      while (index < lines.length && /^\d+\. /.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^\d+\. /, ""));
      blocks.push(<ol key={start}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ol>); continue;
    }
    const start = index; const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !/^(#{2,3} |[-*] |\d+\. )/.test(lines[index].trim())) paragraph.push(lines[index++].trim());
    blocks.push(<p key={start}>{inline(paragraph.join(" "))}</p>);
  }
  return <div className="article-prose">{blocks}</div>;
}
