import { Collapsible } from "@/components/Collapsible";
import type { ContentView } from "@/app/page";
import { politicsSections, startSection } from "@/lib/content";
import type { NavTopic, ReadingSection } from "@/lib/content";

type ContentProps = {
  activeView: ContentView;
  frameworkSections: ReadingSection[];
  topics: NavTopic[];
};

const articleClassName =
  "content-view-enter mx-auto w-full max-w-[780px] px-6 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20";

export function Content({ activeView, frameworkSections, topics }: ContentProps) {
  const [overviewSection, ...remainingFrameworkSections] = frameworkSections;

  if (activeView === "start") {
    return (
      <article className={articleClassName}>
        <StartContent />
      </article>
    );
  }

  if (activeView === "politics") {
    return (
      <article className={articleClassName}>
        <CategorySections
          eyebrow="Politics"
          intro="This test category applies the project framework to government, ideology, and media influence. The point is to test how future main categories can contain their own internal sections."
          sections={politicsSections}
          title="Politics"
        />
      </article>
    );
  }

  if (activeView !== "religion") {
    return (
      <article className={articleClassName}>
        <CategoryPlaceholder activeView={activeView} />
      </article>
    );
  }

  return (
    <article className={articleClassName}>
      <div className="space-y-20">
        {overviewSection ? (
          <ReadingSubsection key={overviewSection.id} section={overviewSection} />
        ) : null}
        {topics.map((topic) => (
          <TopicSection key={topic.id} topic={topic} />
        ))}
        {remainingFrameworkSections.map((section) => (
          <ReadingSubsection key={section.id} section={section} />
        ))}
      </div>
    </article>
  );
}

function StartContent() {
  return (
    <header className="scroll-mt-16" id={startSection.id}>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
        {startSection.eyebrow}
      </p>
      <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-stone-50 sm:text-5xl">
        {startSection.title}
      </h2>
      <p className="mt-7 text-xl leading-9 text-stone-300">
        {startSection.intro}
      </p>
      <div className="mt-8 space-y-5 text-lg leading-9 text-stone-300">
        {startSection.contentBlocks.map((block) => (
          <p key={block}>{block}</p>
        ))}
      </div>
      <StartFrame />
      <ReadingPath />
    </header>
  );
}

function CategorySections({
  eyebrow,
  intro,
  sections,
  title,
}: {
  eyebrow: string;
  intro: string;
  sections: ReadingSection[];
  title: string;
}) {
  return (
    <div>
      <header className="mb-14">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
          {eyebrow}
        </p>
        <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-stone-50 sm:text-5xl">
          {title}
        </h2>
        <p className="mt-7 text-xl leading-9 text-stone-300">{intro}</p>
      </header>

      <div className="space-y-20">
        {sections.map((section) => (
          <ReadingSubsection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

const placeholderContent: Record<
  Exclude<ContentView, "start" | "religion" | "politics">,
  {
    eyebrow: string;
    title: string;
    intro: string;
    cards: { title: string; body: string }[];
  }
> = {
  society: {
    eyebrow: "Future Category",
    title: "Society",
    intro:
      "This space will cover culture, institutions, social pressure, identity, education, community, and the norms that shape behavior.",
    cards: [
      {
        title: "Culture",
        body: "How repeated social patterns become normal enough to feel obvious.",
      },
      {
        title: "Institutions",
        body: "How systems organize behavior and distribute authority.",
      },
      {
        title: "Social Pressure",
        body: "How belonging can influence what people say, believe, and avoid.",
      },
    ],
  },
  psychology: {
    eyebrow: "Future Category",
    title: "Human Psychology",
    intro:
      "This space will isolate the human mechanisms behind belief, certainty, identity, resistance, motivation, and bias.",
    cards: [
      {
        title: "Belief Formation",
        body: "How people move from uncertainty into structure, confidence, and identity.",
      },
      {
        title: "Cognitive Bias",
        body: "How interpretation can become selective without feeling dishonest from the inside.",
      },
      {
        title: "Group Behavior",
        body: "How shared identity changes what feels reasonable or threatening.",
      },
    ],
  },
  technology: {
    eyebrow: "Future Category",
    title: "Technology",
    intro:
      "This space will look at AI, algorithms, social media, attention, information systems, automation, and reality distortion.",
    cards: [
      {
        title: "AI",
        body: "How AI can clarify reasoning, mirror assumptions, or reinforce certainty depending on how it is used.",
      },
      {
        title: "Algorithms",
        body: "How ranking systems reward attention, confidence, emotion, and repetition.",
      },
      {
        title: "Information Systems",
        body: "How speed and scale change what people think they know.",
      },
    ],
  },
  philosophy: {
    eyebrow: "Future Category",
    title: "My Philosophy",
    intro:
      "This space will collect the personal framework: evidence standards, uncertainty standards, attention priorities, and how to decide what deserves commitment.",
    cards: [
      {
        title: "Evidence Standard",
        body: "What kind of support should be required before treating something as true.",
      },
      {
        title: "Uncertainty Standard",
        body: "When restraint is more honest than forced certainty.",
      },
      {
        title: "Life Framework",
        body: "What to optimize for when truth, identity, and action compete.",
      },
    ],
  },
};

function CategoryPlaceholder({
  activeView,
}: {
  activeView: Exclude<ContentView, "start" | "religion" | "politics">;
}) {
  const content = placeholderContent[activeView];

  return (
    <section>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
        {content.eyebrow}
      </p>
      <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-stone-50 sm:text-5xl">
        {content.title}
      </h2>
      <p className="mt-7 text-xl leading-9 text-stone-300">{content.intro}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {content.cards.map((card) => (
          <div
            className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4"
            key={card.title}
          >
            <p className="text-base font-semibold text-stone-100">{card.title}</p>
            <p className="mt-3 text-sm leading-6 text-stone-400">{card.body}</p>
          </div>
        ))}
      </div>
      <section className="mt-9 rounded-xl border border-amber-200/15 bg-amber-200/[0.045] px-5 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
          Coming Later
        </p>
        <p className="mt-3 text-base leading-8 text-stone-300">
          This category is separated from Religion now, so it can grow into its own
          reading space without turning the site into one endless scroll.
        </p>
      </section>
    </section>
  );
}

function StartFrame() {
  return (
    <section className="mt-9 grid gap-3 sm:grid-cols-3">
      {[
        {
          label: "Truth",
          detail: "What can actually be checked?",
        },
        {
          label: "Identity",
          detail: "When does an idea become personal?",
        },
        {
          label: "Action",
          detail: "Where should attention go?",
        },
      ].map((item) => (
        <div
          className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4"
          key={item.label}
        >
          <p className="text-base font-semibold text-stone-100">{item.label}</p>
          <p className="mt-2 text-sm leading-6 text-stone-400">{item.detail}</p>
        </div>
      ))}
    </section>
  );
}

const pathItems = [
  {
    label: "Overviews",
    detail: "What the religions are",
  },
  {
    label: "Arguments",
    detail: "What claims are used",
  },
  {
    label: "Certainty",
    detail: "When evidence feels enough",
  },
  {
    label: "Mechanics",
    detail: "How belief locks in",
  },
  {
    label: "Positions",
    detail: "How belief becomes sides",
  },
  {
    label: "Stance",
    detail: "Where this project lands",
  },
  {
    label: "Context",
    detail: "How modern systems shape it",
  },
  {
    label: "Framework",
    detail: "How truth gets evaluated",
  },
];

function ReadingPath() {
  return (
    <section className="mt-9 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
        Reading Path
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {pathItems.map((item, index) => (
          <div
            className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-3"
            key={item.label}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-amber-200/20 bg-amber-200/10 text-xs font-semibold text-amber-100">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-stone-100">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const overviewRows = [
  {
    religion: "Islam",
    text: "Qur'an, Hadith",
    authority: "Revelation, Prophetic Model, Scholarship",
    branches: "Sunni, Shia, Legal Schools",
    socialRole: "Law, Practice, Community, Governance, Identity",
  },
  {
    religion: "Christianity",
    text: "Bible",
    authority: "Scripture, Church Tradition, Denomination",
    branches: "Catholic, Orthodox, Protestant",
    socialRole: "Church, Morality, Institutions, Charity, Culture",
  },
  {
    religion: "Judaism",
    text: "Torah, Hebrew Bible, rabbinic texts",
    authority: "Law, Rabbinic Interpretation, Community",
    branches: "Orthodox, Conservative, Reform, Cultural",
    socialRole: "Peoplehood, Law, Memory, Ritual, Continuity",
  },
];

const flowStepsBySection: Record<string, string[]> = {
  "probability-convergence-certainty": [
    "Pattern",
    "Plausibility",
    "Convergence",
    "Threshold",
    "Certainty / Uncertainty",
  ],
  "belief-mechanics": [
    "Uncertainty",
    "Structure",
    "Reinforcement",
    "Identity",
    "Defense",
    "Lock-in",
  ],
  "from-belief-to-positions": [
    "Belief",
    "Position",
    "Group Alignment",
    "Identity",
    "Defense",
  ],
};

const keyTensionBySection: Record<string, string> = {
  "religion-overviews": "Fixed Revelation vs. Human Interpretation",
  religion: "Argument Structure vs. Specific Religion",
  "probability-convergence-certainty": "Plausibility vs. Certainty",
  "belief-mechanics": "Truth Testing vs. Stability Protection",
  "from-belief-to-positions": "Understanding vs. Taking a Side",
  "my-stance": "Openness vs. False Certainty",
  "modern-context": "Public Narrative vs. Lived Complexity",
  "personal-framework": "Identity Strength vs. Truth Relationship",
};

const coreLineBySection: Record<string, string> = {
  "religion-overviews":
    "Interpretation is not an outside detail. It is part of how religious systems actually function.",
  religion:
    "Different religions often use different language for the same underlying argument structures.",
  "probability-convergence-certainty":
    "Strong convergence can increase plausibility without automatically closing uncertainty.",
  "belief-mechanics":
    "A belief can feel proven because it stabilizes life, even when usefulness is not the same as truth.",
  "from-belief-to-positions":
    "Once belief becomes a side, discussion often shifts from understanding to defense.",
  "my-stance":
    "Understanding why a belief works for people is different from accepting that it is objectively proven.",
  "modern-context":
    "Modern systems reward visible certainty more than careful restraint.",
  "personal-framework":
    "Certainty should scale with the strength and uniqueness of the evidence.",
};

function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
        Process
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div className="flex items-center gap-2" key={step}>
            <span className="rounded-md border border-white/10 bg-black/10 px-3 py-2 text-xs font-medium text-stone-200">
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span className="text-amber-200/50" aria-hidden="true">
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function CoreLine({ children }: { children: string }) {
  return (
    <section className="mt-5 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <div className="flex gap-4">
        <span
          className="mt-1 h-10 w-1 shrink-0 rounded-full bg-amber-200/70"
          aria-hidden="true"
        />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
            Load-Bearing Line
          </p>
          <p className="mt-2 text-lg font-medium leading-8 text-stone-100">
            {children}
          </p>
        </div>
      </div>
    </section>
  );
}

function KeyTension({ children }: { children: string }) {
  return (
    <section className="mt-8 rounded-xl border border-amber-200/15 bg-amber-200/[0.045] px-4 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
        Key Tension
      </p>
      <p className="mt-2 text-base font-medium text-stone-100">{children}</p>
    </section>
  );
}

function IdeaStrip({ ideas }: { ideas: string[] }) {
  if (!ideas.length) {
    return null;
  }

  return (
    <section className="mt-5 flex flex-wrap gap-2">
      {ideas.slice(0, 4).map((idea) => (
        <span
          className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs leading-5 text-stone-300"
          key={idea}
        >
          {idea}
        </span>
      ))}
    </section>
  );
}

function ReligionComparisonTable() {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
          At A Glance
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.035] text-xs uppercase tracking-[0.14em] text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Religion</th>
              <th className="px-4 py-3 font-medium">Primary Text</th>
              <th className="px-4 py-3 font-medium">Authority</th>
              <th className="px-4 py-3 font-medium">Variation</th>
              <th className="px-4 py-3 font-medium">Social Role</th>
            </tr>
          </thead>
          <tbody>
            {overviewRows.map((row) => (
              <tr className="border-t border-white/10" key={row.religion}>
                <td className="px-4 py-4 font-medium text-stone-100">{row.religion}</td>
                <td className="px-4 py-4 text-stone-300">{row.text}</td>
                <td className="px-4 py-4 text-stone-300">{row.authority}</td>
                <td className="px-4 py-4 text-stone-300">{row.branches}</td>
                <td className="px-4 py-4 text-stone-300">{row.socialRole}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TopicSection({ topic }: { topic: NavTopic }) {
  return (
    <section className="scroll-mt-16" id={topic.id}>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
        Topic
      </p>
      <h2 className="text-3xl font-semibold text-stone-50 sm:text-4xl">
        {topic.title}
      </h2>
      <p className="mt-5 text-lg leading-9 text-stone-300">{topic.intro}</p>

      {topic.contentBlocks?.length ? (
        <div className="mt-7 space-y-6 text-lg leading-9 text-stone-300">
          {topic.contentBlocks.map((block) => (
            <p key={block}>{block}</p>
          ))}
        </div>
      ) : null}

      {keyTensionBySection[topic.id] ? (
        <KeyTension>{keyTensionBySection[topic.id]}</KeyTension>
      ) : null}

      {coreLineBySection[topic.id] ? (
        <CoreLine>{coreLineBySection[topic.id]}</CoreLine>
      ) : null}

      <IdeaStrip ideas={topic.keyIdeas} />

      {topic.layers?.length ? (
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-stone-100">
            Three Layers of Argument
          </h3>
          <div className="mt-5 space-y-3">
            {topic.layers.map((layer) => (
              <div
                className="rounded-lg border border-white/10 bg-white/[0.025] px-5 py-5"
                key={layer.title}
              >
                <h4 className="text-base font-semibold text-stone-100">{layer.title}</h4>
                <p className="mt-3 text-base leading-8 text-stone-300">
                  {layer.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {layer.examples.map((example) => (
                    <li className="flex gap-3 text-sm leading-6 text-stone-300" key={example}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/70" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
                {layer.note ? (
                  <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-stone-400">
                    {layer.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {topic.afterLayers?.length ? (
        <div className="mt-9 space-y-6 text-lg leading-9 text-stone-300">
          {topic.afterLayers.map((block) => (
            <p key={block}>{block}</p>
          ))}
        </div>
      ) : null}

      {topic.argumentPatternGroups?.length ? (
        <section className="mt-12 border-t border-white/10 pt-10">
          <h3 className="text-2xl font-semibold text-stone-100">
            Core Argument Map
          </h3>
          <p className="mt-4 text-lg leading-9 text-stone-300">
            These arguments appear across multiple religions. While they differ in
            wording or context, they rely on repeatable structures.
          </p>
          <p className="mt-4 text-lg leading-9 text-stone-300">
            The map combines general cross-religion arguments and system-specific
            arguments into one layered reference.
          </p>

          <div className="mt-10 space-y-12">
            {topic.argumentPatternGroups.map((group, groupIndex) => (
              <section key={group.title}>
                <h4 className="text-xl font-semibold text-stone-100">{group.title}</h4>
                <p className="mt-3 text-base leading-8 text-stone-300">
                  {group.intro}
                </p>

                <div className="mt-5 space-y-3">
                  {group.patterns.map((pattern, index) => {
                    const patternNumber =
                      topic.argumentPatternGroups
                        ?.slice(0, groupIndex)
                        .reduce((total, item) => total + item.patterns.length, 0) ?? 0;

                    return (
                    <div
                      className="rounded-lg border border-white/10 bg-white/[0.025] px-5 py-5"
                      key={pattern.title}
                    >
                      <h5 className="text-base font-semibold text-stone-100">
                        {patternNumber + index + 1}. {pattern.title}
                      </h5>
                      <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                        <p>
                          <span className="font-medium text-stone-100">Claim:</span>{" "}
                          {pattern.claim}
                        </p>
                        <p>
                          <span className="font-medium text-stone-100">Issue:</span>{" "}
                          {pattern.issue}
                        </p>
                        <p>
                          <span className="font-medium text-stone-100">Takeaway:</span>{" "}
                          {pattern.takeaway}
                        </p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.025] px-5 py-5">
            <h4 className="text-xl font-semibold text-stone-100">Pattern Summary</h4>
            <p className="mt-4 text-base leading-8 text-stone-300">
              Across different religions, these arguments tend to follow the same
              structure:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "Start with a broad claim (Layer 1)",
                "Narrow into system-specific validation (Layer 2)",
                "Reinforce internally through experience and interpretation (Layer 3)",
              ].map((item) => (
                <li className="flex gap-3 text-sm leading-6 text-stone-300" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-base leading-8 text-stone-300">
              This does not determine whether a belief is true or false, but it shows
              that many arguments function similarly across different systems.
            </p>
            <p className="mt-4 text-base leading-8 text-stone-300">
              This separates the argument structure from the specific religion using it.
            </p>
          </div>
        </section>
      ) : null}

      {topic.children?.length ? (
        <div className="mt-12 space-y-5">
          <div className="border-t border-white/10 pt-10">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
              Applications
            </p>
            <h3 className="text-2xl font-semibold text-stone-100">
              Religion-Specific Applications
            </h3>
            <p className="mt-4 max-w-2xl text-lg leading-9 text-stone-300">
              These cards show how the shared argument map appears inside specific
              religious systems. The full deconstructions remain inside each card.
            </p>
          </div>
          {topic.children.map((section) =>
            topic.id === "religion" ? (
              <ReligionPanel key={section.id} section={section} />
            ) : (
              <ReadingSubsection key={section.id} section={section} />
            ),
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-md border border-white/10 bg-white/[0.025] px-5 py-5 text-stone-400">
          This topic is ready for subsections when the project expands.
        </div>
      )}
    </section>
  );
}

function ReligionPanel({ section }: { section: ReadingSection }) {
  const accentClasses = getAccentClasses(section.visual?.accent);

  return (
    <section
      className={[
        "scroll-mt-16 overflow-hidden rounded-xl border px-5 py-5 sm:px-6 sm:py-6",
        accentClasses.card,
        accentClasses.border,
      ].join(" ")}
      id={section.id}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
            {section.eyebrow}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div
              className={[
                "grid h-14 w-14 shrink-0 place-items-center rounded-full border text-3xl",
                accentClasses.symbol,
              ].join(" ")}
              aria-hidden="true"
            >
              {section.visual?.symbol}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-stone-50 sm:text-3xl">
                {section.label}
              </h3>
              <p className="mt-1 text-xs leading-5 text-stone-500">
                {section.arguments.length} preserved argument notes
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300">
        {section.intro}
      </p>

      {section.visual?.families.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {section.visual.families.map((family) => (
            <span
              className={[
                "rounded-full border px-3 py-1 text-xs",
                accentClasses.chip,
              ].join(" ")}
              key={family}
            >
              {family}
            </span>
          ))}
        </div>
      ) : null}

      <div className={["mt-6 border-t pt-5", accentClasses.divider].join(" ")}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Reading Lens
        </p>
        <p className="mt-3 text-sm leading-7 text-stone-300">
          {section.contentBlocks[0]}
        </p>
      </div>

      <details className="group mt-5">
        <summary className="cursor-pointer list-none text-sm font-medium text-stone-300 transition hover:text-stone-100">
          <span className="inline-flex items-center gap-2">
            <span
              className={[
                "grid h-6 w-6 place-items-center rounded-full border text-stone-500 transition group-open:rotate-180 group-open:bg-stone-100 group-open:text-stone-950",
                accentClasses.iconBorder,
              ].join(" ")}
            >
              ↓
            </span>
            View argument deconstructions
          </span>
        </summary>
        <div className="mt-4 space-y-3">
          {section.arguments.map((argument) => (
            <Collapsible
              argument={argument}
              key={argument.title}
              responseLabel="Deconstruction"
            />
          ))}
        </div>
      </details>
    </section>
  );
}

function getAccentClasses(accent = "stone") {
  const classes = {
    emerald: {
      border: "border-emerald-300/15",
      card: "bg-emerald-300/[0.045]",
      chip: "border-emerald-200/15 bg-emerald-300/10 text-emerald-50",
      divider: "border-emerald-200/15",
      note: "border-emerald-200/15 bg-emerald-950/20",
      archive: "border-emerald-200/10 bg-emerald-950/10",
      iconBorder: "border-emerald-200/20",
      symbol: "border-emerald-200/20 bg-emerald-300/10 text-emerald-100",
    },
    sky: {
      border: "border-sky-300/15",
      card: "bg-sky-300/[0.045]",
      chip: "border-sky-200/15 bg-sky-300/10 text-sky-50",
      divider: "border-sky-200/15",
      note: "border-sky-200/15 bg-sky-950/20",
      archive: "border-sky-200/10 bg-sky-950/10",
      iconBorder: "border-sky-200/20",
      symbol: "border-sky-200/20 bg-sky-300/10 text-sky-100",
    },
    violet: {
      border: "border-violet-300/15",
      card: "bg-violet-300/[0.045]",
      chip: "border-violet-200/15 bg-violet-300/10 text-violet-50",
      divider: "border-violet-200/15",
      note: "border-violet-200/15 bg-violet-950/20",
      archive: "border-violet-200/10 bg-violet-950/10",
      iconBorder: "border-violet-200/20",
      symbol: "border-violet-200/20 bg-violet-300/10 text-violet-100",
    },
    stone: {
      border: "border-white/10",
      card: "bg-white/[0.025]",
      chip: "border-white/10 bg-white/[0.04] text-stone-300",
      divider: "border-white/10",
      note: "border-white/10 bg-black/10",
      archive: "border-white/10 bg-white/[0.025]",
      iconBorder: "border-white/10",
      symbol: "border-white/10 bg-white/[0.04] text-stone-100",
    },
  };

  return classes[accent as keyof typeof classes] ?? classes.stone;
}

function ReadingSubsection({ section }: { section: ReadingSection }) {
  return (
    <section className="scroll-mt-16 border-t border-white/10 pt-9" id={section.id}>
      <header className="mb-7">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
          {section.eyebrow}
        </p>
        <h3 className="text-2xl font-semibold leading-tight text-stone-50 sm:text-3xl">
          {section.title}
        </h3>
        <p className="mt-5 text-lg leading-9 text-stone-300">{section.intro}</p>
      </header>

      <div className="space-y-6 text-lg leading-9 text-stone-300">
        {section.contentBlocks.map((block) => (
          <p key={block}>{block}</p>
        ))}
      </div>

      {keyTensionBySection[section.id] ? (
        <KeyTension>{keyTensionBySection[section.id]}</KeyTension>
      ) : null}

      {coreLineBySection[section.id] ? (
        <CoreLine>{coreLineBySection[section.id]}</CoreLine>
      ) : null}

      <IdeaStrip ideas={section.keyIdeas} />

      {section.id === "religion-overviews" ? <ReligionComparisonTable /> : null}

      {flowStepsBySection[section.id] ? (
        <FlowDiagram steps={flowStepsBySection[section.id]} />
      ) : null}

      <ArgumentList section={section} />

      {section.notes?.length ? (
        <div className="mt-10 space-y-4">
          {section.notes.map((note) => (
            <NoteCard key={note.title} note={note} sectionId={section.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function NoteCard({
  note,
  sectionId,
}: {
  note: NonNullable<ReadingSection["notes"]>[number];
  sectionId: string;
}) {
  const emphasized = isEmphasisNote(note.title);

  return (
    <section
      className={[
        "rounded-lg border px-5 py-5 transition duration-200",
        emphasized
          ? "border-amber-200/20 bg-amber-200/[0.04] shadow-[0_18px_55px_rgba(0,0,0,0.14)]"
          : "border-white/10 bg-white/[0.025]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-1 h-5 w-1 shrink-0 rounded-full",
            emphasized ? "bg-amber-200/70" : "bg-white/10",
          ].join(" ")}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          {emphasized ? (
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/70">
              Key Point
            </p>
          ) : null}
          <h4 className="text-base font-semibold text-stone-100">{note.title}</h4>
          {note.body ? <NoteBody body={note.body} /> : null}
          {sectionId === "probability-convergence-certainty" &&
          note.title === "The Benoit Blanc Example" ? (
            <TrailerEmbed />
          ) : null}
          {note.items?.length ? (
            <ul className="mt-4 space-y-2">
              {note.items.map((item) => (
                <li className="flex gap-3 text-sm leading-6 text-stone-300" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function NoteBody({ body }: { body: string }) {
  return (
    <div className="mt-3 space-y-4">
      {body.split("\n\n").map((paragraph) => {
        const highlighted = isHighlightParagraph(paragraph);

        return (
          <p
            className={[
              "whitespace-pre-line text-base leading-8 text-stone-300",
              highlighted
                ? "rounded-lg border border-amber-200/15 bg-black/15 px-4 py-3 text-stone-100"
                : "",
            ].join(" ")}
            key={paragraph}
          >
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}

function isEmphasisNote(title: string) {
  return /core|key|final|stance|tension|why|certainty|framework/i.test(title);
}

function isHighlightParagraph(paragraph: string) {
  return /the key distinction|the disagreement|the issue is|this does not|this distinction matters|the central issue|as a result|the goal is not/i.test(
    paragraph,
  );
}

function TrailerEmbed() {
  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
              Media Reference
            </p>
            <h5 className="mt-1 text-sm font-semibold text-stone-100">
              Wake Up Dead Man: A Knives Out Mystery
            </h5>
          </div>
          <a
            className="text-xs font-medium text-stone-400 transition hover:text-stone-100"
            href="https://www.youtube.com/watch?v=0hc8yz5-d5Y"
            rel="noreferrer"
            target="_blank"
          >
            Open on YouTube
          </a>
        </div>
      </div>
      <div className="h-52 bg-black sm:h-64">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          src="https://www.youtube.com/embed/0hc8yz5-d5Y"
          title="Wake Up Dead Man: A Knives Out Mystery trailer"
        />
      </div>
      <div className="px-4 py-3">
        <p className="text-xs leading-6 text-stone-500">
          Included here as a cultural example of interpretation, ambiguity, and restraint
          before certainty.
        </p>
      </div>
    </section>
  );
}

function ArgumentList({ section }: { section: ReadingSection }) {
  if (section.arguments.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
          Arguments
        </p>
        <h4 className="mt-2 text-xl font-semibold text-stone-100">
          Claims and Responses
        </h4>
      </div>

      {section.arguments.length > 0 ? (
        <div className="space-y-3">
          {section.arguments.map((argument) => (
            <Collapsible argument={argument} key={argument.title} />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-4 text-stone-400">
          Argument blocks can be added here as this section develops.
        </p>
      )}
    </section>
  );
}
