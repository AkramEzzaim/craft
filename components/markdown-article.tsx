import Image from "next/image";
import type { ReactNode } from "react";

type Block = { type: "h2" | "h3" | "p" | "ul" | "ol" | "image"; text: string; items?: string[]; src?: string };
function inline(text: string): ReactNode[] { return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part); }
function parse(source: string): Block[] {
  const lines = source.split(/\r?\n/); const blocks: Block[] = []; let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }
    if (line.startsWith("## ")) { blocks.push({ type: "h2", text: line.slice(3) }); index++; continue; }
    if (line.startsWith("### ")) { blocks.push({ type: "h3", text: line.slice(4) }); index++; continue; }
    const image = /^!\[([^\]\n]*)\]\((\/images\/patterns\/[a-z0-9/_-]+\.(?:jpe?g|png|webp))\)$/i.exec(line);
    if (image) { blocks.push({ type: "image", text: image[1], src: image[2] }); index++; continue; }
    if (/^[-*] /.test(line)) { const items: string[] = []; while (index < lines.length && /^[-*] /.test(lines[index].trim())) items.push(lines[index++].trim().slice(2)); blocks.push({ type: "ul", text: "", items }); continue; }
    if (/^\d+\. /.test(line)) { const items: string[] = []; while (index < lines.length && /^\d+\. /.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^\d+\. /, "")); blocks.push({ type: "ol", text: "", items }); continue; }
    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !/^(#{2,3} |[-*] |\d+\. |!\[)/.test(lines[index].trim())) paragraph.push(lines[index++].trim());
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") }); else index++;
  }
  return blocks;
}
function render(block: Block, index: number): ReactNode {
  if (block.type === "p") return <p key={index}>{inline(block.text)}</p>;
  if (block.type === "ul") return <ul key={index}>{block.items?.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>;
  if (block.type === "ol") return <ol key={index}>{block.items?.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ol>;
  if (block.type === "image" && block.src) return <figure className="pattern-gallery-photo" key={index}><Image src={block.src} alt={block.text} width={1200} height={900} sizes="(max-width: 760px) 100vw, 750px"/></figure>;
  if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
  return null;
}
function section(title: string, blocks: Block[], key: number) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cards = ["Instructions", "Common Mistakes", "Variations", "FAQ"].includes(title);
  if (!cards) return <section className={`pattern-section pattern-section-${id}`} key={key}><h2 id={id}>{title}</h2>{blocks.map(render)}</section>;
  const groups: { title: string; content: Block[] }[] = []; const introduction: Block[] = [];
  for (const block of blocks) if (block.type === "h3") groups.push({ title: block.text, content: [] }); else if (groups.length) groups[groups.length - 1].content.push(block); else introduction.push(block);
  return <section className={`pattern-section pattern-section-${id}`} key={key}><h2 id={id}>{title}</h2>{introduction.map(render)}<div className="pattern-card-stack">{groups.map((group, index) => title === "FAQ" ? <details className="pattern-faq-card" key={index}><summary>{group.title}</summary><div>{group.content.map(render)}</div></details> : <article className="pattern-instruction-card" key={index}><h3>{group.title}</h3>{group.content.map(render)}</article>)}</div></section>;
}
export function MarkdownArticle({ source }: { source: string }) {
  const blocks = parse(source); const output: ReactNode[] = []; const sections: { title: string; content: Block[] }[] = []; let currentTitle = ""; let current: Block[] = []; let key = 0;
  function flush() { sections.push({ title: currentTitle, content: current }); current = []; }
  for (const block of blocks) if (block.type === "h2") { flush(); currentTitle = block.text; } else current.push(block);
  flush();
  for (let index = 0; index < sections.length; index++) {
    const item = sections[index];
    const next = sections[index + 1];
    if (item.title === "Abbreviations" && next?.title === "Instructions") {
      output.push(<div className="pattern-main-grid" key={key++}><div className="pattern-main-copy">{section(next.title, next.content, key++)}</div><aside className="pattern-abbreviation-sidebar" aria-label="Stitch abbreviations">{section(item.title, item.content, key++)}</aside></div>);
      index++; continue;
    }
    if (item.title) output.push(section(item.title, item.content, key++)); else output.push(...item.content.map(render));
  }
  return <div className="article-prose">{output}</div>;
}
