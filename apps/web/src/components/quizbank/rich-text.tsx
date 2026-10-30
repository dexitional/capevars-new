// Quizbank rich text: a small markup for questions, answers and lessons. Maths and
// chemistry are typeset by KaTeX; the rest is built as React nodes, so nothing but
// KaTeX's own output is injected as HTML. Plain text renders as it always did.
//
//   Inline   $x^2$  $$\int_1^5 y\,dx$$  **bold**  _italic_  ++underline++  `mono`
//            ==highlight==  ~~struck~~  {{green:result}} (green blue red amber purple slate)
//            $\ce{H2SO4}$ for chemistry
//   Blocks   ## Heading   - or • bullets   1. steps   > quote   > [!tip] Title (tip note
//            warning answer formula)   | pipe | tables |   ```mono block```   $$ display $$   ---
import { useMemo } from "react";
import katex from "katex";
import "katex/contrib/mhchem";
import { CheckCircle2, GraduationCap, Info, Lightbulb, ListOrdered, Sigma, Sparkles, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "#/lib/utils";

// ---- Inline ----------------------------------------------------------------------------------

const CHIP: Record<string, string> = {
  green: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  blue: "bg-sky-100 text-sky-900 ring-sky-200",
  red: "bg-red-100 text-red-900 ring-red-200",
  amber: "bg-amber-100 text-amber-950 ring-amber-200",
  purple: "bg-violet-100 text-violet-900 ring-violet-200",
  slate: "bg-slate-100 text-slate-800 ring-slate-200",
};

function Maths({ tex, display }: { tex: string; display?: boolean }) {
  const html = useMemo(() => katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore", output: "htmlAndMathml" }), [tex, display]);
  return display ? (
    <span className="block overflow-x-auto overflow-y-hidden py-1 text-center" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span className="whitespace-nowrap" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

type Rule = { re: RegExp; render: (m: RegExpExecArray, key: string) => React.ReactNode };

// Earlier rules win ties, so maths and code are never re-read as emphasis. Emphasis
// needs non-space just inside its markers, which keeps "SELECT *", "$300" and
// snake_case names as plain text.
const RULES: Array<Rule> = [
  { re: /\\\$/g, render: () => "$" },
  { re: /\$\$(.+?)\$\$/g, render: (m, k) => <Maths key={k} tex={m[1]!} display /> },
  { re: /\$(?=[^\s$])((?:\\\$|[^$\n])+?)(?<=\S)\$(?!\d)/g, render: (m, k) => <Maths key={k} tex={m[1]!} /> },
  {
    re: /`([^`\n]+)`/g,
    render: (m, k) => (
      <code key={k} className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.88em] font-medium text-rose-700 ring-1 ring-slate-200">
        {m[1]}
      </code>
    ),
  },
  {
    re: /\{\{(green|blue|red|amber|purple|slate):((?:\$[^$\n]*\$|[^$])+?)\}\}/g,
    render: (m, k) => (
      <span key={k} className={cn("rounded-md px-1.5 py-0.5 font-semibold ring-1 [box-decoration-break:clone]", CHIP[m[1]!])}>
        {inline(m[2]!, k)}
      </span>
    ),
  },
  {
    re: /\*\*(?=\S)(.+?)(?<=\S)\*\*/g,
    render: (m, k) => (
      <strong key={k} className="font-bold text-primary">
        {inline(m[1]!, k)}
      </strong>
    ),
  },
  {
    re: /\+\+(?=\S)(.+?)(?<=\S)\+\+/g,
    render: (m, k) => (
      <span key={k} className="underline decoration-sky-400 decoration-2 underline-offset-4">
        {inline(m[1]!, k)}
      </span>
    ),
  },
  {
    re: /==(?=\S)(.+?)(?<=\S)==/g,
    render: (m, k) => (
      <mark key={k} className="rounded bg-amber-200/70 px-1 text-inherit [box-decoration-break:clone]">
        {inline(m[1]!, k)}
      </mark>
    ),
  },
  {
    re: /~~(?=\S)(.+?)(?<=\S)~~/g,
    render: (m, k) => (
      <s key={k} className="text-muted-foreground decoration-red-400 decoration-2">
        {inline(m[1]!, k)}
      </s>
    ),
  },
  {
    re: /(?<![\w\\])_(?=[^\s_])(.+?)(?<=[^\s_])_(?!\w)/g,
    render: (m, k) => (
      <em key={k} className="italic">
        {inline(m[1]!, k)}
      </em>
    ),
  },
  {
    re: /https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"]/g,
    render: (m, k) => (
      <a key={k} href={m[0]} target="_blank" rel="noopener noreferrer nofollow" className="text-info underline">
        {m[0]}
      </a>
    ),
  },
];

function inline(text: string, keyPrefix = "i"): Array<React.ReactNode> {
  const out: Array<React.ReactNode> = [];
  let at = 0;
  while (at < text.length) {
    let best: { m: RegExpExecArray; rule: Rule } | null = null;
    for (const rule of RULES) {
      rule.re.lastIndex = at;
      const m = rule.re.exec(text);
      if (m && (!best || m.index < best.m.index)) best = { m, rule };
    }
    if (!best) break;
    if (best.m.index > at) out.push(text.slice(at, best.m.index));
    out.push(best.rule.render(best.m, `${keyPrefix}.${out.length}`));
    at = best.m.index + best.m[0].length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}

// ---- Blocks ----------------------------------------------------------------------------------

const CALLOUTS: Record<string, { title: string; icon: LucideIcon; tone: string; iconTone: string }> = {
  tip: { title: "Exam tip", icon: Lightbulb, tone: "border-amber-400 bg-amber-50 text-amber-950", iconTone: "text-amber-600" },
  note: { title: "Note", icon: Info, tone: "border-sky-400 bg-sky-50 text-sky-950", iconTone: "text-sky-600" },
  warning: { title: "Common mistake", icon: TriangleAlert, tone: "border-red-400 bg-red-50 text-red-950", iconTone: "text-red-500" },
  answer: { title: "Answer", icon: CheckCircle2, tone: "border-emerald-500 bg-emerald-50 text-emerald-950", iconTone: "text-emerald-600" },
  formula: { title: "Key formula", icon: Sigma, tone: "border-violet-400 bg-violet-50 text-violet-950", iconTone: "text-violet-600" },
};

// Headings pick up a colour and icon from what they introduce.
const HEADINGS: Array<{ match: RegExp; icon: LucideIcon; tone: string }> = [
  { match: /advanced|in depth|formal/i, icon: GraduationCap, tone: "bg-indigo-600 text-white" },
  { match: /simpl|plain|in short|everyday/i, icon: Sparkles, tone: "bg-emerald-600 text-white" },
  { match: /answer|result|solution/i, icon: CheckCircle2, tone: "bg-emerald-100 text-emerald-900" },
  { match: /step|working|method/i, icon: ListOrdered, tone: "bg-sky-100 text-sky-900" },
  { match: /formula|rule|theorem|law/i, icon: Sigma, tone: "bg-violet-100 text-violet-900" },
];

const LIST_ITEM = /^(\s*)(?:([-•])|(\d+)[.)])\s+(.*)$/;
const TABLE_RULE = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$|^\s*\|\s*:?-+:?\s*\|\s*$/;
const isTableStart = (lines: Array<string>, i: number) => lines[i]!.includes("|") && i + 1 < lines.length && TABLE_RULE.test(lines[i + 1]!);
const CALLOUT_START = /^>\s?\[!\w+\]/;
const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

function Heading({ text, level }: { text: string; level: number }) {
  const look = HEADINGS.find((h) => h.match.test(text));
  if (level <= 2 && look) {
    const Icon = look.icon;
    return (
      <p className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black tracking-wide uppercase", look.tone)}>
        <Icon className="size-3.5" /> {inline(text)}
      </p>
    );
  }
  return <p className={cn("font-bold text-primary", level <= 2 ? "border-b pb-1 text-[1.05em]" : "text-[0.95em]")}>{inline(text)}</p>;
}

function blocks(src: string, keyPrefix = "b"): Array<React.ReactNode> {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const out: Array<React.ReactNode> = [];
  const key = () => `${keyPrefix}.${out.length}`;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    const t = line.trim();
    if (!t) {
      i++;
      continue;
    }
    // ``` mono block ```
    if (t.startsWith("```")) {
      const body: Array<string> = [];
      for (i++; i < lines.length && !lines[i]!.trim().startsWith("```"); i++) body.push(lines[i]!);
      i++;
      out.push(
        <pre key={key()} className="overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 font-mono text-[0.85em] leading-relaxed text-slate-100">
          {body.join("\n")}
        </pre>,
      );
      continue;
    }
    // $$ display maths $$, on one line or spread over several
    const oneLine = t.length > 4 && /^\$\$[^$]+\$\$$/.test(t);
    if (oneLine || t === "$$" || (t.startsWith("$$") && !t.slice(2).includes("$"))) {
      const body: Array<string> = [oneLine ? t.slice(2, -2) : t.slice(2)];
      if (!oneLine) {
        for (i++; i < lines.length && !lines[i]!.trim().endsWith("$$"); i++) body.push(lines[i]!);
        if (i < lines.length) body.push(lines[i]!.trim().slice(0, -2));
      }
      i++;
      const tex = body.join("\n");
      out.push(
        <div key={key()} className="rounded-xl bg-slate-50 px-3 py-1 ring-1 ring-slate-200/70">
          <Maths tex={tex} display />
        </div>,
      );
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(t)) {
      out.push(<hr key={key()} className="border-dashed border-slate-300" />);
      i++;
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(t);
    if (heading) {
      out.push(<Heading key={key()} text={heading[2]!} level={heading[1]!.length} />);
      i++;
      continue;
    }
    // > quote, or > [!kind] Title callout
    if (t.startsWith(">")) {
      const body: Array<string> = [];
      // A new [!kind] marker starts the next callout.
      for (; i < lines.length && lines[i]!.trim().startsWith(">") && !(body.length && CALLOUT_START.test(lines[i]!.trim())); i++) body.push(lines[i]!.trim().replace(/^>\s?/, ""));
      const marker = /^\[!(\w+)\]\s*(.*)$/.exec(body[0] ?? "");
      const callout = marker ? CALLOUTS[marker[1]!.toLowerCase()] : undefined;
      if (callout) {
        const Icon = callout.icon;
        const k = key();
        out.push(
          <div key={k} className={cn("rounded-xl border-l-4 px-3.5 py-2.5", callout.tone)}>
            <p className="flex items-center gap-1.5 text-xs font-black tracking-wide uppercase">
              <Icon className={cn("size-4", callout.iconTone)} /> {inline(marker![2] || callout.title, k)}
            </p>
            {body.length > 1 && <div className="mt-1.5 space-y-2">{blocks(body.slice(1).join("\n"), k)}</div>}
          </div>,
        );
      } else {
        out.push(
          <blockquote key={key()} className="space-y-2 border-l-4 border-slate-300 pl-3 text-muted-foreground italic">
            {blocks(body.join("\n"), key())}
          </blockquote>,
        );
      }
      continue;
    }
    // | pipe | table |, with a |---| rule under the header
    if (isTableStart(lines, i)) {
      const head = cells(line);
      const align = cells(lines[i + 1]!).map((c) => (c.startsWith(":") && c.endsWith(":") ? "text-center" : c.endsWith(":") ? "text-right" : "text-left"));
      const rows: Array<Array<string>> = [];
      for (i += 2; i < lines.length && lines[i]!.includes("|") && lines[i]!.trim(); i++) rows.push(cells(lines[i]!));
      const k = key();
      out.push(
        <div key={k} className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
          <table className="w-full border-collapse text-[0.92em]">
            <thead>
              <tr className="bg-slate-100 text-primary">
                {head.map((c, ci) => (
                  <th key={ci} className={cn("px-3 py-2 font-bold whitespace-nowrap", align[ci])}>
                    {inline(c, `${k}.h${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, ri) => (
                <tr key={ri} className="odd:bg-white even:bg-slate-50/70">
                  {head.map((_, ci) => (
                    <td key={ci} className={cn("px-3 py-1.5 tabular-nums", align[ci])}>
                      {inline(r[ci] ?? "", `${k}.${ri}.${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    // - • bullets and 1. numbered steps
    const first = LIST_ITEM.exec(line);
    if (first) {
      const ordered = Boolean(first[3]);
      const items: Array<{ text: string; indent: number; n: number }> = [];
      for (; i < lines.length; i++) {
        const m = LIST_ITEM.exec(lines[i]!);
        if (!m || Boolean(m[3]) !== ordered) break;
        items.push({ text: m[4]!, indent: m[1]!.length, n: Number(m[3] ?? 0) });
      }
      const k = key();
      out.push(
        ordered ? (
          <ol key={k} className="space-y-1.5">
            {items.map((it, ii) => (
              <li key={ii} className={cn("flex items-start gap-2.5", it.indent >= 2 && "ml-6")}>
                <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-primary text-[11px] font-black text-white">{it.n}</span>
                <span className="min-w-0 flex-1">{inline(it.text, `${k}.${ii}`)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <ul key={k} className="space-y-1">
            {items.map((it, ii) => (
              <li key={ii} className={cn("flex items-start gap-2.5", it.indent >= 2 && "ml-6")}>
                <span className="mt-[0.6em] size-1.5 flex-none rounded-full bg-amber-500" />
                <span className="min-w-0 flex-1">{inline(it.text, `${k}.${ii}`)}</span>
              </li>
            ))}
          </ul>
        ),
      );
      continue;
    }
    // Paragraph: consecutive plain lines, line breaks kept. It always takes its first
    // line, so a line no block above accepted can't stall the loop.
    const para: Array<string> = [line];
    for (i++; i < lines.length; i++) {
      const l = lines[i]!;
      const lt = l.trim();
      if (!lt || /^(```|\$\$|>|#{1,4}\s|-{3,}$)/.test(lt) || LIST_ITEM.test(l) || isTableStart(lines, i)) break;
      para.push(l);
    }
    const k = key();
    out.push(
      <p key={k} className="whitespace-pre-line">
        {inline(para.join("\n"), k)}
      </p>,
    );
  }
  return out;
}

export function RichText({ text, className, inline: asInline }: { text: string | null | undefined; className?: string; inline?: boolean }) {
  const nodes = useMemo(() => (text ? (asInline ? inline(text) : blocks(text)) : null), [text, asInline]);
  if (!nodes) return null;
  if (asInline) return <span className={cn("wrap-break-word whitespace-pre-line", className)}>{nodes}</span>;
  return <div className={cn("space-y-3 wrap-break-word [&_.katex]:text-[1.08em]", className)}>{nodes}</div>;
}
