// Symbol pad above the written-answer box: common maths signs always, then packs
// picked from what the question is about (its topic tags and course titles), with
// every other pack one tap away under "More". Clicking inserts at the caret.
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "#/lib/utils";

// [insert, name] or [insert, name, label, caretBack]: `label` is shown instead of the
// insert text; `caretBack` leaves the caret that many characters before the end, so
// "√()" puts it between the brackets (and wraps any selected text there).
type Sym = [string, string] | [string, string, string] | [string, string, string, number];
export type SymbolInsert = { text: string; back: number };

interface Pack {
  id: string;
  label: string;
  // Matched against the question's tags and course titles.
  match?: RegExp;
  groups: Array<Array<Sym>>;
}

// One symbol per character, named by the matching space-separated word.
const named = (chars: string, names: string, prefix = ""): Array<Sym> => {
  const words = names.split(" ");
  return [...chars].map((c, i) => [c, `${prefix}${words[i]}`]);
};

const SUPERSCRIPTS: Array<Sym> = [..."⁰¹²³⁴⁵⁶⁷⁸⁹"].map((c, i) => [c, `superscript ${i}`] as Sym).concat([
  ["⁺", "superscript plus"],
  ["⁻", "superscript minus"],
  ["ⁿ", "superscript n"],
  ["ˣ", "superscript x"],
  ["⁻¹", "power minus one (inverse)"],
]);
const SUBSCRIPTS: Array<Sym> = [..."₀₁₂₃₄₅₆₇₈₉"].map((c, i) => [c, `subscript ${i}`] as Sym).concat([
  ["ₙ", "subscript n"],
  ["ᵣ", "subscript r"],
  ["ₓ", "subscript x"],
]);

const COMMON: Pack = {
  id: "common",
  label: "Common",
  groups: [
    [
      ["×", "times"],
      ["÷", "divided by"],
      ["±", "plus or minus"],
      ["−", "minus sign"],
      ["≠", "not equal to"],
      ["≈", "approximately equal to"],
      ["<", "less than"],
      [">", "greater than"],
      ["≤", "less than or equal to"],
      ["≥", "greater than or equal to"],
    ],
    [
      ["²", "squared"],
      ["³", "cubed"],
      ["√()", "square root", "√( )", 1],
      ["½", "one half"],
      ["π", "pi"],
      ["θ", "theta"],
      ["°", "degrees"],
      ["∞", "infinity"],
    ],
    [
      ["→", "arrow / tends to"],
      ["⇒", "implies"],
      ["∴", "therefore"],
      ["∵", "because"],
      ["✓", "tick"],
      ["•", "bullet point"],
    ],
  ],
};

const PACKS: Array<Pack> = [
  {
    id: "algebra",
    label: "Algebra & powers",
    match: /math|algebra|polynom|surd|indic|logarithm|quadratic|equation|function|binomial|sequence|series|number|\bratios?\b|\bvariation/i,
    groups: [
      SUPERSCRIPTS,
      SUBSCRIPTS,
      [
        ["∛", "cube root"],
        ["∜", "fourth root"],
        ["⅓", "one third"],
        ["⅔", "two thirds"],
        ["¼", "one quarter"],
        ["¾", "three quarters"],
        ["⅕", "one fifth"],
        ["⅛", "one eighth"],
      ],
      [
        ["||", "absolute value", "|x|", 1],
        ["log₁₀ ", "log base 10", "log₁₀"],
        ["ln ", "natural log", "ln"],
        ["eˣ", "e to the x"],
        ["ⁿCᵣ", "combinations n C r"],
        ["ⁿPᵣ", "permutations n P r"],
        ["!", "factorial"],
        ["∝", "proportional to"],
        ["≡", "identical to"],
      ],
    ],
  },
  {
    id: "calculus",
    label: "Calculus",
    match: /calculus|integral|integration|differentia|derivative|\blimits?\b|rate of change|maxim|minim|trapezium|elective math|further math/i,
    groups: [
      [
        ["∫", "integral"],
        ["∫ₐᵇ ", "definite integral from a to b", "∫ₐᵇ"],
        ["∬", "double integral"],
        ["∮", "contour integral"],
        [" dx", "with respect to x", "dx"],
      ],
      [
        ["d/dx ", "derivative with respect to x", "d/dx"],
        ["dy/dx", "dy by dx"],
        ["d²y/dx²", "second derivative"],
        ["∂", "partial"],
        ["′", "prime (derivative)"],
        ["″", "double prime"],
      ],
      [
        ["lim ", "limit", "lim"],
        ["→", "tends to"],
        ["∞", "infinity"],
        ["Δ", "change in (delta)"],
        ["δ", "small change"],
        ["∇", "nabla / gradient"],
        ["Σ", "sum (sigma)"],
        ["∏", "product"],
      ],
    ],
  },
  {
    id: "geometry",
    label: "Trig & geometry",
    match: /math|trig|geometr|angle|circle|triangle|bearing|mensuration|polygon|locus|coordinate|sine|cosine|construction/i,
    groups: [
      [
        ["θ", "theta"],
        ["α", "alpha"],
        ["β", "beta"],
        ["φ", "phi"],
        ["°", "degrees"],
        ["′", "minutes (of angle)"],
        ["″", "seconds (of angle)"],
        ["π", "pi"],
      ],
      [
        ["sin ", "sine", "sin"],
        ["cos ", "cosine", "cos"],
        ["tan ", "tangent", "tan"],
        ["sin⁻¹ ", "inverse sine", "sin⁻¹"],
        ["cos⁻¹ ", "inverse cosine", "cos⁻¹"],
        ["tan⁻¹ ", "inverse tangent", "tan⁻¹"],
        ["sec ", "secant", "sec"],
        ["cosec ", "cosecant", "cosec"],
        ["cot ", "cotangent", "cot"],
      ],
      [
        ["∠", "angle"],
        ["△", "triangle"],
        ["⊥", "perpendicular to"],
        ["∥", "parallel to"],
        ["≅", "congruent to"],
        ["∼", "similar to"],
        ["⌒", "arc"],
        ["⊙", "circle"],
      ],
    ],
  },
  {
    id: "sets",
    label: "Sets & logic",
    match: /math|\bsets?\b|logic|binary operation|boolean|relation|discrete|proof|venn|mapping|group/i,
    groups: [
      [
        ["∈", "is an element of"],
        ["∉", "is not an element of"],
        ["⊂", "proper subset of"],
        ["⊆", "subset of"],
        ["⊃", "superset of"],
        ["∪", "union"],
        ["∩", "intersection"],
        ["∅", "empty set"],
        ["′", "complement"],
        ["n()", "number of elements", "n( )", 1],
      ],
      [
        ["ℕ", "natural numbers"],
        ["ℤ", "integers"],
        ["ℚ", "rational numbers"],
        ["ℝ", "real numbers"],
        ["ℂ", "complex numbers"],
      ],
      [
        ["∀", "for all"],
        ["∃", "there exists"],
        ["¬", "not"],
        ["∧", "and"],
        ["∨", "or"],
        ["⇒", "implies"],
        ["⇔", "if and only if"],
        ["∗", "binary operation (star)"],
        ["∘", "composition"],
        ["↦", "maps to"],
      ],
    ],
  },
  {
    id: "vectors",
    label: "Vectors & matrices",
    match: /vector|matri|transformation|linear|determinant|mechanic|\bforces?\b|elective math|further math/i,
    groups: [
      [
        ["𝐢", "unit vector i"],
        ["𝐣", "unit vector j"],
        ["𝐤", "unit vector k"],
        ["⃗", "arrow over the previous letter", "a⃗"],
        ["||", "magnitude", "|v|", 1],
        ["·", "dot product"],
        ["×", "cross product"],
        ["λ", "lambda (scalar)"],
      ],
      [
        ["⎛  ⎞\n⎝  ⎠", "column vector (type inside)", "(x y)ᵀ"],
        ["⎛    ⎞\n⎝    ⎠", "2 × 2 matrix (type inside)", "2×2"],
        ["ᵀ", "transpose"],
        ["⁻¹", "inverse"],
        ["det ", "determinant", "det"],
        ["⟨⟩", "angle brackets", "⟨ ⟩", 1],
      ],
    ],
  },
  {
    id: "statistics",
    label: "Statistics & probability",
    match: /math|statistic|probab|distribution|frequency|permutation|combination|\bmean\b|median|variance|random|sampl|binomial|ogive/i,
    groups: [
      [
        ["x̄", "mean (x bar)"],
        ["Σ", "sum"],
        ["Σf", "sum of frequencies"],
        ["Σfx", "sum of fx"],
        ["σ", "standard deviation"],
        ["σ²", "variance"],
        ["μ", "population mean"],
        ["ρ", "correlation (rho)"],
        ["χ²", "chi-squared"],
      ],
      [
        ["P()", "probability of", "P( )", 1],
        ["P(|)", "conditional probability", "P(A|B)", 2],
        ["ⁿCᵣ", "combinations"],
        ["ⁿPᵣ", "permutations"],
        ["!", "factorial"],
        ["∩", "and (intersection)"],
        ["∪", "or (union)"],
        ["′", "complement (not)"],
      ],
      [
        ["Q₁", "lower quartile"],
        ["Q₂", "median"],
        ["Q₃", "upper quartile"],
        ["≈", "approximately"],
        ["%", "percent"],
      ],
    ],
  },
  {
    id: "physics",
    label: "Physics & units",
    match: /physic|mechanic|kinematic|momentum|\bforces?\b|energy|motion|electric|wave|pressure|\bunits?\b|projectile|gravit|circuit|magnet|optic|\bheat\b|science/i,
    groups: [
      [
        [" m s⁻¹", "metres per second", "m s⁻¹"],
        [" m s⁻²", "metres per second squared", "m s⁻²"],
        [" kg", "kilograms", "kg"],
        [" N", "newtons", "N"],
        [" J", "joules", "J"],
        [" W", "watts", "W"],
        [" Pa", "pascals", "Pa"],
        [" N m⁻²", "newtons per square metre", "N m⁻²"],
        [" kg m⁻³", "density unit", "kg m⁻³"],
        [" Hz", "hertz", "Hz"],
      ],
      [
        [" V", "volts", "V"],
        [" A", "amperes", "A"],
        [" Ω", "ohms", "Ω"],
        [" C", "coulombs", "C"],
        [" K", "kelvin", "K"],
        ["°C", "degrees Celsius"],
        [" × 10", "times ten to the power (add a superscript)", "×10ⁿ"],
      ],
      [
        ["λ", "wavelength"],
        ["ν", "frequency (nu)"],
        ["ρ", "density"],
        ["μ", "coefficient of friction / micro"],
        ["ω", "angular velocity"],
        ["η", "efficiency"],
        ["Δ", "change in"],
        ["∝", "proportional to"],
        ["↑", "upwards"],
        ["↓", "downwards"],
        ["½mv²", "kinetic energy"],
        ["mgh", "potential energy"],
      ],
    ],
  },
  {
    id: "chemistry",
    label: "Chemistry",
    match: /chemi|reaction|acid|\bbases?\b|\bmoles?\b|organic|bond|electroly|equilibri|\bions?\b|oxid|redox|periodic|\bsalts?\b|alkan|science/i,
    groups: [
      [
        ["→", "reacts to give"],
        ["⇌", "reversible reaction"],
        ["↑", "gas given off"],
        ["↓", "precipitate"],
        ["Δ", "heat"],
        ["·", "water of crystallisation dot"],
        ["⦵", "standard state", "ΔH⦵"],
      ],
      SUBSCRIPTS.slice(0, 10),
      [
        ["⁺", "positive charge"],
        ["⁻", "negative charge"],
        ["²⁺", "2+ charge"],
        ["³⁺", "3+ charge"],
        ["²⁻", "2− charge"],
        ["³⁻", "3− charge"],
        ["e⁻", "electron"],
      ],
      [
        ["H₂O", "water"],
        ["CO₂", "carbon dioxide"],
        ["H⁺", "hydrogen ion"],
        ["OH⁻", "hydroxide ion"],
        ["(aq)", "aqueous"],
        ["(s)", "solid"],
        ["(l)", "liquid"],
        ["(g)", "gas"],
        [" mol dm⁻³", "concentration unit", "mol dm⁻³"],
      ],
    ],
  },
  {
    id: "biology",
    label: "Biology",
    match: /biolog|genetic|\bcells?\b|ecolog|heredit|evolution|organism|physiolog|agric|science/i,
    groups: [
      [
        ["♂", "male"],
        ["♀", "female"],
        ["×", "crossed with"],
        ["→", "leads to"],
        ["⇌", "reversible"],
        ["↑", "increase"],
        ["↓", "decrease"],
        ["F₁", "first filial generation"],
        ["F₂", "second filial generation"],
      ],
      [
        ["μm", "micrometres"],
        ["°C", "degrees Celsius"],
        ["O₂", "oxygen"],
        ["CO₂", "carbon dioxide"],
        ["H₂O", "water"],
        ["C₆H₁₂O₆", "glucose"],
      ],
    ],
  },
  {
    id: "computing",
    label: "Computing & logic",
    match: /comput|software|database|\bsql\b|network|security|programming|algorithm|\bit\b|information|\biot\b|internet|cyber|crypto|systems? admin|\bict\b|\binf\d|\bcsc\d/i,
    groups: [
      [
        ["→", "arrow / flows to"],
        ["←", "assignment arrow"],
        ["↔", "two-way"],
        ["⇒", "implies"],
        ["⇔", "if and only if"],
        ["≔", "is defined as"],
      ],
      [
        ["¬", "NOT"],
        ["∧", "AND"],
        ["∨", "OR"],
        ["⊕", "XOR"],
        ["≠", "not equal"],
        ["≡", "equivalent"],
        ["∈", "element of"],
        ["∅", "empty"],
      ],
      [
        ["O(n)", "linear time"],
        ["O(log n)", "logarithmic time"],
        ["O(n²)", "quadratic time"],
        ["log₂ ", "log base 2", "log₂"],
        ["2ⁿ", "two to the n"],
        ["⌊⌋", "floor", "⌊x⌋", 1],
        ["⌈⌉", "ceiling", "⌈x⌉", 1],
      ],
      [
        ["✓", "yes / tick"],
        ["✗", "no / cross"],
        ["•", "bullet"],
        ["◦", "sub-bullet"],
        ["…", "ellipsis"],
      ],
    ],
  },
  {
    id: "business",
    label: "Money & business",
    match: /econom|account|business|financ|management|commerce|marketing|\bmba\b|\bbus\d|\bcost|price|profit|\btax/i,
    groups: [
      [
        ["₵", "Ghana cedi"],
        ["$", "dollar"],
        ["£", "pound"],
        ["€", "euro"],
        ["¥", "yen"],
        ["₦", "naira"],
        ["%", "percent"],
        ["‰", "per thousand"],
      ],
      [
        ["↑", "rise"],
        ["↓", "fall"],
        ["→", "leads to"],
        ["Δ", "change in"],
        ["Σ", "total"],
        ["≈", "approximately"],
        ["•", "bullet"],
      ],
    ],
  },
  {
    id: "greek",
    label: "Greek letters",
    match: /math|physic|statistic|chemi|mechanic|calculus|trig|science/i,
    groups: [
      named("αβγδεζηθλμνπρστφχψω", "alpha beta gamma delta epsilon zeta eta theta lambda mu nu pi rho sigma tau phi chi psi omega"),
      named("ΓΔΘΛΣΦΨΩ", "gamma delta theta lambda sigma phi psi omega", "capital "),
    ],
  },
];

// Packs that fit the subjects, most specific first (tags come before course titles;
// on a tie the earlier pack wins, so general Greek letters sit last).
function suggest(subjects: Array<string>) {
  const ranked: Array<{ pack: Pack; at: number }> = [];
  for (const pack of PACKS) {
    const at = subjects.findIndex((s) => pack.match?.test(s));
    if (at >= 0) ranked.push({ pack, at });
  }
  return ranked.sort((a, b) => a.at - b.at).map((r) => r.pack);
}

export function SymbolPad({ subjects = [], onInsert, disabled }: { subjects?: Array<string>; onInsert: (s: SymbolInsert) => void; disabled?: boolean }) {
  const suggested = useMemo(() => suggest(subjects), [subjects]);
  const others = PACKS.filter((p) => !suggested.includes(p));
  const [active, setActive] = useState(suggested[0]?.id ?? "common");
  const [more, setMore] = useState(false);
  const pack = [COMMON, ...PACKS].find((p) => p.id === active) ?? COMMON;

  const tab = (p: Pack, hint?: boolean) => (
    <button
      key={p.id}
      type="button"
      onClick={() => setActive(p.id)}
      className={cn(
        "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition-colors",
        active === p.id ? "bg-primary text-white" : hint ? "bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200 hover:bg-indigo-100" : "bg-white text-primary ring-1 ring-border hover:bg-secondary",
      )}
      title={hint ? `Suggested for this question: ${p.label}` : p.label}
    >
      {hint && <span className={cn("size-1.5 rounded-full", active === p.id ? "bg-amber-300" : "bg-indigo-500")} aria-hidden="true" />}
      {p.label}
    </button>
  );

  return (
    <div className={cn("border-b bg-slate-50/80 px-3 py-2", disabled && "pointer-events-none")}>
      <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Symbol sets">
        {tab(COMMON)}
        {suggested.map((p) => tab(p, true))}
        {others.length > 0 && (
          <button
            type="button"
            onClick={() => setMore(!more)}
            className="flex items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-primary"
            aria-expanded={more}
          >
            More <ChevronDown className={cn("size-3.5 transition-transform", more && "rotate-180")} />
          </button>
        )}
      </div>
      {more && <div className="mt-1.5 flex flex-wrap gap-1.5">{others.map((p) => tab(p))}</div>}
      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        {pack.groups.map((group, gi) => (
          <div key={gi} className="flex flex-wrap gap-1">
            {group.map(([text, name, label, back]) => (
              <button
                key={`${text}-${name}`}
                type="button"
                // Keep the caret (and any selection) in the answer box.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onInsert({ text, back: back ?? 0 })}
                disabled={disabled}
                title={name}
                aria-label={`Insert ${name}`}
                className="grid h-8 min-w-8 place-items-center rounded-lg bg-white px-1.5 font-serif text-[15px] leading-none text-primary shadow-xs ring-1 ring-border transition hover:-translate-y-px hover:bg-indigo-50 hover:ring-indigo-300 active:translate-y-0 disabled:opacity-50"
              >
                {label ?? text}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
