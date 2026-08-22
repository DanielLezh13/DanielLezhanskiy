import {
  economicsSections,
  frameworkSections,
  politicsAnalysisSections,
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
  daniel: ["profile", "creator", "author", "stance", "agnostic"],
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

  return getFrameworkChunks()
    .map((chunk) => ({
      ...chunk,
      score: scoreChunk(chunk, queryTokens, query),
    }))
    .filter((chunk): chunk is RetrievedFrameworkChunk => (chunk.score ?? 0) > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
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

function getFrameworkChunks(): FrameworkChunk[] {
  const chunks: FrameworkChunk[] = [];

  pushDanielProfile(chunks);
  pushSection(chunks, startSection, "Start Here");
  frameworkSections.forEach((section) => pushSection(chunks, section, section.label));
  topics.forEach((topic) => pushTopic(chunks, topic));
  politicsSections.forEach((section) => pushSection(chunks, section, `Politics / ${section.label}`));
  politicsAnalysisSections.forEach((section) => pushSection(chunks, section, `Politics / Political Analysis / ${section.label}`));
  economicsSections.forEach((section) => pushSection(chunks, section, `Economics / ${section.label}`));

  return chunks;
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

function scoreChunk(chunk: FrameworkChunk, queryTokens: string[], query: string) {
  const haystack = tokenize(`${chunk.source} ${chunk.title} ${chunk.text}`);
  const counts = new Map<string, number>();
  haystack.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));

  const baseScore = queryTokens.reduce((score, token) => {
    const titleBonus = tokenize(`${chunk.source} ${chunk.title}`).includes(token)
      ? 4
      : 0;
    return score + (counts.get(token) ?? 0) + titleBonus;
  }, 0);

  return baseScore + contextualBoost(chunk, query);
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
