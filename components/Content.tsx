import { Fragment, useEffect, useRef, useState } from "react";
import { Collapsible } from "@/components/Collapsible";
import type { ContentView } from "@/app/page";
import { economicsSectionGroups, economicsSections, philosophySections, politicsSections, psychologySections, startSection, technologySections } from "@/lib/content";
import type { EvidentialCaseStudy, EvidentialStyle, NavTopic, ReadingSection, ReadingSectionGroup } from "@/lib/content";

type ContentProps = {
  activeView: ContentView;
  frameworkSections: ReadingSection[];
  topics: NavTopic[];
};

type ReadingDisplayMode = "essay" | "compare";

const articleClassName =
  "content-view-enter mx-auto w-full max-w-[1040px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20";

const startArticleClassName =
  "content-view-enter mx-auto w-full max-w-[1040px] px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16";

export function Content({ activeView, frameworkSections, topics }: ContentProps) {
  const [overviewSection, ...remainingFrameworkSections] = frameworkSections;
  const [philosophyDisplayMode, setPhilosophyDisplayMode] =
    useState<ReadingDisplayMode>("essay");

  if (activeView === "start") {
    return (
      <article className={startArticleClassName}>
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

  if (activeView === "economics") {
    return (
      <article className={articleClassName}>
        <CategorySectionGroups
          eyebrow="Economics"
          groups={economicsSectionGroups}
          intro="A systems map of scarcity, incentives, compounding wealth, market power, regulation, innovation, measurement, trade, and the structural limits of economic design."
          title="Economics"
        />
      </article>
    );
  }

  if (activeView === "philosophy") {
    return (
      <article className={articleClassName}>
        <ReadingDisplayToggle
          mode={philosophyDisplayMode}
          onChange={setPhilosophyDisplayMode}
        />
        <div className="space-y-20">
          {philosophySections.map((section) => (
            <ReadingSubsection
              displayMode={philosophyDisplayMode}
              key={section.id}
              section={section}
            />
          ))}
        </div>
      </article>
    );
  }

  if (activeView === "psychology") {
    return (
      <article className={articleClassName}>
        <div className="space-y-20">
          {psychologySections.map((section) => (
            <ReadingSubsection key={section.id} section={section} />
          ))}
        </div>
      </article>
    );
  }

  if (activeView === "technology") {
    return (
      <article className={articleClassName}>
        <div className="space-y-20">
          {technologySections.map((section) => (
            <ReadingSubsection key={section.id} section={section} />
          ))}
        </div>
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
    <div className="daniel-scroll-flow scroll-mt-16" id={startSection.id}>
      <header className="scroll-reveal relative isolate grid min-h-[calc(100vh-7rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018)_44%,rgba(253,230,138,0.055))] px-5 py-6 shadow-[0_30px_120px_rgba(0,0,0,0.32)] sm:px-7 sm:py-8 lg:grid-cols-[minmax(300px,1fr)_minmax(240px,310px)] lg:items-center lg:px-9">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(253,230,138,0.13),transparent_34rem),radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.075),transparent_22rem)]" />
        <div>
          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_210px] 2xl:items-start">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
                {startSection.eyebrow}
              </p>
              <h2 className="max-w-3xl text-5xl font-semibold leading-[0.98] text-stone-50 sm:text-6xl lg:text-7xl">
                {startSection.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
                An organized map of the patterns, interests, arguments, systems, and questions that shaped the rest of this project.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <SocialBubble link={link} key={link.label} />
                ))}
              </div>
            </div>

            <DigitalMindPet />
          </div>

          <div className="mt-8 flex max-w-3xl flex-wrap gap-x-4 gap-y-3 border-t border-white/10 pt-5">
            {profileFacts.map((fact) => (
              <div
                className="min-w-[112px] flex-1"
                key={fact.label}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
                  {fact.label}
                </p>
                <p className="mt-1 text-sm font-medium leading-5 text-stone-100">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <figure className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:mt-0 lg:h-[430px]">
          <img
            alt="Daniel"
            className="aspect-[4/5] w-full object-cover object-top lg:aspect-auto lg:h-full lg:object-[center_100%]"
            src="/images/start/daniel-portrait.jpg"
          />
        </figure>
      </header>

      <section className="scroll-reveal mt-20 grid min-h-[72vh] gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
            About Me
          </p>
          <h3 className="mt-4 max-w-sm text-3xl font-semibold leading-tight text-stone-50 sm:text-4xl">
            The perspective the project starts from.
          </h3>
        </div>
        <div className="space-y-8 text-lg leading-9 text-stone-200">
          {introCaptionBlocks.map((block, index) => (
            <p
              className={[
                "max-w-2xl border-l border-amber-200/25 pl-5 text-stone-200",
                index % 2 === 1 ? "lg:ml-auto" : "",
              ].join(" ")}
              key={block}
            >
              {block}
            </p>
          ))}
        </div>
      </section>

      <section className="scroll-reveal mt-24 rounded-[2rem] border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-7 lg:px-8">
        <SectionHeading
          eyebrow="Part 1"
          title="Things that influenced my thought."
          body="These are not credentials. They are inputs: the kinds of things that shaped how I notice patterns, pressure, framing, systems, and confidence."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {influenceCards.map((card) => (
            <InfoCard card={card} key={card.title} />
          ))}
        </div>
      </section>

      <EnjoymentArchiveSection />

      <PhotographySection />

      <FortniteSection />

      <section className="scroll-reveal mt-24 rounded-[2rem] border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-7 lg:px-8">
        <SectionHeading
          eyebrow="Part 5"
          title="Projects"
          body="Some adjacent projects built around a hobby I’ve fallen into over the last few years: building web projects, experimenting with ideas, and creating things alongside AI, with several more currently in development."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {projectCards.map((project) => (
            <ProjectCard project={project} key={project.title} />
          ))}
        </div>
      </section>

      <section className="scroll-reveal daniel-gradient-panel mt-24 grid min-h-[72vh] gap-8 overflow-hidden rounded-[2rem] border border-amber-200/15 px-5 py-8 shadow-[0_32px_130px_rgba(0,0,0,0.35)] sm:px-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Part 6"
            title="Thinking Alongside AI"
            body="AI gradually became a major part of how I think, work, and build. I use it for coding, organizing ideas, refining arguments, exploring concepts, automating repetitive tasks, and turning vague thoughts into clearer structures. Because so much of this project was shaped through AI-assisted exploration, it felt natural to make the project itself interactive. The assistant on the right side of the site is connected to the ideas and writing throughout the project, allowing people to explore the framework conversationally instead of only reading it statically."
          />
        </div>
        <figure className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-2">
          <img
            alt="ChatGPT usage review"
            className="max-h-[360px] w-full rounded-md object-contain"
            decoding="async"
            loading="lazy"
            src="/images/start/chatgpt-review.jpeg"
          />
        </figure>
      </section>
    </div>
  );
}

function DigitalMindPet() {
  const [idleStep, setIdleStep] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);
  const [showInsight, setShowInsight] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const currentInsight = petInsights[insightIndex];
  const bubbleLayout = getPetBubbleLayout(currentInsight);

  useEffect(() => {
    const frameTimer = window.setInterval(() => {
      setIdleStep((current) => (current + 1) % petIdleSequence.length);
    }, 750);

    return () => window.clearInterval(frameTimer);
  }, []);

  useEffect(() => {
    if (!showInsight) {
      const revealTimer = window.setTimeout(() => {
        setShowInsight(true);
      }, 3200);

      return () => window.clearTimeout(revealTimer);
    }

    const rotateTimer = window.setTimeout(() => {
      advancePetInsight();
    }, 6500);

    return () => window.clearTimeout(rotateTimer);
  }, [insightIndex, showInsight]);

  function advancePetInsight() {
    setShowInsight(true);
    setTextVisible(false);
    window.setTimeout(() => {
      setInsightIndex((current) => (current + 1) % petInsights.length);
      setTextVisible(true);
    }, 180);
  }

  function handlePetClick() {
    advancePetInsight();
  }

  return (
    <button
      aria-label="Mini Daniel pet. Click for a project insight."
      className="mind-pet group relative hidden h-[190px] overflow-visible text-left 2xl:-ml-24 2xl:block"
      onClick={handlePetClick}
      type="button"
    >
      <span className="mind-pet-spark mind-pet-delay-1 absolute left-[72px] top-5 h-2.5 w-2.5 rounded-[2px] bg-amber-200/55 shadow-[0_0_18px_rgba(253,230,138,0.28)]" />
      <span className="mind-pet-spark mind-pet-delay-2 absolute left-3 top-12 h-2 w-2 rounded-[2px] bg-amber-200/45 shadow-[0_0_18px_rgba(253,230,138,0.24)]" />
      <span className="mind-pet-spark mind-pet-delay-3 absolute bottom-9 left-[92px] h-3 w-3 rounded-[2px] bg-amber-200/45 shadow-[0_0_18px_rgba(253,230,138,0.24)]" />

      <span className="mind-pet-stage absolute bottom-0 left-0 flex h-[160px] w-[138px] items-center justify-center">
        <img
          alt=""
          className="mind-pet-idle-frame h-[130px] w-[120px] object-contain"
          draggable={false}
          src={petIdleFrames[petIdleSequence[idleStep]]}
        />
      </span>

      <span
        className={[
          "mind-pet-bubble-layer absolute bottom-[76px] left-[94px] transition duration-300",
          showInsight && textVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        ].join(" ")}
        style={{
          height: bubbleLayout.height,
          width: bubbleLayout.width,
        }}
      >
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
          src="/pets/mini-daniel/bubbles/speech-only.png"
        />
        <span
          className="absolute flex items-center justify-center px-3 text-center font-medium text-stone-100"
          style={{
            fontSize: bubbleLayout.fontSize,
            height: bubbleLayout.textHeight,
            left: bubbleLayout.textLeft,
            lineHeight: bubbleLayout.lineHeight,
            top: bubbleLayout.textTop,
            width: bubbleLayout.textWidth,
          }}
        >
          {currentInsight}
        </span>
      </span>
    </button>
  );
}

const introCaptionBlocks = [
  "I'm Daniel Lezhanskiy, and this project is basically an organized map of ideas I've spent years thinking about, questioning, arguing through, and refining.",
  "The project moves across religion, politics, society, human psychology, technology, and my own philosophy and perspectives on different things. Some sections focus more on analysis, some focus more on interpretation, and others are simply attempts to organize thoughts and observations that kept repeating across different areas of life.",
  "A lot of this grew out of years of discussions, debates, observations, and long conversations with AI while trying to structure the way I think into something more clear and navigable.",
  "I'm less interested in forcing conclusions and more interested in exploring the underlying patterns behind people, society, belief, behavior, technology, and the different systems that shape how humans think, act, organize, understand, and interact with the world around them.",
  "Before getting into the project itself, I wanted this section to serve as a small introduction to who I am and the perspective this project is being built from.",
  "It's also meant to introduce more about me outside of the project itself, including some of my interests, hobbies, passions, and the things that shaped the way I think and approach different topics.",
];

const profileFacts = [
  {
    label: "DOB",
    value: "07/13/2000",
  },
  {
    label: "Height",
    value: "6'2\"",
  },
  {
    label: "Location",
    value: "Brooklyn, NY",
  },
  {
    label: "Background",
    value: "Ukrainian-American",
  },
  {
    label: "Religion",
    value: "Agnostic",
  },
  {
    label: "Languages",
    value: "English / Russian",
  },
  {
    label: "Favorite Drink",
    value: "Earl Grey Tea",
  },
  {
    label: "Favorite Food",
    value: "Poppy Seed Bagel, Cream Cheese + Lox",
  },
];

const petInsights = [
  "Welcome to the project.",
  "A system can be useful without being final.",
  "This site is less about conclusions and more about patterns.",
  "Most sections are attempts to structure recurring questions.",
  "Some ideas here contradict each other on purpose.",
  "Humans model reality from inside reality.",
  "Certainty and clarity are not the same thing.",
  "Interpretation is unavoidable. Distortion is not.",
  "People often defend coherence before truth.",
  "A stable society still needs disagreement.",
  "Not all uncertainty is weakness.",
  "Operational truth is not ultimate certainty.",
  "Most people inherit frameworks before examining them.",
  "Identity changes what evidence feels threatening.",
  "A map is not reality, but maps still matter.",
  "This project revises itself over time.",
  "Some sections are stronger than others.",
  "The framework is still incomplete.",
  "The goal is orientation, not perfection.",
  "Some ideas stayed because they survived pressure.",
  "Certain questions kept repeating across different areas of life.",
  "People want certainty and flexibility at the same time.",
  "Groups often become less nuanced under threat.",
  "Useful systems can still distort reality.",
  "Technology increases information and confusion simultaneously.",
  "Every framework simplifies something.",
];

function getPetBubbleLayout(message: string) {
  const length = message.length;

  if (length <= 32) {
    return {
      fontSize: 11,
      height: 92,
      lineHeight: "14px",
      textHeight: 45,
      textLeft: 24,
      textTop: 23,
      textWidth: 142,
      width: 184,
    };
  }

  if (length <= 62) {
    return {
      fontSize: 10.5,
      height: 104,
      lineHeight: "13px",
      textHeight: 54,
      textLeft: 25,
      textTop: 24,
      textWidth: 170,
      width: 214,
    };
  }

  return {
    fontSize: 10,
    height: 116,
    lineHeight: "12.5px",
    textHeight: 66,
    textLeft: 27,
    textTop: 25,
    textWidth: 202,
    width: 250,
  };
}

const petIdleFrames = [
  "/pets/mini-daniel/frames/idle-00.png",
  "/pets/mini-daniel/frames/idle-01.png",
  "/pets/mini-daniel/frames/idle-02.png",
  "/pets/mini-daniel/frames/idle-03.png",
  "/pets/mini-daniel/frames/idle-04.png",
  "/pets/mini-daniel/frames/idle-05.png",
];

const petIdleSequence = [
  0, 0, 0, 0, 0, 0,
  1, 2, 1,
  0, 0, 0, 0, 0,
  3, 4, 5, 4, 3,
  0, 0, 0, 0, 0, 0, 0,
];

const photographyImageUrls = Array.from({ length: 18 }, (_, index) => {
  const displayIndex = String(index + 1).padStart(2, "0");
  return `/images/photography/photo-${displayIndex}.jpg`;
});

const influenceCards = [
  {
    title: "Competition",
    body: "Pressure shows the difference between confidence, habit, panic, and actual skill.",
  },
  {
    title: "AI Conversations",
    body: "AI made my own thinking easier to inspect, challenge, organize, and revise over time.",
  },
  {
    title: "Photography",
    body: "Framing matters. The same reality can feel different depending on what is centered or cropped out.",
  },
  {
    title: "Movies + Shows",
    body: "Stories make identity, pressure, loyalty, fear, and contradiction easier to observe.",
  },
];

const videoGameCards = [
  {
    title: "Pac-Man World 2",
    year: 2002,
    image: "https://upload.wikimedia.org/wikipedia/en/6/6b/Pac-Man_World_2_Coverart.png",
    summary: "A 3D platformer about movement, timing, navigation, and reading level flow.",
  },
  {
    title: "Super Monkey Ball 2",
    year: 2002,
    image: "https://upload.wikimedia.org/wikipedia/en/d/d5/Super_Monkey_Ball_2_Coverart.png",
    summary: "A precision puzzle game built around momentum, patience, and micro-adjustments.",
  },
  {
    title: "Yoshi Touch and Go",
    year: 2005,
    image: "https://upload.wikimedia.org/wikipedia/en/4/4c/Ytagbox.jpg",
    imagePosition: "62% 68%",
    summary: "A DS game where drawing paths turns reaction into planning and improvisation.",
  },
  {
    title: "New Super Mario Bros.",
    year: 2006,
    image: "https://upload.wikimedia.org/wikipedia/en/d/db/NewSuperMarioBrothers.jpg",
    imagePosition: "62% 68%",
    summary: "Classic platforming literacy: rhythm, timing, hidden paths, and repeated mastery.",
  },
  {
    title: "Pokemon Diamond",
    year: 2007,
    image: "/images/start/pokemon-diamond-ds-cover.webp",
    imagePosition: "62% 68%",
    summary: "A slower strategy loop about collection, types, team balance, and progression.",
  },
  {
    title: "Minecraft",
    year: 2009,
    image: "/images/start/minecraft-cover.jpg",
    imagePosition: "center 28%",
    summary: "Open-ended creation, survival, experimentation, and making your own goals.",
  },
  {
    title: "Call of Duty: MW3",
    year: 2011,
    image: "https://upload.wikimedia.org/wikipedia/en/b/bf/Call_of_Duty_Modern_Warfare_3_box_art.png",
    summary: "Fast multiplayer feedback through map awareness, recoil, spawns, and reaction speed.",
  },
  {
    title: "Call of Duty: Black Ops II",
    year: 2012,
    image: "https://upload.wikimedia.org/wikipedia/en/0/05/Call_of_Duty_Black_Ops_II_box_artwork.png",
    summary: "A shooter that rewards map flow, route familiarity, positioning, and prediction.",
  },
  {
    title: "Grand Theft Auto V",
    year: 2013,
    image: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
    summary: "A sandbox for roaming, testing systems, and mixing story with player freedom.",
  },
  {
    title: "Destiny",
    year: 2014,
    image: "/images/start/destiny-cover.jpg",
    summary: "A sci-fi shooter built around loot, raids, atmosphere, repetition, and shared goals.",
  },
  {
    title: "Mortal Kombat X",
    year: 2015,
    image: "https://upload.wikimedia.org/wikipedia/en/d/d0/Mortal_Kombat_X_Cover_Art.png",
    summary: "A technical fighting game about matchup knowledge, execution, and counterplay.",
  },
  {
    title: "Batman: Arkham Knight",
    year: 2015,
    image: "https://upload.wikimedia.org/wikipedia/en/6/6c/Batman_Arkham_Knight_Cover_Art.jpg",
    summary: "Rhythmic combat where timing, crowd control, and flow replace button mashing.",
  },
  {
    title: "Call of Duty: Black Ops III",
    year: 2015,
    image: "/images/start/bo3.jpg",
    summary: "Vertical movement, wall-running, fast tracking, and staying composed at speed.",
  },
  {
    title: "Overwatch",
    year: 2016,
    image: "https://upload.wikimedia.org/wikipedia/en/5/51/Overwatch_cover_art.jpg",
    imagePosition: "center 30%",
    summary: "A team shooter about roles, positioning, ability timing, and adapting quickly.",
  },
  {
    title: "Modern Warfare Remastered",
    year: 2016,
    image: "https://upload.wikimedia.org/wikipedia/en/d/d4/Call_of_Duty_-_Modern_Warfare_Remastered.jpeg",
    summary: "A fundamentals-heavy shooter where aim, routes, and positioning carry hard.",
  },
  {
    title: "Fortnite",
    year: 2017,
    image: "https://upload.wikimedia.org/wikipedia/en/a/ae/Fortnite_Save_The_World.jpg",
    summary: "A layered skill game combining aim, building, materials, and fast improvisation.",
  },
  {
    title: "Among Us",
    year: 2018,
    image: "https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg",
    imagePosition: "center 16%",
    summary: "Social deduction where timing, behavior, persuasion, and confidence become evidence.",
  },
  {
    title: "Mortal Kombat 11",
    year: 2019,
    image: "https://upload.wikimedia.org/wikipedia/en/7/7e/Mortal_Kombat_11_cover_art.png",
    summary: "A heavier fighting game about spacing, punish windows, patience, and matchup control.",
  },
  {
    title: "Valorant",
    year: 2020,
    image: "https://upload.wikimedia.org/wikipedia/en/b/ba/Valorant_cover.jpg",
    imagePosition: "center 6%",
    summary: "A tactical shooter about angle discipline, information control, and precision.",
  },
  {
    title: "Fall Guys",
    year: 2020,
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1097150/header.jpg",
    summary: "Chaotic party-game timing, movement, failure recovery, and staying calm in nonsense.",
  },
  {
    title: "Black Ops Cold War",
    year: 2020,
    image: "https://upload.wikimedia.org/wikipedia/en/3/31/BOCW_Cover_Art.jpg",
    summary: "A fast shooter that reinforces reflex accuracy, movement habits, and map knowledge.",
  },
  {
    title: "Splitgate",
    year: 2021,
    image: "/images/start/splitgate-arena-cover.jpg",
    imagePosition: "center 32%",
    summary: "Arena shooter pacing plus portals, weird angles, and creative spatial problem solving.",
  },
  {
    title: "Counter-Strike 2",
    year: 2023,
    image: "/images/start/counter-strike-2-cover.jpg",
    summary: "A precision shooter about angle discipline, utility, economy, and tiny mistakes.",
  },
  {
    title: "PEAK",
    year: 2025,
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3527290/c6791f0f1b7b29f6304e283ac7a2cabc27c7eb0d/capsule_616x353.jpg?t=1775581133",
    imageClassName: "object-contain bg-black scale-[1.00]",
    imagePosition: "68% center",
    summary: "A climbing co-op loop about communication, risk, bad decisions, and recovery under pressure.",
  },
];

const movieCards = [
  {
    title: "Good Will Hunting",
    year: "1997",
    image: "/images/movies/good-will-hunting.png",
    summary: "Talent, fear, self-worth, and whether intelligence becomes another hiding place.",
  },
  {
    title: "Harry Potter Series",
    year: "2001-2011",
    image: "/images/movies/harry-potter-series.jpg",
    summary: "A full coming-of-age fantasy arc built around friendship, fear, loyalty, memory, and sacrifice.",
  },
  {
    title: "The Prestige",
    year: "2006",
    image: "/images/movies/the-prestige.jpg",
    summary: "Obsession, sacrifice, rivalry, and the cost of turning identity into performance.",
  },
  {
    title: "Funny Games",
    year: "2007",
    image: "/images/movies/funny-games.jpg",
    summary: "Cold, confrontational control and discomfort instead of easy entertainment.",
  },
  {
    title: "The Social Network",
    year: "2010",
    image: "/images/movies/the-social-network.jpg",
    summary: "Ambition, resentment, status, intelligence, and friendship turning into a system.",
  },
  {
    title: "Life of Pi",
    year: "2012",
    image: "/images/movies/life-of-pi.jpg",
    summary: "Survival, faith, storytelling, beauty, and the question of which version of reality people can live with.",
  },
  {
    title: "The Impossible",
    year: "2012",
    image: "/images/movies/the-impossible.jpg",
    summary: "Disaster, family separation, survival, and trying to hold onto hope inside catastrophe.",
  },
  {
    title: "Dredd",
    year: "2012",
    image: "/images/movies/dredd.jpg",
    summary: "A brutal world, a simple mission, and stripped-down pressure with no softness.",
  },
  {
    title: "The Wolf of Wall Street",
    year: "2013",
    image: "/images/movies/the-wolf-of-wall-street.png",
    summary: "Money, appetite, ego, fraud, and greed turning into a whole ecosystem.",
  },
  {
    title: "Prisoners",
    year: "2013",
    image: "/images/movies/prisoners.jpg",
    summary: "Desperation, moral pressure, suspicion, and what people justify when fear takes over.",
  },
  {
    title: "The One I Love",
    year: "2014",
    image: "/images/movies/the-one-i-love.jpg",
    summary: "A relationship puzzle about projection, dissatisfaction, and wanting a cleaner version of someone.",
  },
  {
    title: "Whiplash",
    year: "2014",
    image: "/images/movies/whiplash.jpg",
    summary: "Discipline, obsession, approval, pressure, and the ugly question of what greatness costs.",
  },
  {
    title: "Ex Machina",
    year: "2015",
    image: "/images/movies/ex-machina.jpg",
    summary: "Clean design, small conversations, AI, manipulation, and hidden motives.",
  },
  {
    title: "Good Time",
    year: "2017",
    image: "/images/movies/good-time.png",
    summary: "One overheated bad night where every attempted fix makes the collapse worse.",
  },
  {
    title: "Logan",
    year: "2017",
    image: "/images/movies/logan.jpg",
    summary: "A worn-down hero story about age, violence, care, and the cost of surviving too long.",
  },
  {
    title: "Parasite",
    year: "2019",
    image: "/images/movies/parasite.png",
    summary: "Class tension, deception, structure, and a story that keeps loading pressure.",
  },
  {
    title: "Uncut Gems",
    year: "2019",
    image: "/images/movies/uncut-gems.jpg",
    summary: "Greed with the volume maxed out: risk stacked on risk until everything tightens.",
  },
  {
    title: "Midsommar",
    year: "2019",
    image: "/images/movies/midsommar.jpg",
    summary: "Grief, belonging, ritual, and daylight horror inside a community that feels warm and terrifying.",
  },
  {
    title: "Joker",
    year: "2019",
    image: "/images/movies/joker.jpg",
    summary: "Alienation, humiliation, social breakdown, and a person turning pain into identity.",
  },
  {
    title: "The Batman",
    year: "2022",
    image: "/images/movies/the-batman.jpg",
    summary: "Detective noir, rain, dread, obsession, and a city that feels rotten.",
  },
  {
    title: "Glass Onion",
    year: "2022",
    image: "/images/movies/glass-onion.jpg",
    summary: "A bright mystery box about ego, performance, wealth, and people pretending to be smarter than they are.",
  },
  {
    title: "Pearl",
    year: "2022",
    image: "/images/movies/pearl.jpg",
    summary: "Desire, resentment, performance, and a dream of escape turning poisonous.",
  },
  {
    title: "Barbarian",
    year: "2022",
    image: "/images/movies/barbarian.jpg",
    summary: "A horror setup that keeps changing shape as trust, danger, and hidden history unfold.",
  },
  {
    title: "Anora",
    year: "2024",
    image: "/images/movies/anora.jpg",
    summary: "Fast, funny, messy, and sad without losing its personality.",
  },
  {
    title: "Challengers",
    year: "2024",
    image: "/images/movies/challengers.jpeg",
    summary: "Desire, rivalry, tennis, scorekeeping, and the feeling that everyone is trying to win.",
  },
  {
    title: "Marty Supreme",
    year: "2025",
    image: "/images/movies/marty-supreme.jpg",
    summary: "Ambition with no off switch: pressure, ego, humiliation, and chasing a bigger life.",
  },
  {
    title: "Wake Up Dead Man",
    year: "2025",
    image: "/images/movies/wake-up-dead-man.jpg",
    summary: "A darker Benoit Blanc case with a moodier, more severe mystery-room feel.",
  },
  {
    title: "Weapons",
    year: "2025",
    image: "/images/movies/weapons.jpeg",
    summary: "Mass disappearance, community panic, suspicion, and mystery-driven dread.",
  }
];

const tvCards = [
  {
    title: "Friends",
    year: "1994-2004",
    image: "/images/tv-wide/friends.jpg",
    summary: "Comfort sitcom rhythm, friendship, timing, and familiar characters growing through everyday chaos.",
  },
  {
    title: "Teen Titans",
    year: "2003-2006",
    image: "/images/tv-wide/teen-titans.jpg",
    summary: "Team loyalty, stylized action, emotional episodes, and animated superhero identity.",
  },
  {
    title: "Avatar: The Last Airbender",
    year: "2005-2008",
    image: "/images/tv-wide/avatar-the-last-airbender.jpg",
    summary: "Clean arcs, earned payoff, humor, adventure, and real emotional growth.",
  },
  {
    title: "Lost",
    year: "2004-2010",
    image: "/images/tv-wide/lost.jpg",
    summary: "Mystery, atmosphere, ensemble character work, and a tone that feels specific.",
  },
  {
    title: "Breaking Bad",
    year: "2008-2013",
    image: "/images/tv-wide/breaking-bad.jpg",
    summary: "Transformation, consequence, escalation, and pacing that keeps tightening.",
  },
  {
    title: "11.22.63",
    year: "2016",
    image: "/images/tv-wide/112263.jpg",
    summary: "Time travel, romance, tragedy, and trying to change something that resists change.",
  },
  {
    title: "Prison Break",
    year: "2005-2017",
    image: "/images/tv-wide/prison-break.jpg",
    summary: "Urgency, planning, escape logic, and one mistake threatening the whole chain.",
  },
  {
    title: "Game of Thrones",
    year: "2011-2019",
    image: "/images/tv-wide/game-of-thrones.jpg",
    summary: "Power, loyalty, scale, consequence, and rivalries that make politics feel personal.",
  },
  {
    title: "Invincible",
    year: "2021-",
    image: "/images/tv-wide/invincible.jpg",
    summary: "Coming-of-age superhero scale with violence, damage, and heavier consequence.",
  },
  {
    title: "House of the Dragon",
    year: "2022-",
    image: "/images/tv-wide/house-of-the-dragon.jpg",
    summary: "Family fracture, succession pressure, and catastrophe before everything fully breaks.",
  },
  {
    title: "Dexter",
    year: "2006-2013 / 2021 / 2025-",
    image: "/images/tv-wide/dexter.jpg",
    imagePosition: "62% center",
    summary: "Routine, secrecy, moral drift, and ordinary details slowly becoming dangerous.",
  },
  {
    title: "A Knight of the Seven Kingdoms",
    year: "2026-",
    image: "/images/tv-wide/a-knight-of-the-seven-kingdoms.jpg",
    imagePosition: "60% center",
    summary: "Smaller Westeros adventure with character chemistry, travel, and old-world texture.",
  },
];

const characterGroups = [
  {
    title: "Intellectuals",
    items: [
      { name: "Socrates", image: "/images/char/socrates-upload.jpg", meta: "Philosophy | c. 470-399 BCE", note: "Questioning, humility, dialogue, and exposing weak certainty through pressure." },
      { name: "Diogenes", image: "/images/char/Diogenes.jpeg", meta: "Philosophy | c. 412-323 BCE", note: "Radical simplicity, social defiance, and refusing polite performance." },
      { name: "Voltaire", image: "/images/char/voltaire-local.jpg", meta: "Philosophy / Writing | 1694-1778", note: "Wit, criticism, skepticism toward authority, and pressure against dogma." },
      { name: "Arthur Schopenhauer", image: "/images/char/arthur-schopenhauer-local.jpg", meta: "Philosophy | 1788-1860", note: "Pessimism, desire, suffering, and the darker structure underneath wanting." },
      { name: "Fyodor Dostoevsky", image: "/images/char/fyodor-dostoevsky-local.jpg", meta: "Literature / Psychology | 1821-1881", note: "Guilt, faith, suffering, psychology, and moral contradiction pushed inward." },
      { name: "Friedrich Nietzsche", image: "/images/char/friedrich-nietzsche-local.jpg", meta: "Philosophy | 1844-1900", note: "Meaning collapse, self-overcoming, value creation, and suspicion of inherited morality." },
      { name: "Nikola Tesla", image: "/images/char/nikola-tesla.jpg", meta: "Engineering / Invention | 1856-1943", note: "Invention, imagination, electricity, and obsessive technical vision." },
      { name: "Carl Jung", image: "/images/char/carl-jung-local.jpg", meta: "Psychology | 1875-1961", note: "Symbol, shadow, archetype, inner conflict, and the hidden structure of the psyche." },
      { name: "Albert Einstein", image: "/images/char/albert-einstein.jpg", meta: "Physics | 1879-1955", note: "Physics, imagination, intuition, and changing the frame of what seemed obvious." },
      { name: "Pablo Picasso", image: "/images/char/picasso-upload.jpg", meta: "Art | 1881-1973", note: "Reinvention, visual disruption, style, and breaking forms until they say something new." },
      { name: "Jean-Paul Sartre", image: "/images/char/jean-paul-sartre-upload.jpg", meta: "Philosophy | 1905-1980", note: "Freedom, responsibility, bad faith, and the pressure of choosing what you become." },
      { name: "Albert Camus", image: "/images/char/albert-camus-upload.jpg", meta: "Philosophy / Literature | 1913-1960", note: "Absurdity, revolt, dignity, and looking for meaning without pretending certainty." },
      { name: "Richard Feynman", image: "/images/char/feynman-upload.jpg", meta: "Physics | 1918-1988", note: "Curiosity, clarity, irreverence, physics, and explaining complex things without fake depth." },
      { name: "Steve Jobs", image: "/images/char/steve-jobs-local.jpg", meta: "Technology / Design | 1955-2011", note: "Product taste, narrative control, design pressure, and building culture around tools." },
      { name: "Mark Zuckerberg", image: "/images/char/mark-zuck-upload.jpg", meta: "Technology / Social Platforms | 1984-present", note: "Social systems, platform power, iteration, and reshaping how people connect online." },
      { name: "Sam Altman", image: "/images/char/sam-altman-upload.jpg", meta: "AI / Technology | 1985-present", note: "AI, scale, product ambition, and building inside technological uncertainty." },
    ],
  },
  {
    title: "Athletes / Competitors",
    items: [
      { name: "Anderson Silva", image: "/images/char/Anderson Silva.jpeg", meta: "MMA", note: "Timing, looseness, creativity, and making pressure look casual." },
      { name: "Vasyl Lomachenko", image: "/images/char/Lomachenko.jpeg", imagePosition: "74% center", meta: "Boxing", note: "Footwork, angles, rhythm, and technical problem-solving under contact." },
      { name: "Carlos Prates", image: "/images/char/Carlos Prates.jpeg", imagePosition: "74% center", meta: "MMA", note: "Calm violence, timing, countering, and a sharpness that feels controlled." },
      { name: "Petr Yan", image: "/images/char/Petr Yan.jpeg", meta: "MMA", note: "Structure, reads, boxing layers, and controlled escalation across rounds." },
      { name: "Fedor Emelianenko", image: "/images/char/fedor-custom.jpg", meta: "MMA", note: "Composure, pressure, sambo, and heavyweight violence made strangely calm." },
      { name: "Jalen Brunson", image: "/images/char/jalen-brunson-local.jpg", imagePosition: "center 24%", meta: "Basketball", note: "Craft, control, footwork, toughness, and making size less decisive." },
      { name: "Kobe Bryant", image: "/images/char/kobe-bryant-local.jpg", meta: "Basketball", note: "Obsession, discipline, self-mythology, and extreme commitment to mastery." },
      { name: "Cooper Flagg", image: "/images/char/cooper-flagg-custom.jpg", meta: "Basketball", note: "Youth, competitiveness, two-way pressure, and the weight of expectation." },
      { name: "Novak Djokovic", image: "/images/char/novak.jpeg", meta: "Tennis", note: "Adaptation, discipline, pressure tolerance, and turning defense into inevitability." },
      { name: "Daniil Medvedev", image: "/images/char/daniil medvedev.jpg", meta: "Tennis", note: "Awkward efficiency, problem-solving, patience, and unusual competitive geometry." },
      { name: "Bobby Fischer", image: "/images/char/Bobby Fischer.jpeg", meta: "Chess", note: "Obsession, calculation, genius, isolation, and the cost of total immersion." },
      { name: "Mikhail Tal", image: "/images/char/mikhail-tal.jpg", meta: "Chess", note: "Creativity, sacrifice, intuition, and making chaos feel like calculation." },
      { name: "Henrik Lundqvist", image: "/images/char/Henrik Lundqvist.jpeg", meta: "Hockey", note: "Composure, consistency, style, and carrying pressure from the back." },
      { name: "Peterbot", image: "/images/char/Peterbot.jpeg", meta: "Fortnite / Esports", note: "Mechanical sharpness, speed, pressure, and modern competitive precision." },
      { name: "Alex Honnold", image: "/images/char/alex-honnold-custom.jpg", meta: "Rock Climbing", note: "Risk, focus, preparation, and calm inside consequences most people cannot tolerate." },
      { name: "Phil Ivey", image: "/images/char/phil-ivey.jpg", meta: "Poker", note: "Reading people, risk, patience, and competitive silence under pressure." },
    ],
  },
  {
    title: "Actors / Actresses",
    items: [
      { name: "Robert Pattinson", image: "/images/char/robert-pattinson-local.jpg", meta: "Acting / Film", note: "Taste, reinvention, restraint, and choosing stranger roles after fame." },
      { name: "Hugh Jackman", image: "/images/char/hugh-jackman.jpg", meta: "Acting / Film", note: "Range, stage presence, discipline, and carrying iconic roles with sincerity." },
      { name: "J. K. Simmons", image: "/images/char/j-k-simmons.jpg", meta: "Acting / Film", note: "Intensity, authority, timing, and performances that can dominate a scene fast." },
      { name: "James Franco", image: "/images/char/james-franco.jpg", meta: "Acting / Film", note: "Comedy, intensity, offbeat roles, and a restless creative presence across film and writing." },
      { name: "Jennifer Aniston", image: "/images/char/jennifer-aniston-custom.jpg", meta: "Acting / TV", note: "Timing, warmth, familiarity, and making light performances feel effortless." },
      { name: "Johnny Depp", image: "/images/char/johnny-depp.jpg", meta: "Acting / Film", note: "Eccentricity, stylization, persona, and committing fully to strange character choices." },
      { name: "Leonardo DiCaprio", image: "/images/char/leonardo-dicaprio.jpg", meta: "Acting / Film", note: "Intensity, ambition, transformation, and roles built around pressure." },
      { name: "Matt Damon", image: "/images/char/matt-damon-upload.jpg", meta: "Acting / Film", note: "Grounded intelligence, restraint, and making competence feel human." },
      { name: "Ben Affleck", image: "/images/char/ben-affleck.jpg", meta: "Acting / Film", note: "Fame, reinvention, direction, and characters carrying fatigue and pressure." },
      { name: "Keanu Reeves", image: "/images/char/keanu-reeves.jpg", meta: "Acting / Film", note: "Stoicism, sincerity, action presence, and quiet myth around restraint." },
      { name: "Jason Statham", image: "/images/char/jason-statham.jpg", meta: "Acting / Action Film", note: "Controlled intensity, physical presence, dry humor, and action roles built around precision." },
      { name: "Timothee Chalamet", image: "/images/char/timothee-chalamet-upload.jpg", meta: "Acting / Film", note: "Sensitivity, intensity, modern stardom, and roles built around interior tension." },
    ],
  },
  {
    title: "Fictional Characters",
    items: [
      { name: "Benoit Blanc", image: "/images/char/Benoit Blanc.jpeg", meta: "Knives Out", note: "Calm intelligence, moral clarity, charm, and noticing what performance hides." },
      { name: "Omni-Man", image: "/images/char/omniman.jpg", meta: "Invincible", note: "Power, ideology, family conflict, and the horror of detached certainty." },
      { name: "Conquest", image: "/images/char/conquest.jpeg", meta: "Invincible", note: "Brutality, dominance, and violence stripped of moral hesitation." },
      { name: "Invincible", image: "/images/char/invincible.jpeg", meta: "Invincible", note: "Idealism under pressure, damage, recovery, and refusing to become numb." },
      { name: "Dexter Morgan", image: "/images/char/Dexter.jpeg", meta: "Dexter", note: "Routine, secrecy, control, and morality distorted into private code." },
      { name: "Sandor Clegane", image: "/images/char/Sandor Clegane.jpeg", meta: "Game of Thrones", note: "Trauma, blunt honesty, contempt for false nobility, and buried care." },
      { name: "Tyrion Lannister", image: "/images/char/Tyrion Lannister.jpeg", imagePosition: "center 20%", meta: "Game of Thrones", note: "Wit, status injury, political intelligence, and survival through language." },
      { name: "Bronn", image: "/images/char/bronn.jpeg", meta: "Game of Thrones", note: "Pragmatism, self-interest, humor, and refusing romantic political myths." },
      { name: "Daemon Targaryen", image: "/images/char/daemon.jpeg", meta: "House of the Dragon", note: "Charisma, violence, pride, loyalty, and instability in one person." },
      { name: "Baelor Targaryen", image: "/images/char/Baelor.jpeg", meta: "A Knight of the Seven Kingdoms", note: "Principle, restraint, honor, and the burden of being better than the system." },
      { name: "Toph Beifong", image: "/images/char/Toph.jpeg", meta: "Avatar: The Last Airbender", note: "Independence, bluntness, skill, and confidence without needing permission." },
      { name: "Uncle Iroh", image: "/images/char/uncle-iroh-upload.jpg", meta: "Avatar: The Last Airbender", note: "Wisdom, patience, grief, humor, and strength softened by compassion." },
      { name: "Marty Mauser", image: "/images/char/marty mauser.jpeeg", meta: "Marty Supreme", note: "Ambition, ego, humiliation, and chasing significance past good sense." },
      { name: "Michael De Santa", image: "/images/char/michael-de-santa-upload.jpg", imagePosition: "68% center", meta: "Grand Theft Auto V", note: "Retirement, ego, family dysfunction, and trying to escape a life that keeps pulling back." },
      { name: "Wolverine", image: "/images/char/wolverine.jpeg", meta: "X-Men / Marvel", note: "Damage, endurance, rage, protection, and surviving without becoming soft." },
      { name: "Robin", image: "/images/char/Robin.jpeg", meta: "Teen Titans / DC", note: "Loyalty, growth, partnership, and becoming capable beside a larger symbol." },
    ],
  },
];

const projectCards = [
	  {
	    title: "DartBoard",
	    image: "/images/Dartboard.png",
	    imageClassName: "object-center scale-[1.01] group-hover:scale-[1.035]",
	    body: "A stateful AI workspace for saved memories, reusable context, and long-running conversations.",
	    href: "https://github.com/DanielLezh13/DartBoard-public",
	  },
  {
    title: "Habitual",
    image: "/images/start/habitual-preview.png",
    body: "A mobile-first habit tracker focused on fast logging, sleep, and long-term patterns.",
    href: "https://github.com/DanielLezh13/Habitual",
  },
  {
    title: "OneShot-AI",
    image: "/images/start/oneshot-preview.png",
    body: "A stripped-down AI terminal for fresh, isolated prompts without memory or carryover.",
    href: "https://github.com/DanielLezh13/0neShot-AI",
  },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/DanielLezh13",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/daniel-lezhanskiy-8494962b4/",
    icon: "linkedin",
  },
  {
    label: "X",
    href: "https://x.com/StunnersDL",
    icon: "x",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCcxA50gzZdz9Z9QtfXfZtmw",
    icon: "youtube",
  },
  {
    label: "Email",
    href: "mailto:DanielLezhanskiy@gmail.com",
    icon: "email",
  },
];

function SectionHeading({
  body,
  eyebrow,
  title,
}: {
  body: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
        {eyebrow}
      </p>
      <h3 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-stone-50 sm:text-4xl">
        {title}
      </h3>
      <p className="mt-4 max-w-3xl text-base leading-8 text-stone-400">{body}</p>
    </header>
  );
}

function FlipCard({
  card,
}: {
  card: {
    backTitle: string;
    body: string;
    image: string;
    label: string;
    title: string;
  };
}) {
  return (
    <div
      className="group h-[260px] [perspective:1200px]"
      tabIndex={0}
    >
      <div className="relative h-full rounded-lg transition duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] [backface-visibility:hidden]">
          <img
            alt=""
            className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105"
            src={card.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-lg font-semibold text-stone-50">{card.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-100/80">
              {card.label}
            </p>
          </div>
        </div>
        <div className="absolute inset-0 rounded-lg border border-amber-200/20 bg-[#181612] px-4 py-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-base font-semibold leading-6 text-stone-50">
            {card.backTitle}
          </p>
          <p className="mt-4 text-sm leading-6 text-stone-300">{card.body}</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  card,
}: {
  card: {
    body: string;
    title: string;
  };
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] px-4 py-4">
      <p className="text-base font-semibold text-stone-100">{card.title}</p>
      <p className="mt-3 text-sm leading-6 text-stone-400">{card.body}</p>
    </div>
  );
}

type EnjoymentCategoryId = "games" | "movies" | "tv" | "characters";

const enjoymentCategories: {
  id: EnjoymentCategoryId;
  count: number;
  image: string;
  imageClassName?: string;
  imagePosition?: string;
  label: string;
  title: string;
}[] = [
  {
    id: "games",
    count: videoGameCards.length,
    image: "/images/start/categories/games-square.png",
    imageClassName: "scale-[1.2] -translate-x-1.5 -translate-y-3 group-hover:scale-[1.2]",
    imagePosition: "20% 20%",
    label: "Games",
    title: "Gaming",
  },
  {
    id: "movies",
    count: movieCards.length,
    image: "/images/start/categories/movies-square.png",
    imageClassName: "scale-[1.2] translate-x-2.5 translate-y-3 group-hover:scale-[1.2]",
    label: "Movies",
    title: "Movies",
  },
  {
    id: "tv",
    count: tvCards.length,
    image: "/images/start/categories/tv-square.png",
    imageClassName: "scale-[1.2] -translate-x-1.5 translate-y-3 group-hover:scale-[1.2]",
    label: "TV Shows",
    title: "TV Shows",
  },
  {
    id: "characters",
    count: characterGroups.reduce((total, group) => total + group.items.length, 0),
    image: "/images/start/categories/people-square.png",
    imageClassName: "scale-[1.2] translate-x-2 -translate-y-3 group-hover:scale-[1.2]",
    label: "Characters / People",
    title: "People",
  },
];

function EnjoymentArchiveSection() {
  const [selectedCategory, setSelectedCategory] = useState<EnjoymentCategoryId | null>(null);
  const [activeCharacterCard, setActiveCharacterCard] = useState<string | null>(null);
  const [activeMediaCard, setActiveMediaCard] = useState<string | null>(null);
  const activeCategory = enjoymentCategories.find((category) => category.id === selectedCategory);

  useEffect(() => {
    movieCards.forEach((movie) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = movie.image;
    });
  }, []);

  useEffect(() => {
    const characterImages = characterGroups.flatMap((group) =>
      group.items.map((item) => item.image),
    );
    let imageIndex = 0;

    const preloadTimer = window.setInterval(() => {
      for (let batchIndex = 0; batchIndex < 4 && imageIndex < characterImages.length; batchIndex += 1) {
        const image = new window.Image();
        image.decoding = "async";
        image.src = characterImages[imageIndex];
        imageIndex += 1;
      }

      if (imageIndex >= characterImages.length) {
        window.clearInterval(preloadTimer);
      }
    }, 120);

    return () => window.clearInterval(preloadTimer);
  }, []);

  useEffect(() => {
    setActiveCharacterCard(null);
    setActiveMediaCard(null);
  }, [selectedCategory]);

  return (
    <section className="scroll-reveal mt-24 rounded-[2rem] border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-7 lg:px-8">
      <SectionHeading
        eyebrow="Part 2"
        title="Things I Enjoy"
        body="A collection of games, films, shows, characters, and people that mattered to me in some way."
      />
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
        Select a category. Click any card to flip it for a short summary.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {enjoymentCategories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              aria-pressed={isSelected}
              className={[
                "group relative aspect-square overflow-hidden rounded-lg border bg-[#12110f] transition duration-300",
                isSelected
                  ? "border-amber-200/70 shadow-[0_0_0_1px_rgba(253,230,138,0.35),0_22px_70px_rgba(253,230,138,0.16)]"
                  : "border-white/10 hover:-translate-y-1 hover:border-amber-200/35 hover:shadow-[0_18px_50px_rgba(0,0,0,0.32)]",
              ].join(" ")}
              key={category.id}
              onClick={() =>
                setSelectedCategory((current) =>
                  current === category.id ? null : category.id,
                )
              }
              type="button"
            >
              <img
                alt={category.label}
                className={[
                  "h-full w-full object-cover transition duration-500",
                  category.imageClassName ??
                    (isSelected ? "scale-[1.015]" : "group-hover:scale-[1.015]"),
                ].join(" ")}
                decoding="async"
                loading="lazy"
                src={category.image}
                style={{ objectPosition: category.imagePosition ?? "center" }}
              />
              <span className="sr-only">
                {category.title}, {category.count} {category.count === 1 ? "entry" : "entries"}
              </span>
            </button>
          );
        })}
      </div>

      {activeCategory ? (
        <section className="mt-5 overflow-hidden rounded-lg border border-amber-200/20 bg-amber-200/[0.035]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
                Selected
              </p>
              <h4 className="mt-1 text-xl font-semibold text-stone-50">
                {activeCategory.label}
              </h4>
            </div>
            <button
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-stone-300 transition hover:border-white/30 hover:text-stone-50"
              onClick={() => setSelectedCategory(null)}
              type="button"
            >
              Close
            </button>
          </div>

          <div className="px-5 pb-5 pt-5">
            {selectedCategory === "characters" ? (
              <div className="space-y-6">
                {characterGroups.map((group) => (
                  <section key={group.title}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
                      {group.title}
                    </p>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {group.items.map((item) => (
                        <CharacterFlipCard
                          isFlipped={activeCharacterCard === item.name}
                          item={item}
                          key={item.name}
                          onFlip={() =>
                            setActiveCharacterCard((current) =>
                              current === item.name ? null : item.name,
                            )
                          }
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {(selectedCategory === "games"
                  ? videoGameCards
                  : selectedCategory === "movies"
                    ? movieCards
                    : tvCards
                ).map((item) => (
                  <FlipMediaCard
                    isFlipped={activeMediaCard === item.title}
                    item={item}
                    key={item.title}
                    onFlip={() =>
                      setActiveMediaCard((current) =>
                        current === item.title ? null : item.title,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function CharacterFlipCard({
  isFlipped,
  item,
  onFlip,
}: {
  isFlipped: boolean;
  item: {
    image: string;
    imageClassName?: string;
    imagePosition?: string;
    meta?: string;
    name: string;
    note: string;
  };
  onFlip: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <button
      aria-pressed={isFlipped}
      className="group h-[250px] text-left [content-visibility:auto] [contain-intrinsic-size:250px] [perspective:1200px]"
      onClick={onFlip}
      type="button"
    >
      <span
        className={`relative block h-full rounded-lg transition duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <span className="absolute inset-0 overflow-hidden rounded-lg border border-white/10 bg-[#12110f] [backface-visibility:hidden]">
          <span
            aria-hidden="true"
            className={[
              "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,230,138,0.08),transparent_62%),#12110f] transition-opacity duration-500",
              imageLoaded ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />
          <img
            alt=""
            className={[
              "h-full w-full object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-95" : "opacity-0",
              item.imageClassName ?? "",
            ].join(" ")}
            decoding="async"
            loading="lazy"
            onError={() => setImageLoaded(true)}
            onLoad={() => setImageLoaded(true)}
            src={item.image}
            style={{ objectPosition: item.imagePosition ?? "center" }}
          />
          <span className="absolute inset-x-0 bottom-0 block border-t border-white/10 bg-[#181612]/95 px-4 py-3 shadow-[0_-12px_28px_rgba(0,0,0,0.24)]">
            <span className="line-clamp-2 block min-h-6 text-base font-semibold leading-6 text-stone-50">
              {item.name}
            </span>
          </span>
        </span>
        <span className="absolute inset-0 block rounded-lg border border-amber-200/20 bg-[#181612] px-4 py-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
            Character / Person
          </span>
          <span className="block text-base font-semibold leading-6 text-stone-50">
            {item.name}
          </span>
          {item.meta ? (
            <span className="mt-2 block text-xs font-medium leading-5 text-amber-100/70">
              {item.meta}
            </span>
          ) : null}
          <span className="mt-4 block text-sm leading-6 text-stone-300">
            {item.note}
          </span>
        </span>
      </span>
    </button>
  );
}

function FlipMediaCard({
  isFlipped,
  item,
  onFlip,
}: {
  isFlipped: boolean;
  item: {
    image: string;
    imageClassName?: string;
    imagePosition?: string;
    summary: string;
    title: string;
    year: number | string;
  };
  onFlip: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <button
      aria-pressed={isFlipped}
      className="group h-[250px] text-left [content-visibility:auto] [contain-intrinsic-size:250px] [perspective:1200px]"
      onClick={onFlip}
      type="button"
    >
      <span
        className={`relative block h-full rounded-lg transition duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <span className="absolute inset-0 overflow-hidden rounded-lg border border-white/10 bg-[#12110f] [backface-visibility:hidden]">
          <span
            aria-hidden="true"
            className={[
              "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,230,138,0.08),transparent_62%),#12110f] transition-opacity duration-500",
              imageLoaded ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />
          <img
            alt=""
            className={[
              "h-full w-full object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-95" : "opacity-0",
              item.imageClassName ?? "",
            ].join(" ")}
            decoding="async"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            src={item.image}
            style={{ objectPosition: item.imagePosition ?? "center" }}
          />
          <span className="absolute inset-x-0 bottom-0 block border-t border-white/10 bg-[#181612]/95 px-4 py-3 shadow-[0_-12px_28px_rgba(0,0,0,0.24)]">
            <span className="line-clamp-2 block min-h-6 text-base font-semibold leading-6 text-stone-50">
              {item.title}
            </span>
          </span>
        </span>
        <span className="absolute inset-0 block rounded-lg border border-amber-200/20 bg-[#181612] px-4 py-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
            {typeof item.year === "number" ? "Released" : "Years"} {item.year}
          </span>
          <span className="mt-3 block text-base font-semibold leading-6 text-stone-50">
            {item.title}
          </span>
          <span className="mt-4 block text-sm leading-6 text-stone-300">
            {item.summary}
          </span>
        </span>
      </span>
    </button>
  );
}

function SocialBubble({
  link,
}: {
  link: {
    href: string;
    icon: string;
    label: string;
  };
}) {
  return (
    <a
      aria-label={link.label}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-stone-100 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:scale-105 hover:border-amber-200/35 hover:bg-amber-200/10 hover:shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
      href={link.href}
      rel="noreferrer"
      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
      title={link.label}
    >
      <SocialIcon icon={link.icon} />
    </a>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "github") {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.09.68-.22.68-.49v-1.8c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.27 9.27 0 0 1 12 7.03c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.73c0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.94 8.98H3.7v11.04h3.24V8.98ZM5.32 3.5a1.88 1.88 0 1 0 0 3.76 1.88 1.88 0 0 0 0-3.76Zm14.98 10.2c0-3.42-1.83-5.02-4.27-5.02-1.97 0-2.85 1.08-3.34 1.84V8.98H9.58v11.04h3.24v-5.46c0-1.46.28-2.88 2.09-2.88 1.78 0 1.8 1.67 1.8 2.97v5.37h3.24l.35-6.32Z" />
      </svg>
    );
  }

  if (icon === "x") {
    return (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.9 10.47 21.35 2h-1.76l-6.47 7.35L7.96 2H2l7.81 11.12L2 22h1.76l6.83-7.76L16.04 22H22l-8.1-11.53Zm-2.42 2.74-.79-1.1L4.4 3.3h2.72l5.08 7.12.79 1.1 6.6 9.24h-2.72l-5.39-7.55Z" />
      </svg>
    );
  }

  if (icon === "youtube") {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.58 7.19a2.57 2.57 0 0 0-1.81-1.82C18.17 4.94 12 4.94 12 4.94s-6.17 0-7.77.43A2.57 2.57 0 0 0 2.42 7.2 26.7 26.7 0 0 0 2 12a26.7 26.7 0 0 0 .42 4.81 2.57 2.57 0 0 0 1.81 1.82c1.6.43 7.77.43 7.77.43s6.17 0 7.77-.43a2.57 2.57 0 0 0 1.81-1.82A26.7 26.7 0 0 0 22 12a26.7 26.7 0 0 0-.42-4.81ZM10 15.05v-6.1L15.2 12 10 15.05Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 24 24" fill="none">
      <rect x="4.75" y="6.75" width="14.5" height="10.5" rx="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="m5.25 7.25 6.75 5 6.75-5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ProjectCard({
  project,
}: {
  project: {
    body: string;
    href: string;
    image: string;
    imageClassName?: string;
    title: string;
  };
}) {
  return (
    <a
      className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.025] transition hover:border-amber-200/30 hover:bg-white/[0.045]"
      href={project.href}
      rel="noreferrer"
      target="_blank"
    >
      <div className="aspect-[16/10] overflow-hidden bg-[#111827]">
        <img
          alt=""
          className={[
            "h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]",
            project.imageClassName ?? "",
          ].join(" ")}
          decoding="async"
          loading="lazy"
          src={project.image}
        />
      </div>
      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-center text-base font-semibold text-stone-100">{project.title}</p>
        <p className="mt-2 text-center text-sm leading-6 text-stone-400">{project.body}</p>
      </div>
    </a>
  );
}

function FortniteSection() {
  return (
    <section className="scroll-reveal mt-24 min-h-[82vh] rounded-[2rem] border border-white/10 bg-white/[0.025] px-5 py-8 sm:px-7 lg:px-8">
      <SectionHeading
        eyebrow="Part 4"
        title="Fortnite"
        body="Fortnite became the game that stayed mentally engaging long term because it turns combat into real-time environment manipulation, pressure, prediction, and fast adaptation."
      />

      <div className="mt-8 rounded-[1.5rem] border border-amber-200/15 bg-amber-200/[0.045] px-5 py-5 sm:px-6 sm:py-6">
        <div className="space-y-5 text-base leading-8 text-stone-200">
          <p>
            Fortnite has probably been the game I have spent the most time on over the last few years. Before it, I went through phases with chess, Call of Duty, and a lot of other games in between, but Fortnite was the one that stayed mentally engaging long term. I accumulated over 1300 wins over time playing regular online matches, while also spending a large amount of time in creative 1v1 build fights because that was always the part of the game I found most interesting mechanically.
          </p>
          <p>
            I still competed occasionally, placing 611th in a Solo Cash Cup and 274th in a Duo Contender Hype Cup, but I never fully committed once support shifted away from NA East toward NA Central servers.
          </p>
          <p>
            What kept the game interesting to me was not just that it was fast-paced. The real difference is that Fortnite transforms combat into real-time environment manipulation. In most shooters, the map is mostly static. Cover already exists. Angles are predefined. In Fortnite, players create and destroy the battlefield itself while fighting. The environment continuously changes every second depending on positioning, pressure, edits, movement, and prediction.
          </p>
          <p>
            At higher levels, fights become less about raw aim alone and more about spatial control, timing, momentum, adaptation, psychological pressure, and forcing reactions under uncertainty. A fight can become about taking space, denying space, interrupting tempo, creating right-hand peeks, conditioning expectations, reading habits, predicting movement, and deciding when to overwhelm versus disengage.
          </p>
          <p>
            That overlap between mechanics, strategy, movement, psychology, creativity, and rapid decision-making is what made Fortnite feel fundamentally different from most games I played before it. The interaction density is unusually high. Inputs matter. Positioning matters. Timing matters. Confidence matters. Momentum matters.
          </p>
          <p>
            In a weird way, the game also overlaps with a lot of the broader themes explored throughout this project: adaptation under uncertainty, recursive prediction, real-time model updating, bounded systems, and rapid feedback loops.
          </p>
          <p>
            Below are my stats and a few random clips from creative fights and gameplay over time.
          </p>
        </div>

        <div className="mt-6 flex justify-center border-t border-white/10 pt-5">
          <a
            className="inline-flex rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-sm font-medium text-amber-50 transition hover:border-amber-200/45 hover:bg-amber-200/15"
            href="https://fortnitetracker.com/profile/all/StunnersDL"
            rel="noreferrer"
            target="_blank"
          >
            Fortnite Stat Tracker
          </a>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 shadow-[0_24px_90px_rgba(0,0,0,0.32)]">
          <video
            className="aspect-video w-full bg-black object-contain"
            controls
            preload="metadata"
            src="/images/Char/Highlights.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="border-t border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-stone-100">Highlights</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">
              Creative fights and gameplay clips.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotographySection() {
  const [photoProgress, setPhotoProgress] = useState(0);
  const photoProgressRef = useRef(0);
  const activeIndex = wrapIndex(Math.round(photoProgress), photographyImageUrls.length);

  function setPhotoProgressValue(nextProgress: number) {
    const total = photographyImageUrls.length;
    const normalizedProgress = total > 0 ? ((nextProgress % total) + total) % total : 0;
    photoProgressRef.current = normalizedProgress;
    setPhotoProgress(normalizedProgress);
  }

  function cyclePhoto(direction: number) {
    setPhotoProgressValue(Math.round(photoProgressRef.current) + direction);
  }

  function getPhotoOffset(index: number) {
    const total = photographyImageUrls.length;
    const half = Math.floor(total / 2);
    let offset = index - photoProgress;

    if (offset > half) {
      offset -= total;
    }

    if (offset < -half) {
      offset += total;
    }

    return offset;
  }

  return (
    <section className="scroll-reveal daniel-gradient-panel mt-24 min-h-[78vh] overflow-hidden rounded-[2rem] border border-amber-200/15 px-5 py-8 shadow-[0_32px_130px_rgba(0,0,0,0.35)] sm:px-7 lg:px-8">
      <SectionHeading
        eyebrow="Part 3"
        title="Photography"
        body="A small visual reel from photos I have taken. It fits here because composition and attention are part of how I think, not just how the site looks."
      />

      <div className="mt-8 rounded-[1.5rem] border border-amber-200/20 bg-black/20 px-3 py-5 sm:px-5">
        <div className="relative">
          <button
            aria-label="Previous photo"
            className="absolute -left-4 top-1/2 z-30 inline-flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.18),rgba(253,230,138,0.11)_44%,rgba(18,17,15,0.78)_100%)] text-amber-50 shadow-[0_16px_36px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur transition hover:-translate-y-[calc(50%+2px)] hover:border-amber-200/40 hover:bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.24),rgba(253,230,138,0.16)_44%,rgba(18,17,15,0.72)_100%)] sm:-left-3"
            onClick={() => cyclePhoto(-1)}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
            </svg>
          </button>

          <div
            aria-label="Photography carousel"
            className="relative mx-14 h-[280px] overflow-visible rounded-lg outline-none [perspective:1400px] sm:mx-20 sm:h-[350px]"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                cyclePhoto(-1);
              }

              if (event.key === "ArrowRight") {
                event.preventDefault();
                cyclePhoto(1);
              }
            }}
          >
            {photographyImageUrls.map((imageUrl, index) => {
              const offset = getPhotoOffset(index);
              const distance = Math.abs(offset);
              const isVisible = distance <= 3;
              const stagedOffset = clamp(offset, -2.35, 2.35);
              const stagedDistance = Math.abs(stagedOffset);
              const edgeSign = stagedOffset < 0 ? -1 : 1;
              const translateX = stagedOffset * 45;
              const rotateY = edgeSign * interpolateStops(stagedDistance, [
                [0, 0],
                [1, 28],
                [2, 56],
                [2.35, 72],
              ]);
              const scale = interpolateStops(stagedDistance, [
                [0, 1],
                [1, 0.84],
                [2, 0.7],
                [2.35, 0.58],
              ]);
              const translateZ = interpolateStops(stagedDistance, [
                [0, 72],
                [1, 16],
                [2, -34],
                [2.35, -118],
              ]);
              const itemOpacity = interpolateStops(distance, [
                [0, 1],
                [2.45, 1],
                [3, 0],
              ]);

              return (
                <button
                  aria-label={`View photo ${index + 1}`}
                  aria-pressed={activeIndex === index}
                  className={[
                    "absolute left-1/2 top-1/2 aspect-[4/3] w-[min(76%,420px)] rounded-lg border bg-[#12110f] p-0 shadow-[0_18px_60px_rgba(0,0,0,0.24)] transition duration-300",
                    activeIndex === index
                      ? "border-amber-200/70 ring-1 ring-amber-200/30"
                      : "border-white/10",
                  ].join(" ")}
                  key={imageUrl}
                  onClick={() => setPhotoProgressValue(photoProgressRef.current + offset)}
                  style={{
                    opacity: isVisible ? itemOpacity : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                    transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex: isVisible ? 100 - Math.round(stagedDistance * 10) : 0,
                  }}
                  type="button"
                >
                  <img
                    alt={`Photography sample ${index + 1}`}
                    className="h-full w-full rounded-[7px] object-cover"
                    decoding="async"
                    loading={distance <= 1 ? "eager" : "lazy"}
                    src={imageUrl}
                  />
                </button>
              );
            })}
          </div>

          <button
            aria-label="Next photo"
            className="absolute -right-4 top-1/2 z-30 inline-flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.18),rgba(253,230,138,0.11)_44%,rgba(18,17,15,0.78)_100%)] text-amber-50 shadow-[0_16px_36px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur transition hover:-translate-y-[calc(50%+2px)] hover:border-amber-200/40 hover:bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.24),rgba(253,230,138,0.16)_44%,rgba(18,17,15,0.72)_100%)] sm:-right-3"
            onClick={() => cyclePhoto(1)}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Photo {activeIndex + 1} of {photographyImageUrls.length}
        </p>
      </div>
    </section>
  );
}

function wrapIndex(index: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return ((index % total) + total) % total;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function interpolateStops(value: number, stops: [number, number][]) {
  if (value <= stops[0][0]) {
    return stops[0][1];
  }

  for (let index = 1; index < stops.length; index += 1) {
    const [stopValue, stopOutput] = stops[index];
    const [previousValue, previousOutput] = stops[index - 1];

    if (value <= stopValue) {
      const progress = (value - previousValue) / (stopValue - previousValue);
      return previousOutput + (stopOutput - previousOutput) * progress;
    }
  }

  return stops[stops.length - 1][1];
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

function CategorySectionGroups({
  eyebrow,
  groups,
  intro,
  title,
}: {
  eyebrow: string;
  groups: ReadingSectionGroup[];
  intro: string;
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

      <div className="space-y-24">
        {groups.map((group) => (
          <section key={group.id} className="scroll-mt-16">
            <header className="mb-8 rounded-lg border border-amber-200/15 bg-amber-200/[0.04] px-5 py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
                Economics
              </p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-stone-50">
                {group.label}
              </h3>
            </header>
            <div className="space-y-20">
              {group.children.map((section) => (
                <ReadingSubsection key={section.id} section={section} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

const placeholderContent: Record<
  Exclude<ContentView, "start" | "religion" | "politics" | "economics">,
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
  activeView: Exclude<ContentView, "start" | "religion" | "politics" | "economics">;
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

type StructureDiagramConfig = {
  description?: string;
  items: {
    detail: string;
    title: string;
  }[];
  label: string;
  title: string;
  variant?: "balance" | "flow" | "grid" | "ladder" | "stack";
};

const structureDiagramsBySection: Record<string, StructureDiagramConfig> = {
  "philosophy-core-orientation": {
    label: "Chapter Map",
    title: "Where the philosophy chapter goes next",
    variant: "grid",
    items: [
      {
        title: "Reality",
        detail: "Metaphysics asks what kind of world humans are inside.",
      },
      {
        title: "Knowledge",
        detail: "Epistemology asks what confidence the evidence can responsibly carry.",
      },
      {
        title: "Action",
        detail: "Ethics asks how to act when values, harm, and uncertainty collide.",
      },
      {
        title: "Society",
        detail: "Political philosophy asks how groups organize power, conflict, and stability.",
      },
      {
        title: "Mind",
        detail: "Philosophy of mind asks what kind of conscious system is doing the interpreting.",
      },
      {
        title: "Meaning",
        detail: "Existential sections ask how humans orient themselves without final guarantees.",
      },
    ],
  },
  "philosophy-metaphysics": {
    label: "Access Stack",
    title: "Operational reality is not the same as final metaphysical access",
    variant: "flow",
    items: [
      {
        title: "External Reality",
        detail: "There is likely a world independent of human interpretation.",
      },
      {
        title: "Human Filters",
        detail: "Embodiment, perception, cognition, memory, and language shape access.",
      },
      {
        title: "Mental Model",
        detail: "Humans build representations that can be reliable without being total.",
      },
      {
        title: "Operational Truth",
        detail: "Some models work extremely well inside experience and practical reality.",
      },
      {
        title: "Ultimate Unknown",
        detail: "Deeper metaphysical structure can remain unresolved without making action impossible.",
      },
    ],
  },
  "philosophy-epistemology": {
    label: "Confidence Ladder",
    title: "Evidence should move confidence by degrees",
    variant: "ladder",
    items: [
      {
        title: "Possible",
        detail: "The claim is coherent enough to consider.",
      },
      {
        title: "Plausible",
        detail: "Some evidence or pattern points toward it.",
      },
      {
        title: "Supported",
        detail: "Multiple lines of evidence survive basic pressure.",
      },
      {
        title: "Strong Confidence",
        detail: "Alternative explanations become weaker or less complete.",
      },
      {
        title: "Near Certainty",
        detail: "The support is strong, repeatable, constrained, and hard to replace.",
      },
    ],
  },
  "philosophy-ethics": {
    label: "Moral Balance",
    title: "The section sits between two failure modes",
    variant: "balance",
    items: [
      {
        title: "Too Rigid",
        detail: "Rules become detached from context, suffering, scale, and human complexity.",
      },
      {
        title: "Constrained Orientation",
        detail: "Stable principles guide action while leaving room for context and revision.",
      },
      {
        title: "Too Flexible",
        detail: "Judgment dissolves into rationalization, inconsistency, and unstable standards.",
      },
    ],
  },
  "philosophy-political-philosophy": {
    label: "Conflict Stack",
    title: "A cleaner way to analyze political conflict",
    variant: "stack",
    items: [
      {
        title: "Side A From Inside",
        detail: "Model the fear, history, identity, and justification structure.",
      },
      {
        title: "Side B From Inside",
        detail: "Apply the same internal modeling to the opposing side.",
      },
      {
        title: "Structural Forces",
        detail: "Look at incentives, escalation loops, propaganda, power, and path dependence.",
      },
      {
        title: "Moral Limits",
        detail: "Explanation is not endorsement, and complexity is not equivalence.",
      },
      {
        title: "Provisional Stance",
        detail: "Form a constrained position without pretending the whole conflict is solved.",
      },
    ],
  },
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
  "philosophy-core-orientation": "Orientation vs. Final System",
  "philosophy-metaphysics": "Operational Reality vs. Ultimate Reality",
  "philosophy-epistemology": "Proportional Confidence vs. Forced Certainty",
  "philosophy-ethics": "Moral Action vs. Moral Overclaim",
  "philosophy-political-philosophy": "Cohesion vs. Adaptive Variation",
  "philosophy-mind": "Felt Experience vs. Functional Processing",
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
  "philosophy-core-orientation":
    "The chapter begins with one posture: usable orientation under uncertainty.",
  "philosophy-metaphysics":
    "Humans can build reliable operational models without possessing final access to reality itself.",
  "philosophy-epistemology":
    "The question is not only whether evidence points somewhere, but how much confidence it can carry.",
  "philosophy-ethics":
    "Moral reasoning has to preserve action without pretending complexity has disappeared.",
  "philosophy-political-philosophy":
    "Political judgment has to understand internal perspectives without becoming captured by them.",
  "philosophy-mind":
    "Consciousness may be layered rather than a single on/off switch.",
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

function StructureDiagram({ diagram }: { diagram: StructureDiagramConfig }) {
  const gridClassName =
    diagram.variant === "balance"
      ? "grid gap-3 md:grid-cols-3"
      : diagram.variant === "grid"
        ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
        : "grid gap-3 md:grid-cols-5";

  return (
    <section className="mt-8 rounded-xl border border-amber-200/15 bg-[linear-gradient(135deg,rgba(253,230,138,0.055),rgba(255,255,255,0.018))] px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.14)]">
      <div className="mb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
          {diagram.label}
        </p>
        <h4 className="mt-2 text-lg font-semibold leading-7 text-stone-100">
          {diagram.title}
        </h4>
        {diagram.description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">
            {diagram.description}
          </p>
        ) : null}
      </div>

      <div className={gridClassName}>
        {diagram.items.map((item, index) => (
          <div
            className={[
              "relative rounded-lg border px-3 py-3",
              diagram.variant === "balance" && index === 1
                ? "border-amber-200/35 bg-amber-200/[0.085]"
                : "border-white/10 bg-black/10",
            ].join(" ")}
            key={item.title}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-amber-200/20 bg-amber-200/10 text-[11px] font-semibold text-amber-100">
                {index + 1}
              </span>
              <p className="text-sm font-semibold leading-5 text-stone-100">
                {item.title}
              </p>
            </div>
            <p className="text-xs leading-5 text-stone-400">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConsciousnessGradientDiagram() {
  return (
    <section className="overflow-hidden rounded-xl border border-amber-200/15 bg-[linear-gradient(135deg,rgba(253,230,138,0.05),rgba(255,255,255,0.018))] px-3 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.16)] sm:px-4 sm:py-4">
      <div className="mb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
          Visual Synthesis
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">
          A compact map of the gradient described above, from embodied responsiveness toward recursive self/world modeling.
        </p>
      </div>

      <figure className="overflow-hidden rounded-lg border border-amber-200/15 bg-black/35 shadow-[0_26px_90px_rgba(0,0,0,0.32)]">
        <img
          alt="Consciousness as Layered Adaptive Integration diagram"
          className="w-full object-contain"
          decoding="async"
          loading="lazy"
          src="/images/philosophy/consciousness-layered-adaptive-integration.png"
        />
      </figure>
    </section>
  );
}

type ConsciousnessNodeId =
  | "embodiment"
  | "sensation"
  | "emotion"
  | "attention"
  | "memory"
  | "prediction"
  | "social"
  | "identity"
  | "language"
  | "recursion"
  | "existential";

type ConsciousnessProfileId =
  | "bacteria"
  | "ant"
  | "fish"
  | "dog"
  | "crow"
  | "chimp"
  | "human"
  | "ai";

const consciousnessWebNodes: Array<{
  description: string;
  id: ConsciousnessNodeId;
  label: string;
  x: number;
  y: number;
}> = [
  {
    description: "Self-maintenance, bodily constraint, vulnerability, and interaction with a real environment.",
    id: "embodiment",
    label: "Embodiment",
    x: 50,
    y: 86,
  },
  {
    description: "Immediate sensory contact with the environment.",
    id: "sensation",
    label: "Sensation",
    x: 24,
    y: 70,
  },
  {
    description: "Adaptive significance: fear, attachment, pain, reward, and motivational weighting.",
    id: "emotion",
    label: "Emotion",
    x: 76,
    y: 70,
  },
  {
    description: "Selective focus that determines which signals dominate the system.",
    id: "attention",
    label: "Attention",
    x: 50,
    y: 59,
  },
  {
    description: "Past experience shaping present interpretation and future expectation.",
    id: "memory",
    label: "Memory",
    x: 22,
    y: 45,
  },
  {
    description: "Anticipating future states, risk, opportunity, and likely outcomes.",
    id: "prediction",
    label: "Prediction",
    x: 78,
    y: 45,
  },
  {
    description: "Modeling other agents, attachment, status, cooperation, and threat.",
    id: "social",
    label: "Social Model",
    x: 50,
    y: 35,
  },
  {
    description: "A continuing self-model organized through memory, body, role, and narrative.",
    id: "identity",
    label: "Identity",
    x: 27,
    y: 22,
  },
  {
    description: "Symbolic compression through language, concepts, categories, and shared meaning.",
    id: "language",
    label: "Language",
    x: 73,
    y: 22,
  },
  {
    description: "The system modeling itself, its models, and the limits of its models.",
    id: "recursion",
    label: "Recursion",
    x: 50,
    y: 12,
  },
  {
    description: "Mortality, meaning, cosmic uncertainty, and consciousness examining existence.",
    id: "existential",
    label: "Existential",
    x: 50,
    y: 4,
  },
];

const consciousnessProfiles: Array<{
  id: ConsciousnessProfileId;
  label: string;
  note: string;
  weights: Record<ConsciousnessNodeId, number>;
}> = [
  {
    id: "bacteria",
    label: "Bacteria",
    note: "Strong self-maintenance and environmental response, with little reason to infer integrated subjective modeling.",
    weights: {
      attention: 0.06,
      embodiment: 0.72,
      emotion: 0.04,
      existential: 0,
      identity: 0.03,
      language: 0,
      memory: 0.12,
      prediction: 0.08,
      recursion: 0,
      sensation: 0.18,
      social: 0.02,
    },
  },
  {
    id: "ant",
    label: "Ant",
    note: "Embodied response, sensation, chemical signaling, and colony coordination become more visible.",
    weights: {
      attention: 0.26,
      embodiment: 0.78,
      emotion: 0.2,
      existential: 0,
      identity: 0.08,
      language: 0.03,
      memory: 0.28,
      prediction: 0.22,
      recursion: 0.02,
      sensation: 0.5,
      social: 0.48,
    },
  },
  {
    id: "fish",
    label: "Fish",
    note: "Navigation, sensation, pain response, memory, and prediction become more integrated.",
    weights: {
      attention: 0.42,
      embodiment: 0.82,
      emotion: 0.42,
      existential: 0,
      identity: 0.16,
      language: 0.02,
      memory: 0.45,
      prediction: 0.42,
      recursion: 0.03,
      sensation: 0.68,
      social: 0.28,
    },
  },
  {
    id: "dog",
    label: "Dog",
    note: "Attachment, emotion, social awareness, memory, and prediction become strongly connected.",
    weights: {
      attention: 0.62,
      embodiment: 0.88,
      emotion: 0.82,
      existential: 0.02,
      identity: 0.42,
      language: 0.15,
      memory: 0.68,
      prediction: 0.6,
      recursion: 0.1,
      sensation: 0.76,
      social: 0.78,
    },
  },
  {
    id: "crow",
    label: "Crow",
    note: "Problem-solving, memory, social intelligence, tool behavior, and flexible prediction become prominent.",
    weights: {
      attention: 0.7,
      embodiment: 0.82,
      emotion: 0.62,
      existential: 0.03,
      identity: 0.46,
      language: 0.2,
      memory: 0.78,
      prediction: 0.74,
      recursion: 0.18,
      sensation: 0.72,
      social: 0.72,
    },
  },
  {
    id: "chimp",
    label: "Chimp",
    note: "Social modeling, memory, planning, identity-continuity, and proto-symbolic behavior become dense.",
    weights: {
      attention: 0.76,
      embodiment: 0.9,
      emotion: 0.78,
      existential: 0.08,
      identity: 0.62,
      language: 0.34,
      memory: 0.78,
      prediction: 0.76,
      recursion: 0.32,
      sensation: 0.78,
      social: 0.86,
    },
  },
  {
    id: "human",
    label: "Human",
    note: "Language, symbolic abstraction, identity, recursion, and existential modeling become civilization-scale.",
    weights: {
      attention: 0.82,
      embodiment: 0.9,
      emotion: 0.84,
      existential: 0.94,
      identity: 0.9,
      language: 0.96,
      memory: 0.88,
      prediction: 0.9,
      recursion: 0.96,
      sensation: 0.78,
      social: 0.92,
    },
  },
  {
    id: "ai",
    label: "AI",
    note: "Symbolic pattern modeling can be strong while embodied vulnerability and felt significance remain uncertain.",
    weights: {
      attention: 0.7,
      embodiment: 0.08,
      emotion: 0.08,
      existential: 0.24,
      identity: 0.28,
      language: 0.96,
      memory: 0.72,
      prediction: 0.82,
      recursion: 0.7,
      sensation: 0.06,
      social: 0.58,
    },
  },
];

const consciousnessLayerOrder: ConsciousnessNodeId[] = [
  "embodiment",
  "sensation",
  "emotion",
	  "attention",
	  "memory",
	  "prediction",
	  "language",
	  "social",
	  "identity",
	  "recursion",
	  "existential",
	];

const consciousnessProfileDetails: Record<
  ConsciousnessProfileId,
	  {
	    caution: string;
	    image: string;
	    imageTransform: string;
	    reading: string;
	    stage: string;
	    type: string;
	  }
	> = {
	  ai: {
	    caution: "High symbolic modeling does not prove felt experience.",
	    image: "/images/philosophy/consciousness-pets/ai.png",
	    imageTransform: "translate(0px, 0px) scale(1)",
	    reading: "AI sits strangely in the model: strong in language, memory-like retrieval, prediction, and symbolic patterning, but weak or unresolved in embodiment, vulnerability, sensation, and felt significance.",
	    stage: "Inverted Abstraction",
	    type: "Artificial Pattern System",
	  },
	  ant: {
	    caution: "Strong coordination does not imply rich reflective awareness.",
	    image: "/images/philosophy/consciousness-pets/ant.png",
	    imageTransform: "translate(0px, 0px) scale(1)",
	    reading: "The ant profile emphasizes embodied action, sensation, chemical signaling, and social coordination. The interesting question is how much intelligence belongs to the individual organism versus the colony-scale system.",
	    stage: "Colony-Level Adaptation",
	    type: "Social Invertebrate",
	  },
	  bacteria: {
	    caution: "Adaptive responsiveness is not the same as subjective experience.",
	    image: "/images/philosophy/consciousness-pets/bacteria.png",
	    imageTransform: "translate(0px, 0px) scale(1)",
	    reading: "Bacteria represent the lower edge of the gradient: self-maintenance, environmental response, repair, movement, and survival regulation without much reason to infer integrated felt experience.",
	    stage: "Embodied Responsiveness",
	    type: "Cellular Life",
	  },
	  chimp: {
	    caution: "Rich social cognition still differs from human symbolic recursion.",
	    image: "/images/philosophy/consciousness-pets/chimp.png",
	    imageTransform: "translate(0px, 0px) scale(1)",
	    reading: "Chimpanzees sit close to the human side of the gradient through memory, emotion, planning, dominance tracking, social intelligence, tool use, and recognizable identity continuity.",
	    stage: "Primate World-Modeling",
	    type: "Great Ape",
	  },
	  crow: {
	    caution: "Tool use and memory suggest complex modeling without human language.",
	    image: "/images/philosophy/consciousness-pets/crow.png",
	    imageTransform: "translate(0px, 0px) scale(1)",
	    reading: "Crows make the gradient feel less linear. They show flexible problem-solving, memory, social learning, and tool behavior without looking like a smaller version of human consciousness.",
	    stage: "Flexible World-Modeling",
	    type: "Corvid Cognition",
	  },
	  dog: {
	    caution: "Attachment and emotion are strong without deep symbolic abstraction.",
	    image: "/images/philosophy/consciousness-pets/dog.png",
	    imageTransform: "translate(0px, 0px) scale(1)",
	    reading: "Dogs make emotional consciousness easy to notice: attachment, trust, fear, anticipation, social reading, and memory are prominent even without human-style symbolic abstraction.",
	    stage: "Social-Emotional Modeling",
	    type: "Mammalian Companion",
	  },
	  fish: {
	    caution: "Pain, navigation, and memory may exist without reflective identity.",
	    image: "/images/philosophy/consciousness-pets/fish.png",
	    imageTransform: "translate(0px, 0px) scale(1)",
	    reading: "Fish sit in the middle of the early experiential range: sensation, navigation, pain response, memory, and prediction become more integrated than simple responsiveness alone.",
	    stage: "Sensorimotor Experience",
	    type: "Aquatic Vertebrate",
	  },
	  human: {
	    caution: "Recursive self-awareness creates meaning, anxiety, abstraction, and distortion.",
	    image: "/images/philosophy/consciousness-pets/human.png",
	    imageTransform: "translate(0px, 0px) scale(1)",
	    reading: "Humans mark the highest known point in this model because symbolic language, identity, civilization, long-term planning, mortality awareness, and consciousness reflecting on itself converge.",
	    stage: "Existential Recursion",
	    type: "Symbolic Primate",
	  },
	};

const consciousnessStatGroups: Array<{
  label: string;
  nodeIds: ConsciousnessNodeId[];
}> = [
  {
    label: "Embodied",
    nodeIds: ["embodiment", "sensation", "emotion"],
  },
  {
    label: "Modeling",
    nodeIds: ["attention", "memory", "prediction"],
  },
  {
    label: "Social Self",
    nodeIds: ["social", "identity"],
  },
  {
    label: "Symbolic",
    nodeIds: ["language", "recursion", "existential"],
  },
];

function ConsciousnessSystemsExplorer() {
  const [activeProfileId, setActiveProfileId] =
    useState<ConsciousnessProfileId>("human");
  const [activeNodeId, setActiveNodeId] =
    useState<ConsciousnessNodeId>("recursion");
  const activeProfile =
    consciousnessProfiles.find((profile) => profile.id === activeProfileId) ??
    consciousnessProfiles[0];
	  const activeNode =
	    consciousnessWebNodes.find((node) => node.id === activeNodeId) ??
	    consciousnessWebNodes[0];
	  const activeStrength = activeProfile.weights[activeNode.id] ?? 0;
	  const activeProfileDetails = consciousnessProfileDetails[activeProfile.id];
	  const activeLayerReading = getConsciousnessLayerReading(
	    activeProfile,
	    activeNode,
	    activeStrength,
	  );
	  const humanProfile =
	    consciousnessProfiles.find((profile) => profile.id === "human") ??
	    consciousnessProfiles[0];
	  const activeAverage =
	    consciousnessLayerOrder.reduce(
	      (total, nodeId) => total + activeProfile.weights[nodeId],
	      0,
	    ) / consciousnessLayerOrder.length;
	  const humanAverage =
	    consciousnessLayerOrder.reduce(
	      (total, nodeId) => total + humanProfile.weights[nodeId],
	      0,
	    ) / consciousnessLayerOrder.length;
	  const overallScore = Math.round((activeAverage / humanAverage) * 100);
	  const layerProfile = consciousnessStatGroups.map((group) => ({
	    label: group.label,
	    value:
	      group.nodeIds.reduce(
	        (total, nodeId) => total + activeProfile.weights[nodeId],
	        0,
	      ) / group.nodeIds.length,
	  }));

  return (
    <section
      className="mt-4 scroll-mt-24 overflow-hidden rounded-xl border border-white/10 bg-[#11100d] px-4 py-4 shadow-[0_22px_75px_rgba(0,0,0,0.22)] sm:px-5 sm:py-5"
      id="consciousness-gradient-explorer"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/70">
            Interactive Model
          </p>
          <h4 className="mt-2 text-lg font-semibold leading-7 text-stone-100">
            Consciousness Gradient Explorer
          </h4>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-400">
            Select a system to compare conceptual layers of embodied adaptation, world-modeling, social cognition, symbolic abstraction, and recursive self-awareness.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200/15 bg-amber-200/[0.045] px-3 py-2 text-xs leading-5 text-amber-50/85">
          Conceptual model, not a measurement.
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {consciousnessProfiles.map((profile) => (
          <button
            className={[
              "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition",
              activeProfile.id === profile.id
                ? "border-amber-200/70 bg-amber-200 text-stone-950"
                : "border-white/10 bg-black/20 text-stone-300 hover:border-amber-200/35 hover:text-amber-100",
            ].join(" ")}
            key={profile.id}
            onClick={() => setActiveProfileId(profile.id)}
            type="button"
          >
            <span className="grid h-5 w-5 place-items-center rounded border border-current/20 bg-black/10">
              <MiniSpecimenIcon profileId={profile.id} />
            </span>
            {profile.label}
          </button>
        ))}
      </div>

	      <div className="mt-5 grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
	        <aside className="space-y-3">
	          <div className="overflow-hidden rounded-lg border border-amber-200/15 bg-black/25">
	            <div className="border-b border-white/10 px-4 py-3">
	              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
	                Specimen
	              </p>
	              <div className="mt-2 flex items-start justify-between gap-3">
	                <h5 className="text-2xl font-semibold leading-none text-stone-50">
	                  {activeProfile.label}
	                </h5>
	                <span className="rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400">
	                  {activeProfileDetails.stage}
	                </span>
	              </div>
	            </div>
	
	            <div className="flex min-h-[278px] items-start justify-center bg-[linear-gradient(180deg,rgba(253,230,138,0.045),rgba(0,0,0,0.02))] px-2 pb-4 pt-4">
	              <SpecimenPortrait profileId={activeProfile.id} />
	            </div>
	          </div>
	
	          <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-4">
	            <div className="flex items-center justify-between gap-3">
	              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
	                Type
	              </p>
	              <p className="text-right text-sm font-medium text-stone-200">
	                {activeProfileDetails.type}
	              </p>
	            </div>
	            <p className="mt-3 text-sm leading-6 text-stone-300">
	              {activeProfileDetails.reading}
	            </p>
	            <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-amber-50/80">
	              {activeProfileDetails.caution}
	            </p>
	          </div>
	        </aside>
	
	        <section className="rounded-lg border border-white/10 bg-black/20 px-4 py-4">
	          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
	            <div>
	              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
	                Gradient Position
	              </p>
	              <h5 className="mt-1 text-lg font-semibold text-stone-100">
	                Adaptive Integration Profile
	              </h5>
	              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">
	                Relative to the highest known profile in this model: human recursive consciousness.
	              </p>
	            </div>
	            <div className="min-w-[150px] rounded-md border border-amber-200/15 bg-amber-200/[0.045] px-3 py-2">
	              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-200/70">
	                Relative Level
	              </p>
	              <p className="mt-1 text-3xl font-semibold leading-none text-amber-100">
	                {overallScore}
	              </p>
	            </div>
	          </div>
	
	          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
	            <div
	              className="h-full rounded-full bg-amber-200"
	              style={{ width: `${Math.min(Math.max(overallScore, 3), 100)}%` }}
	            />
	          </div>
	
	          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-center">
	            <ConsciousnessRadar
	              activeNodeId={activeNode.id}
	              profile={activeProfile}
	              onSelect={setActiveNodeId}
	            />
	
	            <div className="space-y-4">
	              <div className="space-y-3">
	                {layerProfile.map((group) => (
	                  <div key={group.label}>
	                    <div className="flex items-center justify-between gap-3">
	                      <span className="text-sm font-medium text-stone-200">
	                        {group.label}
	                      </span>
	                      <span className="font-mono text-xs text-amber-100">
	                        {Math.round(group.value * 100)}
	                      </span>
	                    </div>
	                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
	                      <div
	                        className="h-full rounded-full bg-amber-200/85"
	                        style={{ width: `${Math.max(group.value * 100, 3)}%` }}
	                      />
	                    </div>
	                  </div>
	                ))}
	              </div>
	
	              <div className="min-h-[138px] rounded-md border border-white/10 bg-white/[0.025] px-3 py-3">
	                <div className="flex items-center justify-between gap-3">
	                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
	                    Layer in This Organism
	                  </p>
	                  <span className="font-mono text-xs text-amber-100">
	                    {Math.round(activeStrength * 100)}
	                  </span>
	                </div>
	                <h6 className="mt-2 text-base font-semibold text-amber-50">
	                  {activeNode.label}
	                </h6>
	                <p className="mt-2 text-sm leading-6 text-stone-400">
	                  {activeLayerReading}
	                </p>
	              </div>
	            </div>
	          </div>
	        </section>
	      </div>
	    </section>
	  );
	}

function MiniSpecimenIcon({
  profileId,
}: {
  profileId: ConsciousnessProfileId;
}) {
  const image = consciousnessProfileDetails[profileId].image;

  return (
    <img
      alt=""
      className="h-full w-full rounded-[3px] object-cover"
      decoding="async"
      loading="lazy"
      src={image}
    />
  );
}

const consciousnessLayerReadings: Record<
  ConsciousnessNodeId,
  {
    low: string;
    mid: string;
    high: string;
    peak: string;
  }
> = {
  attention: {
    low: "attention is mostly reactive: signals matter only when they directly trigger response.",
    mid: "attention can select relevant cues, but it remains tied closely to immediate conditions.",
    high: "attention becomes flexible enough to track goals, threats, social cues, and changing contexts.",
    peak: "attention can be deliberately redirected, disciplined, abstracted, and turned back on thought itself.",
  },
  embodiment: {
    low: "embodiment is weak or indirect: the system does not appear deeply organized around bodily vulnerability.",
    mid: "embodiment strongly anchors behavior through movement, sensation, regulation, and environmental contact.",
    high: "embodiment deeply shapes perception, emotion, learning, risk, and survival-oriented action.",
    peak: "embodiment is not only biological constraint; it becomes part of identity, mortality, meaning, and self-understanding.",
  },
  emotion: {
    low: "emotional weighting is minimal or uncertain, so behavior should not be read as rich feeling too quickly.",
    mid: "emotional weighting likely helps mark danger, reward, pain, attachment, or motivational significance.",
    high: "emotion strongly organizes memory, attention, attachment, learning, and social interpretation.",
    peak: "emotion can become symbolically interpreted, narrated, regulated, suppressed, intensified, and philosophically examined.",
  },
  existential: {
    low: "existential awareness is effectively absent; there is no reason to infer reflection on mortality, meaning, or being.",
    mid: "existential awareness remains limited, though some behavior may suggest future concern or self-continuity.",
    high: "existential pressure becomes visible through anxiety, death-awareness, meaning construction, and long-term identity.",
    peak: "existential reflection becomes explicit: the system can ask what existence, consciousness, death, and meaning are.",
  },
  identity: {
    low: "identity appears thin: behavior may persist without a strong continuing self-model.",
    mid: "identity begins forming through memory, territory, body, role, attachment, or social position.",
    high: "identity becomes a stable organizing model connecting memory, social behavior, preference, and expectation.",
    peak: "identity becomes symbolic and recursive: the self can become a story, role, project, conflict, and object of reflection.",
  },
  language: {
    low: "language-like symbolism is absent or extremely limited, so the system does not appear to compress experience into shared concepts.",
    mid: "symbolic communication may exist in limited form, but it does not dominate cognition the way human language does.",
    high: "symbolic modeling becomes powerful enough to structure categories, memory, planning, and social coordination.",
    peak: "language becomes a world-building system: concepts, narratives, institutions, morality, and abstract reality-models can accumulate across generations.",
  },
  memory: {
    low: "memory is mostly local or procedural, preserving useful traces without rich autobiographical continuity.",
    mid: "memory can guide navigation, threat recognition, learning, and repeated adaptive behavior.",
    high: "memory strongly integrates past experience with present choice, social recognition, and future expectation.",
    peak: "memory becomes narrative and historical, allowing identity, culture, regret, planning, and accumulated knowledge.",
  },
  prediction: {
    low: "prediction is mainly immediate: the system responds to simple regularities rather than simulating complex futures.",
    mid: "prediction supports navigation, avoidance, pursuit, and flexible adjustment to changing surroundings.",
    high: "prediction becomes rich enough to model other agents, delayed outcomes, tools, strategy, and uncertainty.",
    peak: "prediction can become abstract, long-range, counterfactual, scientific, political, existential, and civilization-scale.",
  },
  recursion: {
    low: "recursive self-modeling is effectively absent; the system does not appear to model its own modeling.",
    mid: "recursive capacity is limited, showing possible self-monitoring without deep symbolic self-reflection.",
    high: "recursive modeling lets the system track itself, others, intentions, strategies, and changing interpretations.",
    peak: "recursion becomes explicit self-awareness: consciousness can examine its own models, limits, identity, and uncertainty.",
  },
  sensation: {
    low: "sensation is limited or uncertain, closer to signal-response than rich integrated experience.",
    mid: "sensation becomes a meaningful layer of navigation, pain response, orientation, and environmental engagement.",
    high: "sensation is deeply integrated with emotion, attention, memory, and flexible behavior.",
    peak: "sensation becomes part of reflective experience: perception can be noticed, questioned, described, and philosophically analyzed.",
  },
  social: {
    low: "social modeling is minimal; interaction does not imply a rich model of other minds.",
    mid: "social modeling supports coordination, recognition, signaling, attachment, or group behavior.",
    high: "social modeling becomes central to status, trust, cooperation, threat detection, learning, and emotional life.",
    peak: "social modeling becomes symbolic and institutional: identity, morality, politics, culture, and reputation become recursive systems.",
  },
};

function getConsciousnessLayerReading(
  profile: (typeof consciousnessProfiles)[number],
  node: (typeof consciousnessWebNodes)[number],
  strength: number,
) {
  const tier =
    strength >= 0.82 ? "peak" : strength >= 0.55 ? "high" : strength >= 0.22 ? "mid" : "low";
  const reading = consciousnessLayerReadings[node.id][tier];

  return `For ${profile.label}, ${reading}`;
}

function SpecimenPortrait({
  profileId,
}: {
  profileId: ConsciousnessProfileId;
}) {
  const title = consciousnessProfiles.find((profile) => profile.id === profileId)?.label ?? "";
  const profileDetails = consciousnessProfileDetails[profileId];

  return (
    <figure className="mx-auto w-full max-w-[285px]">
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-xl bg-[#080705] shadow-[inset_0_0_55px_rgba(0,0,0,0.78),0_18px_45px_rgba(0,0,0,0.32)]">
        <img
          alt={`${title} consciousness profile portrait`}
          className="h-full w-full object-contain object-center"
          decoding="async"
          loading="lazy"
          src={profileDetails.image}
          style={{ transform: profileDetails.imageTransform }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 48%, rgba(8,7,5,0) 50%, rgba(8,7,5,0.36) 74%, rgba(8,7,5,0.92) 100%)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl border border-amber-200/10"
        />
      </div>
      <figcaption className="mt-3 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-300/80">
        {title}
      </figcaption>
    </figure>
  );
}

function SpecimenShape({
  profileId,
}: {
  profileId: ConsciousnessProfileId;
}) {
  const stroke = "currentColor";
  const fill = "currentColor";

  if (profileId === "bacteria") {
    return (
      <g color="rgb(253 230 138)">
        <ellipse cx="12" cy="12" fill="none" rx="7" ry="4.8" stroke={stroke} strokeWidth="1.8" transform="rotate(-24 12 12)" />
        <circle cx="9" cy="11" fill={fill} r="0.8" />
        <circle cx="12" cy="13" fill={fill} r="0.7" />
        <circle cx="15" cy="10" fill={fill} r="0.8" />
        <path d="M4 8 C1 6 1 3 4 2 M20 16 C23 18 23 21 20 22 M6 17 C3 20 1 19 1 16" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="1.4" />
      </g>
    );
  }

  if (profileId === "ant") {
    return (
      <g color="rgb(253 230 138)" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="1.7">
        <circle cx="7" cy="12" r="3" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="17.5" cy="12" r="3.6" />
        <path d="M9 10 L6 6 M9 14 L6 18 M12 9 L12 5 M12 15 L12 19 M16 10 L19 6 M16 14 L20 18 M5 10 L2 8 M5 14 L2 16" />
      </g>
    );
  }

  if (profileId === "fish") {
    return (
      <g color="rgb(253 230 138)">
        <path d="M3 12 C7 6 15 6 20 12 C15 18 7 18 3 12Z" fill="none" stroke={stroke} strokeWidth="1.8" />
        <path d="M20 12 L23 8 L23 16Z" fill="none" stroke={stroke} strokeLinejoin="round" strokeWidth="1.8" />
        <circle cx="8" cy="11" fill={fill} r="0.9" />
        <path d="M12 8 C10 11 10 13 12 16" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="1.2" />
      </g>
    );
  }

  if (profileId === "dog") {
    return (
      <g color="rgb(253 230 138)">
        <ellipse cx="12" cy="15.3" fill="none" rx="4.6" ry="3.8" stroke={stroke} strokeWidth="1.8" />
        <circle cx="6.5" cy="8" fill="none" r="2.4" stroke={stroke} strokeWidth="1.8" />
        <circle cx="11" cy="6" fill="none" r="2.5" stroke={stroke} strokeWidth="1.8" />
        <circle cx="17.5" cy="8" fill="none" r="2.4" stroke={stroke} strokeWidth="1.8" />
        <circle cx="12" cy="11" fill={fill} r="1" />
      </g>
    );
  }

  if (profileId === "crow") {
    return (
      <g color="rgb(253 230 138)" stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M4 15 C7 8 13 5.5 20 8 L15.5 10.5 C18 13.5 16.5 18 12 19 C9.5 20.8 7 18.5 8.2 15.8 C6.7 16.2 5.3 16 4 15Z"
          fill={fill}
          fillOpacity="0.18"
          strokeWidth="1.8"
        />
        <path d="M15.5 10.5 L22 9 L17.8 12.5" fill="none" strokeWidth="1.8" />
        <circle cx="13.8" cy="9.7" fill={fill} r="0.65" />
        <path d="M10.2 18.5 L8.5 22 M12.7 18.2 L14 22" fill="none" strokeWidth="1.5" />
      </g>
    );
  }

  if (profileId === "chimp") {
    return (
      <g color="rgb(253 230 138)" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="1.8">
        <circle cx="5" cy="12" r="2.8" />
        <circle cx="19" cy="12" r="2.8" />
        <circle cx="12" cy="12" r="7" />
        <path d="M8.5 11 C9.5 10 10.5 10 11.2 11 M12.8 11 C13.5 10 14.5 10 15.5 11 M9 16 C11 17.5 13 17.5 15 16" />
        <path d="M12 12.5 L11 14 L13 14Z" />
      </g>
    );
  }

  if (profileId === "human") {
    return (
      <g color="rgb(253 230 138)" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="1.8">
        <circle cx="12" cy="7.8" r="4.2" />
        <path d="M5 22 C5.8 16.5 8.2 14 12 14 C15.8 14 18.2 16.5 19 22" />
        <path d="M17 6 C20 8.5 20.5 12 18.5 15 M19.5 5 C23 8.5 23.5 13 21 17" opacity="0.7" />
      </g>
    );
  }

  return (
    <g color="rgb(253 230 138)" fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
      <rect height="12" rx="2" width="12" x="6" y="6" />
      <path d="M9 9 H15 V15 H9Z" />
      <path d="M3 9 H6 M3 15 H6 M18 9 H21 M18 15 H21 M9 3 V6 M15 3 V6 M9 18 V21 M15 18 V21" />
      <path d="M10 12 H14" />
    </g>
  );
}

function ConsciousnessRadar({
  activeNodeId,
  onSelect,
  profile,
}: {
  activeNodeId: ConsciousnessNodeId;
  onSelect: (nodeId: ConsciousnessNodeId) => void;
  profile: (typeof consciousnessProfiles)[number];
}) {
  const center = 50;
  const radius = 34;
  const axes = consciousnessLayerOrder.map((nodeId) => {
    const node =
      consciousnessWebNodes.find((item) => item.id === nodeId) ??
      consciousnessWebNodes[0];

    return {
      node,
      value: profile.weights[node.id] ?? 0,
    };
  });

  function pointFor(index: number, value: number) {
    const angle = -Math.PI / 2 + (index / axes.length) * Math.PI * 2;
    const distance = radius * value;

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  }

  function polygonPoints(value: number) {
    return axes
      .map((_, index) => {
        const point = pointFor(index, value);
        return `${point.x},${point.y}`;
      })
      .join(" ");
  }

  const dataPoints = axes
    .map(({ value }, index) => {
      const point = pointFor(index, value);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
	    <svg
	      aria-label={`${profile.label} consciousness layer graph`}
	      className="h-[340px] w-full"
	      role="img"
	      viewBox="0 0 100 100"
	    >
      {[0.25, 0.5, 0.75, 1].map((level) => (
        <polygon
          fill="none"
          key={level}
          points={polygonPoints(level)}
          stroke="rgb(255 255 255 / 0.09)"
          strokeWidth="0.35"
        />
      ))}

	      {axes.map(({ node }, index) => {
	        const edge = pointFor(index, 1);
	        const label = pointFor(index, 1.2);
	        const selected = node.id === activeNodeId;

        return (
          <g
            className="cursor-pointer outline-none"
            key={node.id}
            onClick={() => onSelect(node.id)}
            onFocus={() => onSelect(node.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onSelect(node.id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <line
              stroke="rgb(255 255 255 / 0.08)"
              strokeWidth="0.35"
              x1={center}
              x2={edge.x}
              y1={center}
              y2={edge.y}
            />
	            <text
	              fill={selected ? "rgb(253 230 138)" : "rgb(168 162 158)"}
	              fontSize="3.65"
	              fontWeight={selected ? 700 : 500}
	              textAnchor="middle"
	              x={label.x}
	              y={label.y}
	            >
              {node.label}
            </text>
          </g>
        );
      })}

      <polygon
        fill="rgb(253 230 138 / 0.17)"
        points={dataPoints}
        stroke="rgb(253 230 138 / 0.75)"
        strokeLinejoin="round"
        strokeWidth="0.8"
      />
    </svg>
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

function EvidentialStylesPanel({ styles }: { styles: EvidentialStyle[] }) {
  const renderStyle = (style: EvidentialStyle, index: number) => (
    <article
      className="grid h-full min-h-[245px] gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-4 sm:grid-cols-[2.75rem_1fr]"
      key={style.title}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/10 font-mono text-sm text-amber-100">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-stone-50">{style.title}</h4>
        <p className="mt-2 text-sm leading-7 text-stone-300">
          <span className="font-medium text-stone-100">Core idea:</span>{" "}
          {style.coreIdea}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {style.evidence.map((item) => (
            <span
              className="rounded-full border border-amber-200/15 bg-amber-200/[0.06] px-2.5 py-1 text-[11px] font-medium leading-none text-amber-100/90"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-7 text-stone-400">
          <span className="font-medium text-stone-200">Challenge:</span>{" "}
          {style.challenge}
        </p>
      </div>
    </article>
  );

  return (
    <section className="scroll-reveal mt-12 overflow-hidden rounded-[2rem] border border-amber-200/15 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.13),transparent_34%),linear-gradient(135deg,rgba(23,20,14,0.96),rgba(8,8,7,0.98))] px-5 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:px-7 sm:py-8">
      <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
        <div className="px-1 py-2 lg:pr-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-200/70">
            Common Evidential Styles
          </p>
          <h3 className="mt-4 text-2xl font-semibold leading-tight text-stone-50 sm:text-3xl">
            The debate is usually a network, not one claim.
          </h3>
          <div className="mt-6 space-y-5 text-base leading-8 text-stone-300">
            <p>
              Religious arguments rarely operate one at a time. A text,
              prophecy, experience, moral claim, historical survival, and
              providential reading can reinforce each other.
            </p>
            <p>
              This taxonomy is not tied to one religion. It names repeatable
              evidential styles that can appear across Christianity, Islam,
              Judaism, Hinduism, and even non-religious ideologies.
            </p>
            <p>
              That is why debates can feel slippery: one weakened argument may
              be replaced by another style of evidence without the standard of
              proof being made explicit.
            </p>
          </div>
        </div>

        <div className="grid h-full gap-4 lg:grid-rows-2">
          {styles.slice(0, 2).map((style, index) => renderStyle(style, index))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {styles.slice(2).map((style, index) => renderStyle(style, index + 2))}
      </div>
    </section>
  );
}

function EvidentialCaseStudyPanel({ study }: { study: EvidentialCaseStudy }) {
  const outcomeBreakIndex = 4;
  const pressureQuestionIndex = 40;

  const renderStudyParagraphs = (
    paragraphs: string[],
    offset = 0,
    className = "text-lg leading-9 text-stone-300",
  ) => (
    <div className={["space-y-6", className].join(" ")}>
      {paragraphs.map((block, index) => (
        <p
          className={[
            "max-w-3xl",
            (index + offset) % 2 === 1 ? "lg:ml-auto lg:text-right" : "",
          ].join(" ")}
          key={block}
        >
          {block}
        </p>
      ))}
    </div>
  );

  return (
    <section className="scroll-reveal mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] px-5 py-7 sm:px-7 lg:px-9">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-200/70">
          {study.eyebrow}
        </p>
        <h3 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight text-stone-50 sm:text-4xl">
          {study.title}
        </h3>
        <p className="mt-5 max-w-3xl text-xl leading-9 text-stone-300">
          {study.intro}
        </p>

        <div className="mt-8">
          {renderStudyParagraphs(study.body.slice(0, outcomeBreakIndex))}
        </div>

        <div className="my-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-200/15 bg-amber-200/[0.055] p-5">
            <h4 className="text-base font-semibold text-stone-50">
              Favorable Outcomes
            </h4>
            <ul className="mt-4 space-y-3">
              {study.favorable.map((item) => (
                <li className="flex gap-3 text-sm leading-6 text-stone-300" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h4 className="text-base font-semibold text-stone-50">
              Unfavorable Outcomes
            </h4>
            <ul className="mt-4 space-y-3">
              {study.unfavorable.map((item) => (
                <li className="flex gap-3 text-sm leading-6 text-stone-300" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {renderStudyParagraphs(
          study.body.slice(outcomeBreakIndex, pressureQuestionIndex),
          outcomeBreakIndex,
        )}

        <div className="my-8 rounded-2xl border border-amber-200/20 bg-[linear-gradient(135deg,rgba(250,204,21,0.12),rgba(0,0,0,0.22))] p-5 sm:p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-100/80">
            Pressure Test
          </p>
          <p className="mt-3 text-xl font-semibold leading-8 text-stone-50 sm:text-2xl sm:leading-9">
            {study.coreQuestion}
          </p>
        </div>

        {renderStudyParagraphs(
          study.body.slice(pressureQuestionIndex + 1),
          pressureQuestionIndex + 1,
        )}
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

      {topic.evidentialStyles?.length ? (
        <EvidentialStylesPanel styles={topic.evidentialStyles} />
      ) : null}

      {topic.evidentialCaseStudy ? (
        <EvidentialCaseStudyPanel study={topic.evidentialCaseStudy} />
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
  const philosophicalNote = section.notes?.find(
    (note) => note.title === "Philosophical Metaphysics Note",
  );

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

      {philosophicalNote?.body ? (
        <section
          className={[
            "mt-5 rounded-lg border px-4 py-4",
            accentClasses.note,
          ].join(" ")}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-100/70">
            {philosophicalNote.title}
          </p>
          <p className="mt-2 text-sm leading-7 text-stone-300">
            {philosophicalNote.body}
          </p>
        </section>
      ) : null}

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
              tagClassName={accentClasses.argumentTag}
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
      argumentTag: "border-emerald-200/20 bg-emerald-300/10 text-emerald-100",
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
      argumentTag: "border-sky-200/20 bg-sky-300/10 text-sky-100",
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
      argumentTag: "border-violet-200/20 bg-violet-300/10 text-violet-100",
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
      argumentTag: "border-white/10 bg-white/[0.04] text-stone-400",
      divider: "border-white/10",
      note: "border-white/10 bg-black/10",
      archive: "border-white/10 bg-white/[0.025]",
      iconBorder: "border-white/10",
      symbol: "border-white/10 bg-white/[0.04] text-stone-100",
    },
  };

  return classes[accent as keyof typeof classes] ?? classes.stone;
}

function ReadingDisplayToggle({
  mode,
  onChange,
}: {
  mode: ReadingDisplayMode;
  onChange: (mode: ReadingDisplayMode) => void;
}) {
  return (
    <div className="sticky top-0 z-20 mb-8 -mx-2 rounded-b-xl border-b border-white/10 bg-[#0f0d0a]/95 px-2 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
            Philosophy View
          </p>
          <p className="mt-1 text-sm leading-5 text-stone-300">
            Essay view or archive comparison.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-white/10 bg-black/20 p-1">
          {(["essay", "compare"] as ReadingDisplayMode[]).map((option) => (
            <button
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                mode === option
                  ? "bg-amber-200 text-stone-950"
                  : "text-stone-300 hover:bg-white/[0.06] hover:text-stone-100",
              ].join(" ")}
              key={option}
              onClick={() => onChange(option)}
              type="button"
            >
              {option === "essay" ? "Essay" : "Compare"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReadingSubsection({
  displayMode = "essay",
  section,
}: {
  displayMode?: ReadingDisplayMode;
  section: ReadingSection;
}) {
  const isEssaySection = essayOnlySectionIds.has(section.id);
  const isCompareMode = isEssaySection && displayMode === "compare";
  const visibleNotes = (isEssaySection ? [] : section.notes ?? []).filter(
    (note) => !hiddenNoteTitlesBySection[section.id]?.has(note.title),
  );

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

      {isCompareMode ? (
        <ArchiveCompareView section={section} />
      ) : isEssaySection ? (
        <EssayBody blocks={section.contentBlocks} sectionId={section.id} />
      ) : (
        <div className="space-y-6 text-lg leading-9 text-stone-300">
          {section.contentBlocks.map((block) => (
            <ContentBlock block={block} key={block} />
          ))}
        </div>
      )}

      {!isCompareMode && keyTensionBySection[section.id] ? (
        <KeyTension>{keyTensionBySection[section.id]}</KeyTension>
      ) : null}

      {!isCompareMode && coreLineBySection[section.id] ? (
        <CoreLine>{coreLineBySection[section.id]}</CoreLine>
      ) : null}

      {section.id === "religion-overviews" ? <ReligionComparisonTable /> : null}

      {flowStepsBySection[section.id] ? (
        <FlowDiagram steps={flowStepsBySection[section.id]} />
      ) : null}

      {!isCompareMode && structureDiagramsBySection[section.id] ? (
        <StructureDiagram diagram={structureDiagramsBySection[section.id]} />
      ) : null}

      <ArgumentList section={section} />

      {visibleNotes.length ? (
        <div className="mt-5 space-y-4">
          {visibleNotes.map((note) => (
            <Fragment key={note.title}>
              <NoteCard note={note} sectionId={section.id} />
              {section.id === "philosophy-mind" &&
              note.title === "Consciousness Gradients" ? (
                <>
                  <ConsciousnessGradientDiagram />
                  <ConsciousnessSystemsExplorer />
                </>
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ContentBlock({ block }: { block: string }) {
  if (block.trim().startsWith("<pre") || block.trim().startsWith("<ul")) {
    return <div dangerouslySetInnerHTML={{ __html: block }} />;
  }

  return <p dangerouslySetInnerHTML={{ __html: block }} />;
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

const hiddenNoteTitlesBySection: Record<string, Set<string>> = {
  "philosophy-mind": new Set(["Possible Consciousness Gradient Model"]),
};

function ArchiveCompareView({ section }: { section: ReadingSection }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
          Current Essay
        </p>
        <EssayBody blocks={section.contentBlocks} sectionId={section.id} />
      </div>

      <div>
        <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
            Archived Notes
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-400">
            Earlier note cards kept for reference while the essay version is revised.
          </p>

          {section.notes?.length ? (
            <div className="mt-4 space-y-2">
              {section.notes.map((note) => (
                <details
                  className="rounded-lg border border-white/10 bg-black/10 px-3 py-3"
                  key={note.title}
                >
                  <summary className="cursor-pointer text-sm font-semibold leading-5 text-stone-100">
                    {note.title}
                  </summary>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    {note.body ? <NoteBody body={note.body} /> : null}
                    {note.items?.length ? (
                      <ul className="mt-3 space-y-2">
                        {note.items.map((item) => (
                          <li className="flex gap-2 text-sm leading-6 text-stone-300" key={item}>
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/70" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-stone-500">No archived notes for this section.</p>
          )}
        </div>
      </div>
    </div>
  );
}

type EssaySegment =
  | {
      blocks: string[];
      type: "paragraph";
    }
  | {
      text: string;
      type: "bubble";
    }
  | {
      id: string;
      title: string;
      type: "heading";
    };

type EssaySectionMarker = {
  startsWith: string;
  title: string;
};

function EssayBody({
  blocks,
  sectionId,
}: {
  blocks: string[];
  sectionId: string;
}) {
  const markers = essaySectionMarkersBySection[sectionId] ?? [];
  const segments = groupEssayBlocks(blocks, sectionId);

  return (
    <div className="space-y-5 text-lg leading-9 text-stone-300">
      {markers.length ? <EssayPartMap markers={markers} sectionId={sectionId} /> : null}

      {segments.map((segment, index) =>
        segment.type === "bubble" ? (
          <p
            className="rounded-lg border border-amber-200/15 bg-amber-200/[0.045] px-5 py-4 font-medium leading-8 text-amber-50"
            dangerouslySetInnerHTML={{ __html: segment.text }}
            key={`${segment.text}-${index}`}
          />
        ) : segment.type === "heading" ? (
          <h4
            className="scroll-mt-20 pt-6 text-xl font-semibold leading-8 text-stone-50"
            id={segment.id}
            key={segment.id}
          >
            {segment.title}
          </h4>
        ) : (
          <p
            dangerouslySetInnerHTML={{ __html: segment.blocks.join(" ") }}
            key={`${segment.blocks[0]}-${index}`}
          />
        ),
      )}
    </div>
  );
}

function EssayPartMap({
  markers,
  sectionId,
}: {
  markers: EssaySectionMarker[];
  sectionId: string;
}) {
  return (
    <nav className="mb-8 rounded-lg border border-white/10 bg-white/[0.025] px-4 py-4">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
        Part Map
      </p>
      <div className="flex flex-wrap gap-2">
        {markers.map((marker) => (
          <a
            className="rounded-md border border-white/10 bg-black/10 px-3 py-2 text-sm font-medium leading-5 text-stone-200 transition hover:border-amber-200/30 hover:text-amber-100"
            href={`#${essaySectionAnchorId(sectionId, marker.title)}`}
            key={marker.title}
          >
            {marker.title}
          </a>
        ))}
      </div>
    </nav>
  );
}

function groupEssayBlocks(blocks: string[], sectionId: string) {
  const segments: EssaySegment[] = [];
  const markers = essaySectionMarkersBySection[sectionId] ?? [];
  let paragraphBlocks: string[] = [];
  let paragraphLength = 0;

  function flushParagraph() {
    if (!paragraphBlocks.length) {
      return;
    }

    segments.push({
      blocks: paragraphBlocks,
      type: "paragraph",
    });
    paragraphBlocks = [];
    paragraphLength = 0;
  }

  blocks.forEach((block) => {
    const marker = markers.find((item) => block.startsWith(item.startsWith));

    if (marker) {
      flushParagraph();
      segments.push({
        id: essaySectionAnchorId(sectionId, marker.title),
        title: marker.title,
        type: "heading",
      });
    }

    if (essayBubbleBlocks.has(block)) {
      flushParagraph();
      segments.push({
        text: block,
        type: "bubble",
      });
      return;
    }

    paragraphBlocks.push(block);
    paragraphLength += block.length;

    if (paragraphLength > 900) {
      flushParagraph();
    }
  });

  flushParagraph();
  return segments;
}

function essaySectionAnchorId(sectionId: string, title: string) {
  return `${sectionId}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

const essaySectionMarkersBySection: Record<string, EssaySectionMarker[]> = {
  "philosophy-metaphysics": [
    {
      title: "1.1 Embedded Access",
      startsWith: "A human being does not stand outside existence",
    },
    {
      title: "1.2 Operational Reality vs. Ultimate Reality",
      startsWith: "This creates the central distinction",
    },
    {
      title: "1.3 Process, Agency, and Time",
      startsWith: "Reality also does not appear",
    },
    {
      title: "1.4 Meaning Under Partial Access",
      startsWith: "Meaning enters",
    },
    {
      title: "1.5 Transition to Epistemology",
      startsWith: "Metaphysics therefore does not end",
    },
  ],
  "philosophy-epistemology": [
    {
      title: "2.1 Proportional Confidence",
      startsWith: "Human reasoning does not occur",
    },
    {
      title: "2.2 Categories of Truth",
      startsWith: "This distinction matters",
    },
    {
      title: "2.3 Belief Formation and Reasoning Failure",
      startsWith: "This becomes especially important",
    },
    {
      title: "2.4 Social Confidence and Information Systems",
      startsWith: "The problem becomes even more difficult",
    },
    {
      title: "2.5 Revision Capacity",
      startsWith: "This is why falsifiability",
    },
  ],
  "philosophy-ethics": [
    {
      title: "3.1 Moral Orientation",
      startsWith: "Moral life does not occur",
    },
    {
      title: "3.2 Shared Human Conditions",
      startsWith: "This does not mean moral judgment becomes random",
    },
    {
      title: "3.3 Systems, Burden, and Failure Modes",
      startsWith: "At the same time, moral reasoning becomes dangerous",
    },
    {
      title: "3.4 Historical Scale",
      startsWith: "Historical morality reveals",
    },
    {
      title: "3.5 Transition to Political Philosophy",
      startsWith: "Ethics within this framework",
    },
  ],
  "philosophy-political-philosophy": [
    {
      title: "4.1 Embedded Political Judgment",
      startsWith: "Politics is not merely",
    },
    {
      title: "4.2 Cohesion, Variation, and Institutions",
      startsWith: "The central political tension",
    },
    {
      title: "4.3 Incentives and Uneven Power",
      startsWith: "This becomes more difficult because systems",
    },
    {
      title: "4.4 Conflict, Threat, and Certainty",
      startsWith: "These tensions become most visible",
    },
    {
      title: "4.5 Political Orientation",
      startsWith: "Because of this, political analysis",
    },
  ],
  "philosophy-existentialism": [
    {
      title: "6.1 The Existential Condition",
      startsWith: "Human beings are thrown",
    },
    {
      title: "6.2 Meaning After Certainty",
      startsWith: "Existentialism becomes especially relevant",
    },
    {
      title: "6.3 Emergent Meaning",
      startsWith: "Meaning therefore may not function",
    },
    {
      title: "6.4 Freedom and Responsibility",
      startsWith: "Freedom itself can become",
    },
    {
      title: "6.5 Mortality and Grounded Uncertainty",
      startsWith: "The existential problem deepens",
    },
    {
      title: "6.6 Living Before Resolution",
      startsWith: "Existentialism within this framework",
    },
  ],
  "philosophy-nihilism": [
    {
      title: "7.1 The Nihilistic Pressure",
      startsWith: "The nihilistic pressure emerges",
    },
    {
      title: "7.2 The Overextension",
      startsWith: "At the same time, nihilism",
    },
    {
      title: "7.3 Lived Significance",
      startsWith: "Human beings still experience",
    },
    {
      title: "7.4 Collapse and Constraint",
      startsWith: "Nihilism also becomes psychologically",
    },
    {
      title: "7.5 Pressure, Not Final Rest",
      startsWith: "Nihilism therefore functions less",
    },
    {
      title: "7.6 The Framework's Response",
      startsWith: "Meaning may remain",
    },
  ],
  "philosophy-stoicism": [
    {
      title: "8.1 Instability and Control",
      startsWith: "At its core",
    },
    {
      title: "8.2 Internal Orientation",
      startsWith: "The central Stoic move",
    },
    {
      title: "8.3 Emotion and Reactivity",
      startsWith: "This does not mean Stoicism rejects",
    },
    {
      title: "8.4 Grounded Uncertainty",
      startsWith: "This becomes especially relevant",
    },
    {
      title: "8.5 Tradeoffs and Limits",
      startsWith: "At the same time, Stoicism",
    },
    {
      title: "8.6 Adaptive Orientation",
      startsWith: "Its strength is therefore best understood",
    },
  ],
  "philosophy-utilitarianism": [
    {
      title: "9.1 Consequence Reasoning",
      startsWith: "At its core",
    },
    {
      title: "9.2 Recursive Optimization",
      startsWith: "At the same time, utilitarian reasoning",
    },
    {
      title: "9.3 Adaptive Optimization",
      startsWith: "At a deeper level",
    },
    {
      title: "9.4 Multi-Variable Life",
      startsWith: "This reveals one of the central tensions",
    },
    {
      title: "9.5 Metric Drift",
      startsWith: "This creates the recurring danger",
    },
    {
      title: "9.6 Optimization's Limit",
      startsWith: "This does not make utilitarian reasoning meaningless",
    },
  ],
  "philosophy-postmodernism": [
    {
      title: "10.1 Interpretation and Reality",
      startsWith: "The section does not begin",
    },
    {
      title: "10.2 Language and Framing",
      startsWith: "A central insight",
    },
    {
      title: "10.3 Power and Knowledge",
      startsWith: "Postmodernism therefore examines",
    },
    {
      title: "10.4 Recursive Social Systems",
      startsWith: "Political and social systems",
    },
    {
      title: "10.5 Social Reality Drift",
      startsWith: "Because of this, social reality",
    },
    {
      title: "10.6 Insight Without Collapse",
      startsWith: "At the same time, this framework",
    },
  ],
};

const essayBubbleBlocks = new Set([
  "This creates the central distinction of the section: operational reality is not the same thing as ultimate reality.",
  "A model does not need to become ultimate reality itself in order to remain operationally reliable.",
  "Stability often means process held together long enough to become recognizable.",
  "Time deepens the problem further.",
  "Meaning enters metaphysics at that edge.",
  "That transition moves the framework from metaphysics into epistemology.",
  "The goal of epistemology within this framework is therefore not absolute certainty. It is proportional confidence.",
  "This becomes especially important because belief formation is not driven by evidence alone.",
  "Part of epistemological discipline therefore involves separating why a belief feels compelling from whether it has been sufficiently justified.",
  "This is where recurring reasoning failures begin appearing.",
  "This is why falsifiability and revision capacity matter.",
  "Modern information systems intensify these problems further.",
  "This creates a difficult balancing problem.",
  "Its defense is not certainty.",
  "Its defense is revision capacity.",
  "The central ethical problem becomes how to preserve moral action without pretending complexity has disappeared.",
  "The stronger position is constrained moral orientation.",
  "This means morality cannot wait for perfect certainty before functioning.",
  "Most of these values matter.",
  "The distortion begins when one value expands far enough to suppress the rest.",
  "At that point, systems begin preserving themselves more than the humans they were meant to guide.",
  "The danger is not structure itself. Civilization requires shared norms in order to function.",
  "Moral systems therefore fail in opposite directions.",
  "Rigid systems sacrifice complexity for coherence.",
  "Over-flexible systems dissolve coherence into instability.",
  "Historical morality reveals these tensions clearly.",
  "Recognizing historical outcomes does not morally erase suffering.",
  "This does not automatically justify harm.",
  "It attempts to preserve moral orientation under conditions of uncertainty and complexity.",
  "That transition moves the framework toward political philosophy.",
  "The central political tension within this framework is the balance between cohesion and adaptive variation.",
  "At the same time, adaptive variation is necessary for correction.",
  "Too much enforced unity suppresses correction. Too much fragmentation weakens coordination.",
  "The problem is not power itself. Any civilization requires power distribution, decision-making structures, enforcement systems, and institutional continuity. The deeper political problem is how power remains constrained, corrigible, reality-responsive, and aligned with the populations and purposes it originally existed to serve.",
  "These tensions become most visible during prolonged conflict.",
  "At that point, compromise may begin feeling not merely politically dangerous, but morally illegitimate.",
  "Under perceived existential threat, humans also become more psychologically resistant to ambiguity and interpretive openness.",
  "This creates a recurring political danger: the conditions that make careful interpretation most necessary are often the same conditions that make groups least tolerant of careful interpretation.",
  "The first layer is internal perspective.",
  "The second layer is structural analysis.",
  "The third layer is moral and epistemic constraint.",
  "The final layer is provisional political orientation.",
  "The goal is not utopia.",
  "This creates the existential condition.",
  "It is the pressure of freedom under uncertainty.",
  "This framework rejects both total existential collapse and total existential certainty.",
  "Freedom itself can become psychologically destabilizing.",
  "Meaning can remain experientially real even if its deepest metaphysical grounding remains unresolved.",
  "This does not mean human beings freely invent reality itself.",
  "The absence of total metaphysical certainty does not make all interpretations equally viable, coherent, stabilizing, or reality-aligned.",
  "The goal is therefore not perfect certainty before living begins.",
  "The goal is learning how to live honestly within limitation.",
  "The existential task is therefore not fully solving reality before living.",
  "It is deciding how to live while reality remains partially unresolved.",
  "This framework takes that pressure seriously.",
  "At the same time, nihilism can overextend its conclusion.",
  "The absence of guaranteed ultimate meaning does not automatically imply that all meaning collapses into nothingness.",
  "But those are not identical claims.",
  "This creates an important distinction between ultimate metaphysical grounding and lived existential significance.",
  "Meaning therefore may not require absolute metaphysical certainty in order to function psychologically, socially, behaviorally, or experientially.",
  "This does not mean nihilistic insight is false.",
  "But nihilism becomes weaker when it treats uncertainty itself as proof that all forms of meaning are equally empty or unreal.",
  "The question becomes whether humans can confront uncertainty honestly without collapsing entirely into meaninglessness.",
  "This framework argues that they can.",
  "Nihilism therefore does not fully destroy the framework.",
  "It pressures it.",
  "The response is not perfect certainty.",
  "At its core, Stoicism is a response to instability.",
  "The central Stoic move is relocating stability away from external outcomes and toward internal orientation.",
  "Stoicism therefore attempts to preserve grounded functioning under unstable reality rather than eliminate instability itself.",
  "The Stoic problem is not emotion existing.",
  "The problem is emotional destabilization overwhelming judgment, perception, and action.",
  "Too much rigid certainty can distort reality.",
  "But too little grounding can destabilize the person.",
  "The stronger distinction therefore becomes not certainty versus uncertainty alone, but grounded uncertainty versus destabilized collapse.",
  "At the same time, Stoicism also contains tradeoffs and limitations.",
  "This reflects a broader pattern repeated across many philosophies: every orientation solves certain pressures while introducing new distortions.",
  "The Stoic answer is not perfect certainty.",
  "It is disciplined internal orientation under unstable conditions.",
  "The strength of utilitarian reasoning is that it forces attention toward lived consequence rather than moral abstraction alone.",
  "At the same time, utilitarian reasoning becomes much more complicated once human complexity enters the picture.",
  "Consequences are rarely fully predictable.",
  "The difficulty deepens further because optimization itself changes the system being optimized. Humans adapt to incentives. Institutions adapt to pressure. Environments change in response to strategies imposed upon them. A solution targeting one variable may alter surrounding conditions enough to generate new tradeoffs, distortions, behaviors, or unintended consequences later. Optimization therefore becomes recursive rather than static: each intervention changes the landscape future optimization must operate inside. This is one reason large human systems rarely remain permanently solved through single-variable optimization alone.",
  "Because of this, utilitarian calculation is rarely mathematically clean in practice.",
  "At a deeper level, utilitarianism reveals something broader about human behavior itself: human beings naturally optimize.",
  "Optimization is not abnormal. It appears deeply embedded into adaptive systems generally.",
  "The optimization process can gradually consume the original experience being optimized.",
  "This reveals one of the central tensions inside utilitarian thinking: human life appears fundamentally multi-variable rather than reducible to one perfectly stable optimization metric.",
  "People do not value only one thing.",
  "This creates the recurring danger found in many optimization systems: the reduction of complex human reality into one dominant variable.",
  "At that point, systems may begin preserving metrics more than humans.",
  "The issue is not whether optimization should exist.",
  "The issue is whether human existence can ever be fully reduced to optimization alone without distorting other dimensions of reality that humans also experience as meaningful.",
  "But optimization itself can become destabilizing when one variable absorbs the complexity of existence into a single metric.",
  "Utilitarianism's strength is clarity around consequences and systemic tradeoffs.",
  "Its weakness emerges when optimization begins replacing the broader texture of human existence itself.",
  "The utilitarian answer is: optimize outcomes as carefully as possible.",
  "The remaining tension is: whether human life can ever be fully compressed into a single optimization structure without losing dimensions of existence that humans still experience as fundamentally real.",
  "A central insight of postmodernism is that descriptions are rarely fully neutral.",
  "Political and social systems therefore function less like static top-down machines and more like recursive adaptive webs.",
  "Because of this, social reality can drift surprisingly far from external reality while still remaining psychologically and institutionally stable for long periods of time.",
  "At the same time, this framework rejects the stronger postmodern conclusion that interpretation completely dissolves truth itself.",
  "Interpretation is unavoidable, but interpretive limitation does not necessarily imply that all interpretations become equally valid, coherent, predictive, or reality-aligned.",
  "The goal is not escaping interpretation completely. That may be impossible for embedded conscious beings.",
  "Postmodernism therefore functions less as a declaration that truth disappears and more as a warning against naive assumptions of perfectly neutral perception, perfectly objective systems, or final unquestionable narratives.",
  "This framework attempts to preserve the insight without accepting the collapse.",
]);

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
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        );
      })}
    </div>
  );
}

function isEmphasisNote(title: string) {
  // Don't emphasize numbered principles (1. 2. 3. etc)
  if (/^\d+\./.test(title)) {
    return false;
  }
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
