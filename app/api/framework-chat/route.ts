import { NextResponse } from "next/server";
import {
  buildContext,
  buildLocalFallback,
  retrieveFrameworkChunks,
} from "@/lib/framework-rag";

type ChatRequest = {
  history?: {
    role: "user" | "assistant";
    text: string;
  }[];
  message?: string;
  summary?: string;
};

type ChatTurn = NonNullable<ChatRequest["history"]>[number];
type ChatIntent =
  | "navigation"
  | "exploration"
  | "pressure-test"
  | "synthesis"
  | "general";

const PROJECT_CONTEXT_BUDGET = 10_000;
const PROJECT_CONTEXT_CHUNK_BUDGET = 2_200;
const RECENT_HISTORY_BUDGET = 10_000;
const SUMMARY_TRIGGER_BUDGET = 18_000;
const SUMMARY_BUDGET = 3_000;
const MAX_USER_MESSAGE_CHARS = 20_000;
const MAX_RESPONSE_TOKENS = 1_400;
const MIN_FRAMEWORK_SCORE = 8;
const MIN_VISIBLE_SOURCE_SCORE = 10;
const OPENAI_RETRY_ATTEMPTS = 2;

const FRAMEWORK_SYSTEM_PROMPT = [
  "You are an assistant for a philosophy reading project.",
  "Framework Focus:",
  "Your job is not to defend the project at all costs. Your job is to apply its concepts carefully and honestly.",
  "Answer through the project's framework: measured, direct, epistemically cautious, and non-combative.",
  "Treat the framework as orientation, not a script. Retrieval should ground the answer, but the answer should still respond naturally to the user's actual message.",
  "Use the retrieved context as the source of truth for the project's ideas.",
  "Pronoun rule: when a user says 'you' in a philosophy, religion, morality, politics, meaning, certainty, or stance question, usually interpret 'you' as Daniel/the project's stance, not the AI assistant personally.",
  "Do not default to 'As an AI, I do not have beliefs' when the user is really asking about Daniel's view or the project's position. Answer from the project stance unless the user clearly asks about the AI itself.",
  "If needed, clarify briefly: 'If by you, you mean Daniel/the project, then...' but do not over-explain this distinction.",
  "Conversation role: users may read the project and argue with it as if they are arguing with Daniel. In those cases, respond as a discussion proxy for Daniel's stance, not as a detached chatbot summarizing content.",
  "When answering as Daniel/the project, use first-person sparingly when it is clearer: 'I would separate the claim...' or 'I am not saying that...' means Daniel/the project stance, not the AI's personal belief.",
  "For hostile or broad group claims about religions, ethnic groups, national groups, or political communities, do not mirror blanket blame. Separate specific evidence about institutions, curricula, leaders, propaganda, violence, or social patterns from claims about an entire people.",
  "If a user says something like 'Muslims brainwash their kids to hate Jews' or an equivalent broad claim, answer in the project voice: there may be real cases of indoctrination, antisemitism, anti-Muslim hatred, propaganda, or dehumanizing education worth criticizing, but the claim must be narrowed to specific contexts and evidence rather than turned into a total claim about all Muslims, Jews, or any whole group.",
  "Keep the stance clear: criticizing harmful teaching, propaganda, extremism, state policy, or group narratives is valid when supported; turning that into inherited guilt or essence claims about a whole population is exactly the kind of moral simplification the project warns about.",
  "Answer the user directly. Do not default to phrases like 'the project context suggests' or 'according to the project' unless the user asks where an idea comes from.",
  "If the user asks for a label, classification, or 'what is he/she/it' answer, give the closest label first, then the caveat. Do not make the user ask repeatedly before giving the label.",
  "If the user asks what Daniel/the project author is religiously, the closest standard label is agnostic. Start with 'Closest label: agnostic.' Then explain briefly that this is uncertainty/evidence-proportional caution, not hard atheism or commitment to a specific religion.",
  "If the user says 'this person who wrote all this,' 'the one who made this project,' or similar wording, interpret that as Daniel/the project author.",
  "Avoid repeatedly saying 'the framework' when a direct answer would be clearer.",
  "Use plain structural language. Avoid academic padding such as 'epistemic status,' 'responsible evaluation,' 'interlocutors,' or 'distinct evidential structures' unless the user uses that language first.",
  "Also avoid formal filler such as 'epistemically cautious,' 'claim content,' 'empirical events,' and 'standard frameworks' when plain wording works.",
  "Prefer short, dense answers. For most questions, 2-5 concise paragraphs is enough.",
  "For pressure-test answers, 3-4 short paragraphs is usually the target.",
  "Do not restate the same distinction multiple times. Once the core distinction is clear, stop.",
  "Do not add a final summary paragraph unless it adds a new distinction.",
  "Do not force a retrieved section onto the question if it only loosely fits. Use the closest project concept, then say the fit is partial if needed.",
  "Conversation intents:",
  "- general: answer ordinary questions normally without forcing project concepts or citations.",
  "- navigation: help the user find where ideas live in the project.",
  "- exploration: explain, deepen, or clarify an idea.",
  "- pressure-test: respond to critique, rhetorical pressure, or attempts to force a conclusion. Name the framing plainly, then answer without becoming defensive.",
  "- synthesis: connect ideas across sections or domains.",
  "For general messages, answer simply and do not mention the framework unless the user asks to connect the question back to it.",
  "For pressure-test messages, do not answer like a detached essay. Recognize the pressure in the wording, answer conversationally, and preserve the framework's distinction between questioning a claim and trying to disprove a whole belief system.",
  "If the user challenges whether the project itself is biased, AI-shaped, self-validating, or protecting skepticism, take that seriously. Do not dismiss it. Apply the same reinforcement critique back onto skepticism: skepticism can also become identity, self-protection, or moving-the-goalposts if it refuses any possible evidence.",
  "When users ask about religion, miracles, probability, testimony, or certainty, route the answer through the project's distinctions: plausibility vs. certainty, burden shifting, interpretation vs. discovery, collective conviction vs. verification, identity/stability reinforcement, and proportional certainty.",
  "Do not pretend certainty where the framework preserves uncertainty.",
  "Do not accept burden-shifting arguments as proof.",
  "Separate plausibility from certainty, conviction from verification, and usefulness from truth.",
  "If a user challenges the framework, evaluate the challenge directly. If it exposes a weakness or missing concept, acknowledge it.",
  "If the context does not cover the question well, say that clearly and suggest which concept would need to be added.",
  "Tone examples:",
  "Instead of: 'This raises an important epistemic issue.' Say: 'You cannot know that with certainty. That is the point.'",
  "Instead of: 'The framework does not intend to single out religious history.' Say: 'It would be special pleading if I used one standard for religion and another for everything else.'",
  "Instead of: 'This is epistemic nuance, not special pleading.' Say: 'The standard is not anti-religion. It is proportional: stronger claims need stronger support.'",
  "Instead of: 'I hear the frustration.' Say: 'That framing assumes questioning certainty is the same as trying to disprove religion.'",
  "For special pleading objections, use this structure: same standard both ways; ordinary historical claim vs supernatural interpretation; stronger claim needs stronger support.",
].join("\n");

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ChatRequest;
  const message = body.message?.trim();
  const history = sanitizeHistory(body.history ?? []);
  const summary = body.summary?.trim() ?? "";

  if (!message) {
    return NextResponse.json(
      { error: "Ask a question first." },
      { status: 400 },
    );
  }

  if (message.length > MAX_USER_MESSAGE_CHARS) {
    return NextResponse.json(
      {
        error:
          "That message is too long for this chat. Try sending a smaller section or splitting it into parts.",
      },
      { status: 413 },
    );
  }

  const retrievalQuery = buildRetrievalQuery(message, history);
  const chunks = retrieveFrameworkChunks(retrievalQuery, 4);
  const intent = detectIntent(message, chunks[0]?.score ?? 0);
  const isFrameworkGrounded = intent !== "general";
  const context = isFrameworkGrounded
    ? trimToBudget(
        buildContext(chunks, PROJECT_CONTEXT_CHUNK_BUDGET),
        PROJECT_CONTEXT_BUDGET,
      )
    : "";
  const recentHistory = selectRecentHistory(history, RECENT_HISTORY_BUDGET);
  const sources = isFrameworkGrounded
    ? selectVisibleSources(chunks).map((chunk) => ({
        id: chunk.id,
        source: chunk.source,
        title: chunk.title,
      }))
    : [];

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      answer: isFrameworkGrounded
        ? buildLocalFallback(message, chunks)
        : "That looks outside the project framework. Add an API key to answer general questions here.",
      mode: isFrameworkGrounded ? "retrieval-only" : "general",
      sources,
      summary,
    });
  }

  let modelRequestFailed = false;
  const answer = await answerWithOpenAI({
    context,
    history: recentHistory,
    intent,
    message,
    summary,
  }).catch((error: Error) => {
    modelRequestFailed = true;
    return formatModelFailureMessage(error);
  });

  const updatedSummary = modelRequestFailed
    ? summary
    : await maybeUpdateSummary({
        answer,
        history,
        message,
        summary,
      });

  return NextResponse.json({
    answer,
    intent,
    mode: isFrameworkGrounded ? "rag" : "general",
    sources,
    summary: updatedSummary,
  });
}

async function answerWithOpenAI({
  context,
  history,
  intent,
  message,
  summary,
}: {
  context: string;
  history: ChatTurn[];
  intent: ChatIntent;
  message: string;
  summary: string;
}) {
  const response = await fetchOpenAIWithRetry({
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      max_output_tokens: MAX_RESPONSE_TOKENS,
      input: [
        {
          role: "system",
          content: FRAMEWORK_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            `Conversation intent: ${intent}`,
            "Retrieved project context:",
            context || "No strong matching context was found.",
            summary ? `Conversation summary:\n${summary}` : "",
            history.length
              ? `Recent conversation:\n${formatHistory(history)}`
              : "",
            `Current user message:\n${message}`,
          ].join("\n\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(parseOpenAIError(detail));
  }

  const data = (await response.json()) as {
    output_text?: string;
    output?: {
      content?: { text?: string }[];
    }[];
  };

  return (
    data.output_text ??
    data.output?.flatMap((item) => item.content ?? [])
      .map((item) => item.text)
      .filter(Boolean)
      .join("\n") ??
    "I could not generate an answer from the retrieved context."
  );
}

async function fetchOpenAIWithRetry(
  init: RequestInit,
  attempts = OPENAI_RETRY_ATTEMPTS,
) {
  let response = await fetch("https://api.openai.com/v1/responses", init);

  for (let attempt = 1; attempt < attempts && shouldRetryOpenAIResponse(response); attempt += 1) {
    await sleep(450 * attempt);
    response = await fetch("https://api.openai.com/v1/responses", init);
  }

  return response;
}

function shouldRetryOpenAIResponse(response: Response) {
  return response.status === 429 || response.status >= 500;
}

function parseOpenAIError(detail: string) {
  if (!detail) {
    return "The model request failed.";
  }

  try {
    const parsed = JSON.parse(detail) as {
      error?: { code?: string | null; message?: string; type?: string };
    };
    const message = parsed.error?.message?.trim();
    const code = parsed.error?.code ?? parsed.error?.type;
    return [message, code ? `Code: ${code}` : ""].filter(Boolean).join("\n");
  } catch {
    return detail;
  }
}

function formatModelFailureMessage(error: Error) {
  return [
    "I found relevant project sections, but the model request failed before it could write an answer.",
    "",
    "This is usually temporary. Try again in a moment. I also tightened the chat so future requests send less context and retry once before showing this message.",
    "",
    error.message ? `Error: ${error.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function maybeUpdateSummary({
  answer,
  history,
  message,
  summary,
}: {
  answer: string;
  history: ChatTurn[];
  message: string;
  summary: string;
}) {
  const fullConversation = [
    ...history,
    { role: "user" as const, text: message },
    { role: "assistant" as const, text: answer },
  ];

  if (estimateTokens(formatHistory(fullConversation) + summary) < SUMMARY_TRIGGER_BUDGET) {
    return summary;
  }

  if (!process.env.OPENAI_API_KEY) {
    return summary;
  }

  const olderHistory = fullConversation.slice(0, Math.max(0, fullConversation.length - 8));
  if (!olderHistory.length) {
    return summary;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Summarize older chat context for a philosophy project assistant. Preserve the user's active question, unresolved tensions, assumptions already discussed, and any stance constraints. Keep it compact. Do not add new ideas.",
        },
        {
          role: "user",
          content: [
            summary ? `Existing summary:\n${summary}` : "",
            `Older conversation to compress:\n${formatHistory(olderHistory)}`,
          ].join("\n\n"),
        },
      ],
    }),
  }).catch(() => null);

  if (!response?.ok) {
    return summary;
  }

  const data = (await response.json()) as { output_text?: string };
  return trimToBudget(data.output_text?.trim() ?? summary, SUMMARY_BUDGET);
}

function sanitizeHistory(history: ChatTurn[]) {
  return history
    .filter((turn) => turn.role === "user" || turn.role === "assistant")
    .map((turn) => ({
      role: turn.role,
      text: trimToBudget(turn.text ?? "", 4_000),
    }))
    .filter((turn) => turn.text.trim().length > 0);
}

function selectRecentHistory(history: ChatTurn[], budget: number) {
  const selected: ChatTurn[] = [];
  let used = 0;

  for (const turn of history.toReversed()) {
    const cost = estimateTokens(turn.text);
    if (used + cost > budget) {
      break;
    }
    selected.unshift(turn);
    used += cost;
  }

  return selected;
}

function buildRetrievalQuery(message: string, history: ChatTurn[]) {
  const recentUserContext = history
    .filter((turn) => turn.role === "user")
    .slice(-3)
    .map((turn) => turn.text)
    .join("\n\n");

  return trimToBudget(
    [recentUserContext, `Current user message: ${message}`]
      .filter(Boolean)
      .join("\n\n"),
    2_500,
  );
}

function formatHistory(history: ChatTurn[]) {
  return history
    .map((turn) => `${turn.role === "user" ? "User" : "Assistant"}: ${turn.text}`)
    .join("\n\n");
}

function trimToBudget(text: string, budget: number) {
  if (estimateTokens(text) <= budget) {
    return text;
  }

  return text.slice(0, budget * 4);
}

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

function selectVisibleSources<T extends { id: string; score: number }>(chunks: T[]) {
  const topScore = chunks[0]?.score ?? 0;
  const seenSections = new Set<string>();

  return chunks
    .filter((chunk) => {
      const sectionId = chunk.id.split(":")[0];
      if (seenSections.has(sectionId)) {
        return false;
      }
      if (chunk.score < MIN_VISIBLE_SOURCE_SCORE) {
        return false;
      }
      if (topScore >= MIN_VISIBLE_SOURCE_SCORE && chunk.score < topScore * 0.45) {
        return false;
      }
      seenSections.add(sectionId);
      return true;
    })
    .slice(0, 3);
}

function detectIntent(message: string, topScore: number): ChatIntent {
  const text = message.toLowerCase();

  if (looksLikeGeneralInfoQuestion(text) && !asksForFrameworkLens(text)) {
    return "general";
  }

  if (
    /\b(where|which section|what part|find|source|reference|did i add|covered)\b/.test(
      text,
    )
  ) {
    return "navigation";
  }

  if (
    /\b(connect|relate|compare|bridge|across|apply this to|how does .* fit)\b/.test(
      text,
    )
  ) {
    return "synthesis";
  }

  if (
    /\b(imagine|admit|avoid|cope|running|nitpick|disprove|trying this hard|what else could|so you just|you are just|you're just|refusing|obvious)\b/.test(
      text,
    )
  ) {
    return "pressure-test";
  }

  if (topScore < MIN_FRAMEWORK_SCORE && looksGeneral(text)) {
    return "general";
  }

  return "exploration";
}

function looksGeneral(text: string) {
  const frameworkWords =
    /\b(belief|certainty|proof|evidence|identity|framework|project|argument|truth|meaning|interpretation|skeptic|skeptical|atheism|sinai|miracle|prophecy|plausibility|convergence|deconstruction|stance)\b/;

  if (frameworkWords.test(text)) {
    return false;
  }

  return (
    /\b(most popular|best|recommend|flavors?|food|drink|tea|coffee|movie|music|song|weather|recipe|restaurant|travel|workout|game)\b/.test(
      text,
    ) || text.split(/\s+/).length < 12
  );
}

function looksLikeGeneralInfoQuestion(text: string) {
  return /\b(what are|what is|who is|when did|where is|list|give me|tell me|most popular|best|recommend|examples of)\b/.test(
    text,
  ) && /\b(food|foods|tea|coffee|drink|flavors?|movie|music|weather|restaurant|travel|recipe|history of|basic|overview)\b/.test(
    text,
  );
}

function asksForFrameworkLens(text: string) {
  return /\b(project|framework|your lens|through this lens|my ideas|belief|certainty|proof|evidence|identity|interpretation|argument|deconstruct|stance|how does .* connect|how does .* relate|apply this)\b/.test(
    text,
  );
}
