export type CurrentView = {
  id: string;
  topic: string;
  title: string;
  confidence: "High confidence" | "Working view" | "Open question";
  position: string;
  reasoning: string;
  unresolved: string;
  relatedSection: string;
};

export const currentViews: CurrentView[] = [
  {
    id: "orientation",
    topic: "Orientation",
    title: "Certainty should remain proportional to evidence.",
    confidence: "High confidence",
    position:
      "Reality does not become arbitrary because human access to it is incomplete. The practical task is to build models strong enough to guide action while keeping them open to correction.",
    reasoning:
      "People reason from inside limited bodies, histories, languages, institutions, and information environments. Some interpretations still explain more, predict better, and survive pressure more reliably than others.",
    unresolved:
      "How much uncertainty can a person preserve before a useful working position becomes too weak to guide action?",
    relatedSection: "Philosophy / Core Philosophy",
  },
  {
    id: "knowledge",
    topic: "Reality & Knowledge",
    title: "Reliable models do not require ultimate access.",
    confidence: "High confidence",
    position:
      "Humans can form dependable operational knowledge without possessing a final view of reality from outside reality itself.",
    reasoning:
      "Observation, prediction, correction, and repeatable consequences allow models to improve even when perception and interpretation remain filtered. Error is possible, but so is meaningful contact with what resists our expectations.",
    unresolved:
      "Where should the boundary sit between justified confidence and metaphysical overreach?",
    relatedSection: "Philosophy / Metaphysics & Epistemology",
  },
  {
    id: "ethics",
    topic: "Ethics",
    title: "Moral judgment should track consequences, agency, and context.",
    confidence: "Working view",
    position:
      "Ethics should reduce avoidable suffering, protect agency, and make cooperation possible without pretending that one rule resolves every conflict.",
    reasoning:
      "Intentions matter, but outcomes, power differences, incentives, and foreseeable harm matter as well. A moral framework should be stable enough to constrain behavior and flexible enough to respond to real conditions.",
    unresolved:
      "Which moral constraints should remain non-negotiable when rights, welfare, and collective stability collide?",
    relatedSection: "Philosophy / Ethics & Moral Philosophy",
  },
  {
    id: "mind",
    topic: "Mind & Consciousness",
    title: "Consciousness appears layered rather than simply present or absent.",
    confidence: "Working view",
    position:
      "Different organisms may integrate sensation, memory, social awareness, prediction, symbolism, and self-modeling in different combinations and degrees.",
    reasoning:
      "Human consciousness appears especially recursive: people can model themselves, question those models, imagine distant futures, and build symbolic systems that reshape both environment and identity.",
    unresolved:
      "Which forms of integration are sufficient for experience, and how should uncertain cases such as artificial intelligence be evaluated?",
    relatedSection: "Philosophy / Philosophy of Mind",
  },
  {
    id: "religion",
    topic: "Religion",
    title: "Religious claims deserve comparison without automatic acceptance or dismissal.",
    confidence: "Working view",
    position:
      "Religions are systems of belief and systems of interpretation. Their claims should be evaluated through consistent standards across traditions, including when evidence appears favorable or unfavorable.",
    reasoning:
      "Scriptures, experiences, institutions, historical influence, and miracle claims are all interpreted through human frameworks. The same kind of evidence should not become decisive for one tradition and irrelevant for another without a defensible reason.",
    unresolved:
      "What combination of historical, experiential, philosophical, and empirical evidence would justify moving from possibility to belief?",
    relatedSection: "Religion / Argument Patterns",
  },
  {
    id: "politics",
    topic: "Politics",
    title: "Politics is collective coordination under uncertainty.",
    confidence: "High confidence",
    position:
      "Political outcomes emerge from many partially informed actors operating through institutions, incentives, identities, competing values, and unequal forms of power.",
    reasoning:
      "Leaders do not control an entire political system from above, and citizens rarely observe the entire process directly. Political analysis should therefore examine structures and tradeoffs before reducing events to individual motives or partisan narratives.",
    unresolved:
      "How can institutions remain responsive to public judgment while resisting short-term incentives, concentrated power, and information distortion?",
    relatedSection: "Politics / Political Framework",
  },
  {
    id: "economics",
    topic: "Economics",
    title: "Markets create value, but compounding power requires guardrails.",
    confidence: "Working view",
    position:
      "An economy should preserve incentives for creation, ownership, and innovation while preventing concentrated capital from becoming permanently self-protecting political and market power.",
    reasoning:
      "Value creation and value capture are different processes. Productive competition can expand abundance, while rents, moats, monopoly, and compounding ownership can close the path to mobility even when headline economic metrics continue rising.",
    unresolved:
      "Which rules can limit structural domination without freezing experimentation, investment, or productive risk-taking?",
    relatedSection: "Economics / The Equilibrium Framework",
  },
  {
    id: "psychology",
    topic: "Human Psychology",
    title: "Attention and identity shape reasoning before argument begins.",
    confidence: "High confidence",
    position:
      "People do not merely interpret the same neutral information differently. Identity, emotion, incentives, and social environments also influence which information receives attention in the first place.",
    reasoning:
      "Beliefs can provide belonging, continuity, status, certainty, and protection from social isolation. Understanding those functions explains resistance to revision without treating people as irrational caricatures.",
    unresolved:
      "Which environments make independent evaluation more likely without stripping people of community and meaning?",
    relatedSection: "Human Psychology",
  },
  {
    id: "technology",
    topic: "Technology",
    title: "Tools should be judged by the systems they create around human agency.",
    confidence: "Working view",
    position:
      "Technological capability is not automatically progress. Its value depends on how it changes power, attention, incentives, dependence, opportunity, and the ability of people to act deliberately.",
    reasoning:
      "A tool can expand creativity and access while also centralizing control or weakening judgment. The relevant unit of analysis is therefore not only the device or model, but the surrounding social and institutional system.",
    unresolved:
      "How should societies preserve the agency-enhancing benefits of artificial intelligence while limiting concentration, manipulation, and dependency?",
    relatedSection: "Technology",
  },
];
