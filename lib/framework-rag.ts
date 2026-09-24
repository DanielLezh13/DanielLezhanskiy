import {
  economicsSections,
  frameworkSections,
  philosophySections,
  politicsAnalysisSections,
  politicsSections,
  startSection,
  topics,
} from "@/lib/content";
import type { ArgumentBlock, NavTopic, ReadingSection } from "@/lib/content";
import { isSectionInProgress } from "@/lib/publication-status";

export type FrameworkChunk = {
  id: string;
  source: string;
  title: string;
  text: string;
  score?: number;
};

export type RetrievedFrameworkChunk = FrameworkChunk & {
  score: number;
};

export function hasStrongTitleMatch(query: string, chunk: Pick<FrameworkChunk, "source" | "title">) {
  const terms = new Set(tokenize(query));
  const titleTerms = new Set(tokenize(`${chunk.source} ${chunk.title}`));
  if (!terms.size) return false;
  const matches = [...terms].filter((term) => titleTerms.has(term)).length;
  return matches / terms.size >= 0.5;
}

export function getPublicSectionContext(id: string) {
  if (!id || isSectionInProgress(id)) return null;
  const chunk = getFrameworkChunks().find((item) => item.id.startsWith(`${id}:`));
  return chunk ? `${chunk.source} / ${chunk.title}` : null;
}

const stopWords = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "daniel",
  "do",
  "does",
  "explicitly",
  "for",
  "from",
  "how",
  "had",
  "has",
  "have",
  "i",
  "if",
  "in",
  "is",
  "it",
  "like",
  "me",
  "many",
  "my",
  "of",
  "on",
  "or",
  "part",
  "project",
  "say",
  "says",
  "section",
  "so",
  "that",
  "the",
  "their",
  "this",
  "to",
  "what",
  "when",
  "why",
  "with",
  "you",
  "your",
]);

const expansions: Record<string, string[]> = {
  sinai: ["judaism", "collective", "revelation", "inherited", "certainty"],
  "mount sinai": ["judaism", "collective", "revelation", "inherited"],
  resurrection: ["christianity", "testimony", "miracle", "certainty"],
  "code 19": ["convergence", "mathematical", "patterns", "search", "certainty"],
  miracle: ["revelation", "prophecy", "certainty", "interpretation"],
  miracles: ["revelation", "prophecy", "certainty", "interpretation"],
  "what else": ["burden", "proof", "alternative", "explanation", "certainty"],
  "special pleading": [
    "historical",
    "evidence",
    "supernatural",
    "interpretation",
    "testimony",
    "sinai",
    "transmission",
    "direct",
    "access",
  ],
  "religious history": [
    "historical",
    "evidence",
    "supernatural",
    "interpretation",
    "testimony",
    "sinai",
    "transmission",
  ],
  "ancient wars": [
    "historical",
    "evidence",
    "supernatural",
    "interpretation",
    "testimony",
    "sinai",
  ],
  "can't explain": ["alternative", "explanation", "certainty", "plausibility"],
  "cant explain": ["alternative", "explanation", "certainty", "plausibility"],
  "hard to explain": ["alternative", "explanation", "certainty", "plausibility"],
  certainty: ["threshold", "plausibility", "convergence", "evidence"],
  convincing: ["plausibility", "certainty", "reinforcement"],
  emotional: ["identity", "stability", "defense", "belonging"],
  defend: ["identity", "stability", "defense", "belief"],
  side: ["position", "alignment", "tribal", "certainty"],
  sides: ["position", "alignment", "tribal", "certainty"],
  "same reality": [
    "competing",
    "claims",
    "religion",
    "authority",
    "history",
    "truth",
  ],
  "same prophets": [
    "competing",
    "claims",
    "religion",
    "authority",
    "history",
    "truth",
  ],
  "same figures": [
    "competing",
    "claims",
    "religion",
    "authority",
    "history",
    "truth",
  ],
  "sacred history": [
    "competing",
    "claims",
    "religion",
    "authority",
    "history",
    "truth",
  ],
  "holy sites": [
    "competing",
    "claims",
    "religion",
    "authority",
    "history",
    "politics",
  ],
  "false authority": [
    "competing",
    "claims",
    "religion",
    "authority",
    "legitimacy",
    "truth",
  ],
  "religious conflict": [
    "competing",
    "claims",
    "religion",
    "authority",
    "identity",
    "politics",
  ],
  ai: ["modern", "reinforcement", "framing", "certainty"],
  "ai reinforcement": ["modern", "reinforcement", "framing", "certainty"],
  "self validation": ["reinforcement", "identity", "skepticism", "certainty"],
  "self validating": ["reinforcement", "identity", "skepticism", "certainty"],
  "self reinforce": ["reinforcement", "identity", "skepticism", "certainty"],
  "misguided": ["reinforcement", "skepticism", "certainty", "ai"],
  "misdirected": ["reinforcement", "skepticism", "certainty", "ai"],
  "skeptic belief": ["skepticism", "identity", "reinforcement", "certainty"],
  "skeptical belief": ["skepticism", "identity", "reinforcement", "certainty"],
  "want to sin": [
    "disagreement",
    "moral",
    "diagnosis",
    "disbelief",
    "rebellion",
    "spiritual",
  ],
  "you just want to sin": [
    "disagreement",
    "moral",
    "diagnosis",
    "disbelief",
    "rebellion",
    "spiritual",
  ],
  "spiritual blindness": [
    "disagreement",
    "moral",
    "diagnosis",
    "disbelief",
    "rebellion",
  ],
  "resistance to god": [
    "disagreement",
    "moral",
    "diagnosis",
    "disbelief",
    "rebellion",
  ],
  "refusal to submit": [
    "disagreement",
    "moral",
    "diagnosis",
    "disbelief",
    "spiritual",
  ],
  "suppression of truth": [
    "disagreement",
    "moral",
    "diagnosis",
    "disbelief",
    "rebellion",
  ],
  "moral asymmetry": [
    "disagreement",
    "moral",
    "diagnosis",
    "belief",
    "nonbeliever",
  ],
  "spiritual asymmetry": [
    "disagreement",
    "spiritual",
    "diagnosis",
    "belief",
    "nonbeliever",
  ],
  "conversion urgency": [
    "disagreement",
    "spiritual",
    "salvation",
    "belief",
    "nonbeliever",
  ],
  "concern for souls": [
    "disagreement",
    "spiritual",
    "salvation",
    "belief",
    "nonbeliever",
  ],
  "religious stance": ["religion", "agnostic", "atheist", "belief", "label"],
  "religious beliefs": ["religion", "agnostic", "atheist", "belief", "label"],
  "one word": ["label", "classification", "stance"],
  "what is he": ["daniel", "profile", "religion", "agnostic", "label"],
  "what is his stance": ["daniel", "profile", "religion", "agnostic", "stance"],
};

export function retrieveFrameworkChunks(
  query: string,
  limit = 6,
): RetrievedFrameworkChunk[] {
  const queryTokens = expandTokens(query);

  const ranked = getFrameworkChunks()
    .map((chunk) => ({
      ...chunk,
      score: scoreChunk(chunk, queryTokens, query),
    }))
    .filter((chunk): chunk is RetrievedFrameworkChunk => (chunk.score ?? 0) > 0)
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  if (top && hasStrongTitleMatch(query, top)) {
    const sectionId = top.id.split(":")[0];
    const summary = ranked.find((chunk) => chunk.id.startsWith(`${sectionId}:summary:`));
    if (summary) return [summary, ...ranked.filter((chunk) => chunk.id !== summary.id)].slice(0, limit);
  }

  return ranked.slice(0, limit);
}

export function buildContext(chunks: FrameworkChunk[], perChunkBudget = 2_200) {
  return chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] ${chunk.source} / ${chunk.title}\n${trimToApproxTokenBudget(chunk.text, perChunkBudget)}`,
    )
    .join("\n\n---\n\n");
}

function trimToApproxTokenBudget(text: string, budget: number) {
  if (Math.ceil(text.length / 4) <= budget) {
    return text;
  }

  return `${text.slice(0, budget * 4).trim()}\n\n[Context trimmed for length.]`;
}

export function buildLocalFallback(query: string, chunks: FrameworkChunk[]) {
  if (!chunks.length) {
    return [
      "I could not find a strong match in the current framework yet.",
      "",
      "A useful next step would be adding a section that directly covers this question, then the assistant can retrieve it later.",
    ].join("\n");
  }

  const sourceList = chunks
    .slice(0, 3)
    .map((chunk) => `- ${chunk.source}: ${chunk.title}`)
    .join("\n");

  return [
    "I found the closest parts of the framework, but no API key is configured yet, so this is retrieval-only mode.",
    "",
    `Question: ${query}`,
    "",
    "Relevant sections:",
    sourceList,
    "",
    "To turn this into a real answer, add `OPENAI_API_KEY` to `.env.local` and restart the app.",
  ].join("\n");
}

let cachedChunks: FrameworkChunk[] | undefined;

function getFrameworkChunks(): FrameworkChunk[] {
  if (cachedChunks) return cachedChunks;
  const chunks: FrameworkChunk[] = [];

  pushDanielProfile(chunks);
  pushSection(chunks, startSection, "Start Here");
  frameworkSections.forEach((section) => pushSection(chunks, section, section.label));
  topics.forEach((topic) => pushTopic(chunks, topic));
  politicsSections.forEach((section) => pushSection(chunks, section, `Politics / ${section.label}`));
  politicsAnalysisSections.forEach((section) => pushSection(chunks, section, `Politics / Political Analysis / ${section.label}`));
  economicsSections.forEach((section) => pushSection(chunks, section, `Economics / ${section.label}`));
  philosophySections.forEach((section) => pushSection(chunks, section, `Philosophy / ${section.label}`));

  cachedChunks = chunks;
  return cachedChunks;
}

function pushDanielProfile(chunks: FrameworkChunk[]) {
  chunks.push({
    id: "daniel-profile:overview",
    source: "Start Here",
    title: "Daniel Profile",
    text: [
      "Daniel is the creator and author of this project.",
      "Profile fact: Religion: Agnostic.",
      "If a user asks for Daniel's religious stance as a one-word or standard label, the closest label is agnostic.",
      "That does not mean hard atheist or committed to a specific religion. It means Daniel's project holds religious claims with uncertainty, evidence-proportional caution, and resistance to premature certainty.",
      "If asked what Daniel is religiously, answer the label first: closest label: agnostic. Then explain briefly if needed.",
    ].join("\n\n"),
  });
}

function pushTopic(chunks: FrameworkChunk[], topic: NavTopic) {
  const source = topic.label;

  pushText(chunks, `${topic.id}:overview`, source, topic.title, topic.intro);
  [...(topic.contentBlocks ?? []), ...(topic.afterLayers ?? [])].forEach((block, index) =>
    pushText(chunks, `${topic.id}:body:${index}`, source, topic.title, block),
  );

  topic.layers?.forEach((layer) => {
    chunks.push({
      id: `${topic.id}:layer:${slug(layer.title)}`,
      source,
      title: layer.title,
      text: [layer.description, layer.examples.join(", "), layer.note]
        .filter(Boolean)
        .join("\n\n"),
    });
  });

  topic.argumentPatternGroups?.forEach((group) => {
    group.patterns.forEach((pattern) => {
      chunks.push({
        id: `${topic.id}:pattern:${slug(group.title)}:${slug(pattern.title)}`,
        source: `${source} / ${group.title}`,
        title: pattern.title,
        text: [
          `Claim: ${pattern.claim}`,
          `Issue: ${pattern.issue}`,
          `Takeaway: ${pattern.takeaway}`,
        ].join("\n"),
      });
    });
  });

  topic.children?.forEach((section) =>
    pushSection(chunks, section, `${source} / ${section.label}`),
  );
}

function pushSection(
  chunks: FrameworkChunk[],
  section: ReadingSection,
  source: string,
) {
  if (isSectionInProgress(section.id)) return;
  if (section.frameworkSummary) {
    pushText(chunks, `${section.id}:summary`, source, section.title, section.frameworkSummary);
  }
  pushText(
    chunks,
    `${section.id}:overview`,
    source,
    section.title,
    [section.intro, ...section.keyIdeas].filter(Boolean).join("\n\n"),
  );
  section.contentBlocks.forEach((block, index) =>
    pushText(chunks, `${section.id}:body:${index}`, source, section.title, block),
  );

  section.arguments.forEach((argument) => {
    pushChunk(chunks, argumentToChunk(section, source, argument));
  });

  section.politicalArgumentCards?.forEach((card, index) =>
    pushText(
      chunks,
      `${section.id}:political-card:${index}`,
      source,
      card.title,
      [
        ...card.claim,
        ...card.counterargument,
        ...card.analysis,
        ...(card.analysisAfterQuestions ?? []),
        card.underlyingDisagreement,
      ].join("\n\n"),
    ),
  );

  if (!essayOnlySectionIds.has(section.id)) {
    section.notes?.forEach((note) => {
      pushChunk(chunks, {
        id: `${section.id}:note:${slug(note.title)}`,
        source,
        title: note.title,
        text: [note.body, note.items?.join("\n")].filter(Boolean).join("\n\n"),
      });
    });
  }
}

function pushText(chunks: FrameworkChunk[], id: string, source: string, title: string, text: string) {
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  let part = "";
  let index = 0;
  const flush = () => {
    if (part.trim()) chunks.push({ id: `${id}:${index++}`, source, title, text: part.trim() });
    part = "";
  };

  for (const paragraph of paragraphs) {
    if (part.length + paragraph.length > 3000) flush();
    if (paragraph.length <= 3000) {
      part += `${part ? "\n\n" : ""}${paragraph}`;
    } else {
      for (let offset = 0; offset < paragraph.length; offset += 2800) {
        chunks.push({ id: `${id}:${index++}`, source, title, text: paragraph.slice(offset, offset + 3000) });
      }
    }
  }
  flush();
}

function pushChunk(chunks: FrameworkChunk[], chunk: FrameworkChunk) {
  pushText(chunks, chunk.id, chunk.source, chunk.title, chunk.text);
}

const essayOnlySectionIds = new Set([
  "philosophy-metaphysics",
  "philosophy-epistemology",
  "philosophy-ethics",
  "philosophy-political-philosophy",
  "philosophy-existentialism",
  "philosophy-nihilism",
  "philosophy-stoicism",
  "philosophy-utilitarianism",
  "philosophy-postmodernism",
]);

function argumentToChunk(
  section: ReadingSection,
  source: string,
  argument: ArgumentBlock,
): FrameworkChunk {
  return {
    id: `${section.id}:argument:${slug(argument.title)}`,
    source,
    title: argument.title,
    text: [`Claim: ${argument.claim}`, `Deconstruction: ${argument.response}`].join(
      "\n",
    ),
  };
}

function scoreChunk(chunk: FrameworkChunk, queryTokens: string[], query: string) {
  const haystack = tokenize(`${chunk.source} ${chunk.title} ${chunk.text}`);
  const counts = new Map<string, number>();
  haystack.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
  const primary = new Set(tokenize(query));
  const titleTokens = new Set(tokenize(`${chunk.source} ${chunk.title}`));
  const primaryHits = [...primary].filter((token) => counts.has(token)).length;
  const boost = contextualBoost(chunk, query);
  if (primaryHits === 0 && boost === 0) return 0;

  const baseScore = queryTokens.reduce((score, token) => {
    const direct = primary.has(token);
    const weight = direct ? 3 : 0.4;
    const titleBonus = titleTokens.has(token) ? (direct ? 8 : 0.8) : 0;
    return score + Math.min(counts.get(token) ?? 0, 2) * weight + titleBonus;
  }, 0);

  const overviewBonus = primaryHits > 0 && chunk.id.includes(":overview:") ? 4 : 0;
  const coverage = primary.size ? primaryHits / primary.size : 0;
  const summaryBonus = chunk.id.includes(":summary:") && hasStrongTitleMatch(query, chunk) ? 20 : 0;
  return (baseScore + overviewBonus) * coverage * coverage
    * Math.min(1, 900 / Math.max(450, chunk.text.length)) + boost + summaryBonus;
}

function contextualBoost(chunk: FrameworkChunk, query: string) {
  const text = query.toLowerCase();
  const source = `${chunk.id} ${chunk.source} ${chunk.title}`.toLowerCase();
  const asksDanielStance =
    /\b(daniel|author|creator|person who wrote|wrote all this|made this project|his stance|what is he)\b/.test(text) &&
    /\b(religion|religious|belief|stance|agnostic|atheist|spiritual|jewish|muslim|christian|orthodox|label)\b/.test(text);
  const asksReligionLabel =
    /\b(religion|religious|agnostic|atheist|spiritual|jewish|muslim|christian|orthodox)\b/.test(text) &&
    /\b(label|one word|what is|what would|stance|beliefs?|options?)\b/.test(text);

  if (!asksDanielStance && !asksReligionLabel) {
    return 0;
  }

  if (source.includes("daniel-profile")) {
    return 80;
  }

  if (source.includes("religion") || source.includes("belief")) {
    return 28;
  }

  if (source.includes("philosophy") && source.includes("epistemology")) {
    return 12;
  }

  if (source.includes("economics") || source.includes("politics")) {
    return -30;
  }

  return 0;
}

function expandTokens(query: string) {
  const lowerQuery = ` ${query.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
  const tokens = tokenize(query);
  const extra = Object.entries(expansions).flatMap(([phrase, words]) =>
    lowerQuery.includes(` ${phrase} `) ? words : [],
  );

  return [...new Set([...tokens, ...extra])];
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function slug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
