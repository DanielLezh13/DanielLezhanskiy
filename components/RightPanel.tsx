"use client";

import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type RightPanelProps = {
  chatState: RightPanelChatState;
  ideas: string[];
  contextLabel: string;
  danielDisplayMode: "classic" | "immersive";
  onDanielDisplayModeChange: (mode: "classic" | "immersive") => void;
  showDanielDisplayToggle: boolean;
};

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  variant?: "error";
  sources?: { source: string; title: string; id?: string }[];
};

export type RightPanelChatState = {
  input: string;
  isLoading: boolean;
  messages: ChatMessage[];
  setInput: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setShowIdeas: Dispatch<SetStateAction<boolean>>;
  setSummary: Dispatch<SetStateAction<string>>;
  showIdeas: boolean;
  summary: string;
};

export function RightPanel({
  chatState,
  contextLabel,
  danielDisplayMode,
  ideas,
  onDanielDisplayModeChange,
  showDanielDisplayToggle,
}: RightPanelProps) {
  const {
    input,
    isLoading,
    messages,
    setInput,
    setIsLoading,
    setMessages,
    setShowIdeas,
    setSummary,
    showIdeas,
    summary,
  } = chatState;
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);
  const scrollPanelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const latestUserMessageRef = useRef<HTMLDivElement | null>(null);
  const bottomSpacerRef = useRef<HTMLDivElement | null>(null);
  const hasConversation = messages.length > 0;

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    requestAnimationFrame(() => {
      const panel = scrollPanelRef.current;
      const message = latestUserMessageRef.current;
      const spacer = bottomSpacerRef.current;

      if (!panel || !message) {
        return;
      }

      const panelRect = panel.getBoundingClientRect();
      const messageRect = message.getBoundingClientRect();
      const currentSpacerHeight = spacer?.getBoundingClientRect().height ?? 0;
      const latestContentBottom =
        spacer?.previousElementSibling?.getBoundingClientRect().bottom ??
        messageRect.bottom;
      const latestExchangeHeight = Math.max(
        messageRect.height,
        latestContentBottom - messageRect.top,
      );
      const messageGap = 10;
      const contentHeightWithoutSpacer = panel.scrollHeight - currentSpacerHeight;
      const targetTop = panel.scrollTop + messageRect.top - panelRect.top - messageGap;
      const shouldAnchorLatestMessage =
        messages.length > 2 || latestExchangeHeight > panelRect.height * 0.62;
      const nextSpacerHeight = shouldAnchorLatestMessage
        ? Math.max(0, targetTop + panelRect.height - contentHeightWithoutSpacer + messageGap)
        : 0;

      setBottomSpacerHeight(nextSpacerHeight);
      if (spacer) {
        spacer.style.height = `${nextSpacerHeight}px`;
      }

      requestAnimationFrame(() => {
        panel.scrollTo({
          behavior: messages.at(-1)?.role === "user" ? "smooth" : "auto",
          top: shouldAnchorLatestMessage ? targetTop : panel.scrollHeight,
        });
      });
    });
  }, [isLoading, messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();
    if (!question || isLoading) {
      return;
    }

    setInput("");
    resetTextareaHeight();
    setIsLoading(true);
    setMessages((current) => [...current, { role: "user", text: question }]);

    try {
      const response = await fetch("/api/framework-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages.map((message) => ({
            role: message.role,
            text: message.text,
          })),
          message: question,
          summary,
        }),
      });

      const data = (await response.json()) as {
        answer?: string;
        error?: string;
        sources?: { source: string; title: string; id?: string }[];
        summary?: string;
      };

      if (typeof data.summary === "string") {
        setSummary(data.summary);
      }

      const hasRequestError = !response.ok || typeof data.error === "string";
      const replyText = formatAssistantReply({
        answer: data.answer,
        error: data.error,
        responseOk: response.ok,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: replyText,
          sources: hasRequestError ? undefined : data.sources,
          variant: hasRequestError ? "error" : undefined,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "The framework chat could not connect. Check that the local app server is still running, then try again.",
          variant: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(value: string) {
    setInput(value);
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 176)}px`;
    });
  }

  function resetTextareaHeight() {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "";
      }
    });
  }

  return (
    <aside className="flex h-full min-h-0 overscroll-contain">
      <div className="flex min-h-0 flex-1 flex-col px-6 py-7">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 pb-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
            Engage With My Ideas
          </p>
          {showDanielDisplayToggle ? (
            <div
              aria-label="Daniel page display"
              className="inline-flex shrink-0 rounded border border-amber-200/20 bg-amber-100/[0.045] p-0.5 shadow-[0_0_18px_rgba(253,230,138,0.1)]"
              role="group"
            >
              {(["classic", "immersive"] as const).map((mode) => {
                const isActive = danielDisplayMode === mode;

                return (
                  <button
                    aria-pressed={isActive}
                    className={[
                      "rounded-sm px-1.5 py-1 font-mono text-[8px] uppercase tracking-[0.08em] transition",
                      isActive
                        ? "bg-amber-100 text-[#11110f] shadow-[0_0_12px_rgba(253,230,138,0.22)]"
                        : "text-stone-500 hover:bg-white/[0.045] hover:text-stone-200",
                    ].join(" ")}
                    key={mode}
                    onClick={() => onDanielDisplayModeChange(mode)}
                    title={mode === "classic" ? "Classic view" : "Immersive view"}
                    type="button"
                  >
                    {mode === "classic" ? "C" : "I"}
                  </button>
                );
              })}
            </div>
          ) : null}
        </header>

        <div className="relative min-h-0 flex-1">
          <div
            className="h-full overflow-y-auto overscroll-contain pb-5 pt-2.5"
            ref={scrollPanelRef}
          >
            <div
              className={[
                "min-h-full transition duration-300 ease-out",
                hasConversation ? "flex flex-col justify-end gap-2.5" : "",
                showIdeas && hasConversation
                  ? "pointer-events-none scale-[0.99] opacity-0"
                  : "scale-100 opacity-100",
              ].join(" ")}
            >
              {hasConversation ? (
                messages.map((message, index) => {
                  const isLatestUserMessage =
                    message.role === "user" &&
                    !messages.slice(index + 1).some((item) => item.role === "user");

                  return (
                    <div
                      key={`${message.role}-${index}`}
                      ref={isLatestUserMessage ? latestUserMessageRef : undefined}
                    >
                      <ChatBubble message={message} />
                    </div>
                  );
                })
              ) : (
                <EmptyPanelState
                  contextLabel={contextLabel}
                  ideas={ideas}
                  onCloseIdeas={() => setShowIdeas(false)}
                  showIdeas={showIdeas}
                />
              )}
              {isLoading ? (
                <p className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3 text-xs text-stone-400">
                  Searching the framework...
                </p>
              ) : null}
              {hasConversation ? (
                <div
                  aria-hidden="true"
                  ref={bottomSpacerRef}
                  style={{ height: bottomSpacerHeight }}
                />
              ) : null}
            </div>
          </div>

          {showIdeas && hasConversation ? (
            <KeyIdeasOverlay
              contextLabel={contextLabel}
              ideas={ideas}
              onClose={() => setShowIdeas(false)}
            />
          ) : null}
        </div>

        <form
          className="shrink-0 border-t border-white/10 pt-4"
          onSubmit={handleSubmit}
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 transition focus-within:border-amber-200/30 focus-within:bg-white/[0.04]">
            <textarea
              className="max-h-44 min-h-10 w-full resize-none overflow-y-auto bg-transparent text-sm leading-6 text-stone-100 outline-none placeholder:text-stone-600"
              onChange={(event) => handleInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask about an idea, argument, claim, or section..."
              ref={textareaRef}
              rows={2}
              value={input}
            />
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  aria-label="Toggle key ideas"
                  aria-pressed={showIdeas}
                  className={[
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition hover:scale-105",
                    showIdeas
                      ? "border-amber-200/35 bg-amber-200/15 text-white"
                      : "border-white/10 bg-white/[0.025] text-stone-500 hover:border-amber-200/35 hover:bg-amber-200/15 hover:text-white",
                  ].join(" ")}
                  onClick={() => setShowIdeas((current) => !current)}
                  type="button"
                >
                  <LightbulbIcon />
                </button>
                <button
                  aria-label="Clear chat"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.025] text-stone-500 transition hover:scale-105 hover:border-red-300/35 hover:bg-red-400/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:border-white/10 disabled:hover:bg-white/[0.025] disabled:hover:text-stone-500"
                  disabled={!hasConversation && !input.trim()}
                  onClick={() => {
                    setMessages([]);
                    setSummary("");
                    setInput("");
                    setShowIdeas(false);
                    resetTextareaHeight();
                  }}
                  type="button"
                >
                  <ClearIcon />
                </button>
              </div>
              <button
                aria-label="Send message"
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-amber-200/20 bg-amber-200/10 text-xs font-semibold leading-none text-amber-50 transition hover:scale-105 hover:border-amber-200/35 hover:bg-amber-200/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                disabled={isLoading || !input.trim()}
                type="submit"
              >
                ↑
              </button>
            </div>
          </div>
        </form>
      </div>
    </aside>
  );
}

function formatAssistantReply({
  answer,
  error,
  responseOk,
}: {
  answer?: string;
  error?: string;
  responseOk: boolean;
}) {
  if (answer && !looksLikeRawError(answer)) {
    return answer;
  }

  const parsedError = parseErrorMessage(error ?? answer);

  if (!responseOk || parsedError) {
    return [
      "The project found relevant context, but the answer request failed before it could write a response.",
      "",
      parsedError ? `Reason: ${parsedError}` : "Try again in a moment. If it keeps happening, the local server or model request may need a restart.",
    ].join("\n");
  }

  return "The framework could not answer that yet.";
}

function looksLikeRawError(text: string) {
  const trimmed = text.trim();
  return (
    trimmed.startsWith("{") ||
    trimmed.includes("\"error\"") ||
    trimmed.includes("server_error") ||
    trimmed.includes("model request failed")
  );
}

function parseErrorMessage(text?: string) {
  if (!text) {
    return "";
  }

  const trimmed = text.trim();
  const jsonStart = trimmed.indexOf("{");

  if (jsonStart >= 0) {
    try {
      const parsed = JSON.parse(trimmed.slice(jsonStart)) as {
        error?: { code?: string | null; message?: string; type?: string };
      };
      const message = parsed.error?.message?.trim();
      const code = parsed.error?.code ?? parsed.error?.type;
      return [message, code ? `Code: ${code}` : ""].filter(Boolean).join(" ");
    } catch {
      // Fall through to plain-text cleanup.
    }
  }

  if (trimmed.includes("server_error")) {
    return "OpenAI returned a temporary server error.";
  }

  return trimmed.length > 180 ? `${trimmed.slice(0, 180).trim()}...` : trimmed;
}

function EmptyPanelState({
  contextLabel,
  ideas,
  onCloseIdeas,
  showIdeas,
}: {
  contextLabel: string;
  ideas: string[];
  onCloseIdeas: () => void;
  showIdeas: boolean;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-330px)] items-center">
      <div
        className={[
          "w-full transition duration-300 ease-out",
          showIdeas
            ? "pointer-events-none scale-[0.98] opacity-0"
            : "scale-100 opacity-100",
        ].join(" ")}
      >
        <EmptyChatState />
      </div>

      <div
        className={[
          "absolute inset-x-0 top-1/2 -translate-y-1/2 transition duration-300 ease-out",
          showIdeas
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-[0.98] opacity-0",
        ].join(" ")}
      >
        <KeyIdeasCard
          contextLabel={contextLabel}
          ideas={ideas}
          onClose={onCloseIdeas}
        />
      </div>
    </div>
  );
}

function KeyIdeasOverlay({
  contextLabel,
  ideas,
  onClose,
}: {
  contextLabel: string;
  ideas: string[];
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2">
      <KeyIdeasCard contextLabel={contextLabel} ideas={ideas} onClose={onClose} />
    </div>
  );
}

function KeyIdeasCard({
  contextLabel,
  ideas,
  onClose,
}: {
  contextLabel: string;
  ideas: string[];
  onClose: () => void;
}) {
  return (
    <section className="rounded-xl border border-amber-200/20 bg-[#171613]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
            Key Ideas
          </p>
          <p className="mt-2 inline-flex rounded-full border border-amber-200/15 bg-amber-200/[0.06] px-2 py-1 text-[11px] leading-4 text-amber-100/80">
            Referring to: <span className="ml-1 text-amber-50">{contextLabel}</span>
          </p>
        </div>
        <button
          aria-label="Close key ideas"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 text-xs text-stone-500 transition hover:border-white/20 hover:text-stone-200"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto overscroll-contain pr-1">
        <KeyIdeasList ideas={ideas} compact />
      </div>
    </section>
  );
}

function KeyIdeasList({
  compact = false,
  ideas,
}: {
  compact?: boolean;
  ideas: string[];
}) {
  return (
    <ul className={compact ? "mt-3 space-y-2" : "space-y-3"}>
      {ideas.map((idea) => (
        <li
          className={[
            "flex gap-3 text-stone-300",
            compact ? "text-xs leading-5" : "text-sm leading-6",
          ].join(" ")}
          key={idea}
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/70" />
          <span>{idea}</span>
        </li>
      ))}
    </ul>
  );
}

function LightbulbIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.4 1 1.1 1 1.8V17h6v-.5c0-.7.4-1.4 1-1.8A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 6l1 14h10l1-14" />
    </svg>
  );
}

function EmptyChatState() {
  return (
    <section className="flex w-full flex-col justify-center rounded-xl border border-amber-200/20 bg-[#171613]/70 px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
        Talk To The Project
      </p>
      <p className="mt-3 text-xs leading-5 text-stone-100">
        This assistant retrieves relevant sections from the project and uses them as
        context when responding.
      </p>
      <p className="mt-3 text-xs leading-5 text-stone-100">
        Its goal is not to force conclusions, but to discuss ideas through the
        project&apos;s framework around belief, certainty, interpretation, identity,
        and evidence.
      </p>
      <p className="mt-3 text-xs leading-5 text-stone-100">
        It is still an AI model. Responses can be imperfect, overly defensive,
        steered by prompting, or unintentionally reinforce the assumptions of the
        person using it.
      </p>
      <p className="mt-3 text-xs leading-5 text-stone-100">
        Retrieval helps anchor the conversation to the project&apos;s actual ideas,
        but it does not make the system objective, deterministic, or impossible to
        manipulate.
      </p>
    </section>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isError = message.variant === "error";

  return (
    <div
      className={[
        isUser
          ? "ml-auto w-fit max-w-full rounded-xl border border-amber-200/15 bg-amber-200/[0.06] px-2 py-1.5 text-left text-[13px] leading-6 text-stone-100"
          : isError
            ? "w-full rounded-xl border border-red-300/15 bg-red-950/10 px-3 py-2 text-[13.5px] leading-6 text-stone-300"
            : "w-full px-1 py-1.5 text-[13.5px] leading-6 text-stone-300",
      ].join(" ")}
    >
      <ChatMessageContent text={message.text} />
      {!isUser && message.sources?.length ? (
        <div className="mt-3 border-t border-white/10 pt-2">
          <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-stone-600">
            Relevant sections
          </p>
          <div className="flex flex-wrap gap-1.5">
            {message.sources.slice(0, 3).map((source) => (
              <span
                className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] leading-4 text-stone-500"
                key={`${source.source}-${source.title}`}
              >
                {source.source.includes(source.title)
                  ? source.title
                  : `${source.source} / ${source.title}`}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChatMessageContent({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/).filter(Boolean);

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <MarkdownBlock block={block} key={`${block.slice(0, 24)}-${index}`} />
      ))}
    </div>
  );
}

function MarkdownBlock({ block }: { block: string }) {
  const lines = block.split("\n").filter((line) => line.trim().length > 0);

  if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
    return (
      <ul className="space-y-1.5 pl-1">
        {lines.map((line) => (
          <li className="flex gap-2" key={line}>
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-500" />
            <span>{renderInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
    return (
      <ol className="space-y-1.5">
        {lines.map((line) => {
          const [, number = "", content = line] =
            line.match(/^(\d+)\.\s+(.*)$/) ?? [];

          return (
            <li className="flex gap-2" key={line}>
              <span className="min-w-4 shrink-0 font-mono text-[10px] text-stone-500">
                {number}.
              </span>
              <span>{renderInlineMarkdown(content)}</span>
            </li>
          );
        })}
      </ol>
    );
  }

  if (lines.every((line) => line.trim().startsWith(">"))) {
    return (
      <blockquote className="border-l border-amber-200/25 pl-3 text-stone-400">
        {lines.map((line) => (
          <p key={line}>
            {renderInlineMarkdown(line.replace(/^>\s?/, ""))}
          </p>
        ))}
      </blockquote>
    );
  }

  return (
    <p className="whitespace-pre-line">
      {renderInlineMarkdown(block)}
    </p>
  );
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong className="font-semibold text-stone-100" key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          className="rounded border border-white/10 bg-white/[0.04] px-1 py-0.5 font-mono text-[11px] text-amber-100/80"
          key={`${part}-${index}`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}
