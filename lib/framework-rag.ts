import {
  economicsSections,
  frameworkSections,
  politicsSections,
  startSection,
  topics,
} from "@/lib/content";
import type { ArgumentBlock, NavTopic, ReadingSection } from "@/lib/content";

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

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "like",
  "me",
  "my",
  "of",
  "on",
  "or",
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
};

export function retrieveFrameworkChunks(
  query: string,
  limit = 6,
): RetrievedFrameworkChunk[] {
  const queryTokens = expandTokens(query);

  return getFrameworkChunks()
    .map((chunk) => ({
      ...chunk,
      score: scoreChunk(chunk, queryTokens),
    }))
    .filter((chunk): chunk is RetrievedFrameworkChunk => (chunk.score ?? 0) > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function buildContext(chunks: FrameworkChunk[]) {
  return chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] ${chunk.source} / ${chunk.title}\n${chunk.text}`,
    )
    .join("\n\n---\n\n");
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

function getFrameworkChunks(): FrameworkChunk[] {
  const chunks: FrameworkChunk[] = [];

  pushSection(chunks, startSection, "Start Here");
  frameworkSections.forEach((section) => pushSection(chunks, section, section.label));
  topics.forEach((topic) => pushTopic(chunks, topic));
  politicsSections.forEach((section) => pushSection(chunks, section, `Politics / ${section.label}`));
  economicsSections.forEach((section) => pushSection(chunks, section, `Economics / ${section.label}`));

  return chunks;
}

function pushTopic(chunks: FrameworkChunk[], topic: NavTopic) {
  const source = topic.label;

  chunks.push({
    id: `${topic.id}:overview`,
    source,
    title: topic.title,
    text: [topic.intro, ...(topic.contentBlocks ?? []), ...(topic.afterLayers ?? [])]
      .filter(Boolean)
      .join("\n\n"),
  });

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
  chunks.push({
    id: `${section.id}:overview`,
    source,
    title: section.title,
    text: [section.intro, ...section.contentBlocks, ...section.keyIdeas]
      .filter(Boolean)
      .join("\n\n"),
  });

  section.arguments.forEach((argument) => {
    chunks.push(argumentToChunk(section, source, argument));
  });

  if (!essayOnlySectionIds.has(section.id)) {
    section.notes?.forEach((note) => {
      chunks.push({
        id: `${section.id}:note:${slug(note.title)}`,
        source,
        title: note.title,
        text: [note.body, note.items?.join("\n")].filter(Boolean).join("\n\n"),
      });
    });
  }
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

function scoreChunk(chunk: FrameworkChunk, queryTokens: string[]) {
  const haystack = tokenize(`${chunk.source} ${chunk.title} ${chunk.text}`);
  const counts = new Map<string, number>();
  haystack.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));

  return queryTokens.reduce((score, token) => {
    const titleBonus = tokenize(`${chunk.source} ${chunk.title}`).includes(token)
      ? 4
      : 0;
    return score + (counts.get(token) ?? 0) + titleBonus;
  }, 0);
}

function expandTokens(query: string) {
  const lowerQuery = query.toLowerCase();
  const tokens = tokenize(query);
  const extra = Object.entries(expansions).flatMap(([phrase, words]) =>
    lowerQuery.includes(phrase) ? words : [],
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
