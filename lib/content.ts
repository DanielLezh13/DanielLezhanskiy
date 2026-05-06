export type ArgumentBlock = {
  title: string;
  claim: string;
  response: string;
};

export type ReadingSection = {
  id: string;
  label: string;
  title: string;
  eyebrow: string;
  intro: string;
  contentBlocks: string[];
  arguments: ArgumentBlock[];
  visual?: {
    symbol: string;
    accent: string;
    families: string[];
  };
  notes?: {
    title: string;
    body?: string;
    items?: string[];
  }[];
  keyIdeas: string[];
};

export type TopicGroup = {
  id: string;
  label: string;
  title: string;
  intro: string;
  contentBlocks?: string[];
  afterLayers?: string[];
  layers?: {
    title: string;
    description: string;
    examples: string[];
    note?: string;
  }[];
  argumentPatternGroups?: ArgumentPatternGroup[];
  keyIdeas: string[];
  children: ReadingSection[];
};

export type ArgumentPattern = {
  title: string;
  claim: string;
  issue: string;
  takeaway: string;
};

export type ArgumentPatternGroup = {
  title: string;
  intro: string;
  patterns: ArgumentPattern[];
};

export type NavTopic =
  | TopicGroup
  | {
      id: string;
      label: string;
      title: string;
      intro: string;
      contentBlocks?: string[];
      afterLayers?: string[];
      layers?: {
        title: string;
        description: string;
        examples: string[];
        note?: string;
      }[];
      argumentPatternGroups?: ArgumentPatternGroup[];
      keyIdeas: string[];
      children?: never;
    };

export const startSection: ReadingSection = {
  id: "start-here",
  label: "Start Here",
  eyebrow: "Before the Framework",
  title: "A Map for Thinking Clearly",
  intro:
    "This project is a personal reading system for sorting belief, uncertainty, identity, politics, technology, and the way people decide what feels true.",
  contentBlocks: [
    "It starts with religion because religion is one of the clearest places to observe arguments, certainty, interpretation, identity, community, and disagreement all operating at once.",
    "But the larger project is not only about religion. It is about how ideas become systems, how systems become identities, and how identity changes the way people handle evidence.",
    "The goal is not to force a simple side. The goal is to build a cleaner relationship with truth: what is proven, what is plausible, what is useful, what is unresolved, and what deserves more restraint.",
  ],
  arguments: [],
  notes: [
    {
      title: "How to Read This",
      items: [
        "Start with the broad map before judging individual arguments.",
        "Separate the structure of an argument from the religion using it.",
        "Notice when evidence increases plausibility without fully closing uncertainty.",
        "Treat uncertainty as something to examine, not something to hide.",
      ],
    },
  ],
  keyIdeas: [
    "This is a thinking system, not only a religion section.",
    "Religion is the first case study because it reveals belief, certainty, and identity clearly.",
    "The project separates meaning, usefulness, plausibility, and proof.",
    "The larger aim is clearer judgment under uncertainty.",
  ],
};

export const religionSections: ReadingSection[] = [
  {
    id: "islam",
    label: "Islam",
    eyebrow: "Religion / Islam",
    title: "Islam Arguments",
    intro:
      "These are the concrete Islam-specific arguments from the older notes, now organized as collapsible claim and response blocks.",
    contentBlocks: [
      "The point is not to treat every argument as unrelated. Most of them connect back to the shared patterns above: cause, revelation, scripture, preservation, interpretation, experience, and prophecy.",
    ],
    visual: {
      symbol: "☪",
      accent: "emerald",
      families: [
        "Creator / first cause",
        "Revelation and prophets",
        "Qur'an as proof",
        "Preservation and inimitability",
        "Experience and prophecy",
      ],
    },
    arguments: [
      {
        title: "1. Everything needs a creator -> therefore God",
        claim:
          "Nothing can exist without a maker.\nAdd-on: God is the only exception.",
        response:
          "I understand what you are saying, but that rule itself needs proof. You are saying everything needs a creator, and then you say God is the exception. The question is: how do we know that exception is actually true? If one exception is allowed, then it is possible there are other explanations too. So I cannot accept that the universe must have a creator for sure.",
      },
      {
        title: "2. Messengers + holy books = proof",
        claim:
          "Prophets were sent by God.\nEvidence: miracles written in books.",
        response:
          "I understand you believe that God sent messengers, but how do we know those messages are truly from God and not just human claims? Many religions say the same thing and have miracle stories too, and they cannot all be true at the same time. So just having these stories written in books is not enough proof for me.",
      },
      {
        title: "3. Other religions are altered, Islam is final truth",
        claim:
          "Other books were changed.",
        response:
          "I get that idea, but saying other religions were changed and yours is correct depends on already believing in your religion. People from other religions say the same thing about their books. So that does not really help me figure out which one is actually true.",
      },
      {
        title: "4. The Qur'an is a miracle in itself",
        claim: "The text proves divinity.",
        response:
          "I understand what you mean, but saying the Qur'an is a miracle is still a belief, not something that can be clearly verified. A text can be strong or meaningful, but that does not automatically make it divine. There are many powerful texts in history written by humans.",
      },
      {
        title: "5. Muhammad could not read/write -> must be from God",
        claim: "Illiteracy proves divine source.",
        response:
          "I understand that point, but not being able to read or write does not prove the words are from God. At that time, people relied a lot on memory and oral communication, so someone could still learn and express complex ideas without reading or writing. So this alone is not enough proof.",
      },
      {
        title: "6. Scientific knowledge: water = life",
        claim: "Qur'an mentions unknown facts.",
        response:
          "The idea that living things need water is something people could observe in a basic way from everyday life. It is not necessarily advanced scientific knowledge that no one could have known. So that does not really prove a divine source.",
      },
      {
        title: "7. No contradictions in the Qur'an",
        claim: "Perfect consistency = divine.",
        response:
          "Even if someone believes there are no contradictions, that does not prove it is divine. Different people interpret texts in different ways. Some see consistency, others see differences. So that depends on interpretation, not something that can be objectively proven.",
      },
      {
        title: "8. God said it -> therefore true",
        claim: "The Qur'an validates itself.",
        response:
          "Saying 'God said it' depends on already believing the Qur'an is from God, and that is the thing we are trying to prove. So using it as proof becomes circular. We would need independent evidence outside the text.",
      },
      {
        title: "9. Personal experience / it answered my questions",
        claim: "Personal conviction = truth.",
        response:
          "I understand that it feels meaningful to you, but feeling like a book answers your questions does not prove it is true in an absolute sense. People in many different religions feel the same way about their own books, so that alone is not enough evidence for me. Often, that feeling comes from what the belief provides during times of uncertainty: clear answers, structure, and stability. That can make it feel especially convincing, even if that does not necessarily mean it is true.",
      },
      {
        title: "10. Everything has a cause -> first cause",
        claim:
          "Causes cannot go back infinitely.\nConclusion: there must be a starting point -> God.",
        response:
          "I understand the idea, but this still assumes that the chain of causes must end in something like God. We do not actually know that infinite regress is impossible, and even if there is a first cause, there is no clear proof that it has to be a conscious being like God. So this explains something, but it does not prove that specific conclusion.",
      },
      {
        title: "11. Fine-tuning / perfect design",
        claim:
          "The universe is too precise for life.\nConclusion: it must be designed.",
        response:
          "I get why it looks that way, but saying the universe is perfectly designed is more of an interpretation than a proven fact. Most of the universe is actually hostile to life, and we are observing it from the position of being able to exist in it. So it might look tuned for us, but that does not necessarily mean it was intentionally designed.",
      },
      {
        title: "12. Objective morality requires God",
        claim: "Right and wrong must come from a higher source.",
        response:
          "I understand that perspective, but morality can also be explained through human behavior, social systems, and shared values. People across different cultures and beliefs still develop similar ideas of right and wrong without agreeing on the same religion. So morality existing does not automatically prove it comes from God.",
      },
      {
        title: "13. Life must have a purpose -> God gives that purpose",
        claim:
          "Existence needs meaning.\nConclusion: God provides it.",
        response:
          "I get that people want a clear purpose, but wanting something to have meaning does not prove that it actually comes from a higher source. It could also be something humans create for themselves. So this explains why people believe, but it does not prove that God exists.",
      },
      {
        title: "14. Prophecies prove divine origin",
        claim: "Predictions came true.",
        response:
          "Even if something looks like a prediction, it is often open to interpretation. People can read meanings into events after they happen or interpret vague statements in different ways. So it is hard to use that as clear, objective proof.",
      },
      {
        title: "15. The Qur'an is perfectly preserved",
        claim: "Unchanged text = divine.",
        response:
          "Even if a text is well preserved, that shows how carefully it was maintained, not necessarily that it is divine. There are other historical texts that have also been preserved well. So preservation alone does not prove the source is from God.",
      },
      {
        title: "16. No one can produce something like it",
        claim: "Unmatched text = divine.",
        response:
          "Saying something cannot be matched is subjective. It depends on language, culture, and personal judgment. People from other traditions make similar claims about their own texts. So it is not something that can be objectively proven.",
      },
      {
        title: "17. Scientific miracles / predictions in scripture",
        claim:
          "The text contains knowledge people could not have known -> proves divine origin.",
        response:
          "I understand why that feels convincing, but this kind of argument usually relies on interpreting general or vague verses after we already have modern knowledge. That is post hoc interpretation: people match the text to what we now know rather than the text making a clear, testable prediction ahead of time. It also involves confirmation bias, where examples that seem to fit are highlighted while others are ignored. Because the language can be general or flexible, it can feel accurate even if it was not a clear, specific prediction. That is why it is hard for me to treat it as strong proof on its own.",
      },
    ],
    notes: [
      {
        title: "My Stance",
        body:
          "All of these arguments seem different on the surface, but they usually come down to the same pattern: they start with an idea, then interpret things in a way that supports that idea. Some rely on assumptions, some rely on subjective interpretation, and others rely on belief in a source to prove that same source. For me, none of these are strong enough on their own to clearly prove that the conclusion must be true. They explain why someone might believe, but they do not provide clear, objective evidence that can be verified independently. That is why I stay open to the idea, but not convinced without stronger proof.",
      },
    ],
    keyIdeas: [
      "Islam arguments often combine creator claims, revelation, scripture, preservation, and personal conviction.",
      "Several arguments depend on accepting the Qur'an's authority first.",
      "Scientific miracle claims often depend on interpretation after the fact.",
      "The stance stays open but asks for stronger independent evidence.",
    ],
  },
  {
    id: "christianity",
    label: "Christianity",
    eyebrow: "Religion / Christianity",
    title: "Christianity Arguments",
    intro:
      "These arguments focus on resurrection, scripture, miracles, faith, experience, morality, salvation, and transformation.",
    contentBlocks: [
      "The structure is close to the Islam section: broad truth claims, text-based authority, personal experience, and existential appeals.",
    ],
    visual: {
      symbol: "✝",
      accent: "sky",
      families: [
        "Resurrection and miracles",
        "Bible as authority",
        "Faith and salvation",
        "Transformation",
        "Meaning and morality",
      ],
    },
    arguments: [
      {
        title: "1. Jesus rose from the dead -> proves he is divine",
        claim: "Resurrection = strongest evidence.",
        response:
          "I understand why that is important, but the resurrection is based on accounts written after the events, not something we can directly verify. Other religions also have miracle stories, so I cannot treat one set as definite proof without stronger independent evidence. It might be meaningful, but that does not make it proven.",
      },
      {
        title: "2. The Bible is the word of God",
        claim: "Scripture is divine authority.",
        response:
          "I understand that you believe the Bible is from God, but that is the claim we are trying to prove. Using the Bible to prove itself becomes circular reasoning. Also, other religions believe their books are from God too, so I need something outside the text itself to be convinced.",
      },
      {
        title: "3. Prophecies in the Bible came true",
        claim: "Predictions -> divine origin.",
        response:
          "Even if something looks like a prophecy, it is often open to interpretation. People can read meaning into events after they happen, or interpret vague statements in different ways. So it is hard to use that as clear, objective proof.",
      },
      {
        title: "4. Jesus performed miracles",
        claim: "Healing, raising the dead, and other miracles.",
        response:
          "I understand that miracles are a big part of the belief, but these stories come from historical accounts, not something we can verify directly. Many religions have miracle stories, and they cannot all be true in the same way. So that alone is not enough for me to be certain.",
      },
      {
        title: "5. The disciples would not die for a lie",
        claim: "Strong belief -> must be true.",
        response:
          "I understand that shows strong belief, but people in many different religions and movements have been willing to die for what they believe. That shows sincerity, not necessarily truth. So it does not prove the belief itself is correct.",
      },
      {
        title: "6. Faith is required",
        claim: "Belief without proof is part of it.",
        response:
          "I understand that faith is important in religion, but for me, belief without enough evidence does not feel rational. I am open to the idea, but I need something stronger than just faith to be convinced.",
      },
      {
        title: "7. God is personal / you can feel Him",
        claim: "Personal experience = proof.",
        response:
          "I understand that experience feels real, but people in many different religions feel the same kind of connection. That makes it hard to use personal feeling as objective proof, since it varies from person to person.",
      },
      {
        title: "8. Morality comes from God through Jesus",
        claim: "Moral truth -> divine source.",
        response:
          "I understand that perspective, but people from many different beliefs still share similar moral values. That suggests morality can come from human experience and social systems, not necessarily from a single religious source.",
      },
      {
        title: "9. Only through Jesus is salvation",
        claim: "Exclusive truth path.",
        response:
          "I understand that is a core belief, but other religions also claim exclusive truth. So without clear evidence, I cannot accept one exclusive path over all others just based on belief.",
      },
      {
        title: "10. Pascal's Wager",
        claim:
          "If God exists, believing = reward; if not, you lose nothing.",
        response:
          "I understand the idea, but believing something just because it might benefit you is not a good way to determine if it is true. Also, many religions make similar claims about rewards and consequences, so choosing one just to be safe does not really solve which one is actually correct.",
      },
      {
        title: "11. Changed lives / transformation",
        claim:
          "Christianity changes people through recovery, purpose, and direction.",
        response:
          "I understand it changed people's lives, and that matters. But a belief having positive effects does not prove it is true. People in different religions, and even outside religion, also experience major life changes, recovery, and purpose. What that shows is that belief can be powerful psychologically: it gives structure, certainty, community, and direction. Those things can improve someone's life regardless of whether the belief is objectively true.",
      },
      {
        title: "12. Relationship with God",
        claim: "Direct relationship with Jesus.",
        response:
          "I understand that it feels like a real connection, but people in different religions also describe similar personal experiences with their own beliefs. That makes it hard to use personal feelings as objective proof.",
      },
      {
        title: "13. Without God, life has no meaning",
        claim: "Belief gives purpose.",
        response:
          "I understand why that is important, but meaning can also be something people create for themselves through relationships, goals, and experiences. The need for meaning does not prove that a specific belief is true.",
      },
      {
        title: "14. Sin + need for salvation",
        claim: "Humans are flawed -> Jesus is the solution.",
        response:
          "I understand that idea, but recognizing that humans make mistakes does not necessarily prove that a specific religious solution is the correct one. Different belief systems explain human behavior in different ways, so I need more than that to be convinced.",
      },
      {
        title: "15. The church has lasted 2000 years",
        claim: "Longevity = truth.",
        response:
          "I understand that it has lasted a long time, but many systems, traditions, and cultures have lasted for long periods without that meaning they are objectively true. Longevity shows influence and stability, not necessarily truth.",
      },
      {
        title: "16. Scientific miracles / predictions in scripture",
        claim:
          "The text contains knowledge people could not have known -> proves divine origin.",
        response:
          "I understand why that feels convincing, but this kind of argument usually relies on interpreting general or vague verses after we already have modern knowledge. That is post hoc interpretation and confirmation bias. Examples that seem to fit are highlighted while others are ignored. Because of that, it is hard to treat this as clear, objective proof. It explains why it feels meaningful, but it does not show that the source must be divine.",
      },
    ],
    notes: [
      {
        title: "Meta-Pattern",
        items: [
          "Truth claims: resurrection, Bible, miracles.",
          "Existential appeals: meaning, purpose, transformation.",
          "Pragmatic arguments: better to believe, safety, heaven and hell.",
        ],
      },
      {
        title: "Key Insight",
        body:
          "It is almost the same structure as Islam, just with different names, events, and texts.",
      },
      {
        title: "Summary Stance",
        items: [
          "Meaningful does not equal proven.",
          "Belief does not equal evidence.",
          "Experience does not equal objective truth.",
        ],
      },
      {
        title: "Final Conclusion",
        body:
          "All of these arguments may explain why belief feels convincing or helpful, but they do not provide clear, objective evidence that can be independently verified. Many rely on interpretation, personal experience, or assumptions rather than proof. That is why I can stay open to the idea, but not be convinced without stronger evidence.",
      },
    ],
    keyIdeas: [
      "Christianity arguments center on resurrection, scripture, miracles, and salvation.",
      "Changed lives and personal relationship claims are powerful but subjective.",
      "Longevity and sincerity show influence, not necessarily truth.",
      "The structure strongly overlaps with other religions.",
    ],
  },
  {
    id: "judaism",
    label: "Judaism",
    eyebrow: "Religion / Judaism",
    title: "Judaism Arguments",
    intro:
      "These arguments focus on Sinai, Torah, covenant, law, identity, moral command, and historical continuity.",
    contentBlocks: [
      "Judaism overlaps structurally with Islam through monotheism, law, revelation, text, and tradition, while placing stronger emphasis on peoplehood and inherited identity.",
    ],
    visual: {
      symbol: "✡",
      accent: "violet",
      families: [
        "Sinai and revelation",
        "Torah and divine law",
        "Covenant and peoplehood",
        "Continuity and identity",
        "Moral command",
      ],
    },
    arguments: [
      {
        title: "1. God revealed Himself to the Israelites at Mount Sinai",
        claim: "A whole group witnessed God -> stronger than individual claims.",
        response:
          "I understand why that seems stronger, but this is still based on accounts passed down over time, not something we can independently verify. Other traditions also claim large events or shared experiences, so I cannot treat this as clear proof without more direct evidence.",
      },
      {
        title: "2. The Torah is from God",
        claim: "Divine law given to Moses.",
        response:
          "I understand that belief, but saying the Torah is from God is the claim we are trying to prove. Using the text to validate itself becomes circular. Also, other religions claim their texts are divine too, so I need something outside the text to be convinced.",
      },
      {
        title: "3. Long historical continuity",
        claim: "Jewish tradition has survived thousands of years.",
        response:
          "I understand that it has lasted a long time, but many cultures and belief systems have also lasted for long periods. Longevity shows stability and influence, not necessarily that the belief itself is objectively true.",
      },
      {
        title: "4. Covenant with God",
        claim: "Special relationship between God and the Jewish people.",
        response:
          "I understand that this is a core belief, but other groups and religions also believe they have a special relationship with a higher power. Without clear evidence, I cannot accept one specific claim like that over others.",
      },
      {
        title: "5. The law is too detailed to be human",
        claim: "Complexity -> divine origin.",
        response:
          "I understand that the law is detailed, but complexity alone does not prove something is from God. Humans are capable of creating very detailed systems of rules and structures, so that does not necessarily prove a divine source.",
      },
      {
        title: "6. Preservation of identity and tradition",
        claim: "Strong cultural survival = truth.",
        response:
          "I understand that maintaining identity over time is impressive, but it shows cultural strength and continuity, not necessarily that the beliefs themselves are objectively true.",
      },
      {
        title: "7. Moral law from God",
        claim: "Ethics come from divine command.",
        response:
          "I understand that perspective, but people across many different cultures and beliefs share similar moral values. That suggests morality can also come from human experience and social development, not necessarily a single divine source.",
      },
      {
        title: "8. Messianic expectation",
        claim: "Truth will be proven in the future.",
        response:
          "I understand that idea, but saying something will be proven in the future does not provide evidence right now. It is a belief about what might happen, not something that can be verified at the moment.",
      },
    ],
    notes: [
      {
        title: "Meta-Pattern",
        items: [
          "Revelation claims: Sinai event, Torah.",
          "Continuity claims: survival, identity.",
          "Covenant / exclusivity: chosen people, special relationship.",
          "Moral law: ethics from God.",
        ],
      },
      {
        title: "Key Insight",
        body:
          "Structurally, it is very close to Islam: one God, a law-based system, revelation, and text. But it is less focused on converting others and more tied to identity and tradition.",
      },
      {
        title: "Summary Stance",
        items: [
          "Tradition does not equal proof.",
          "Longevity does not equal truth.",
          "Belief does not equal evidence.",
        ],
      },
      {
        title: "Final Conclusion",
        body:
          "These arguments explain why the belief system is stable and meaningful to the people who follow it, but they do not provide clear, independently verifiable evidence that the claims are objectively true. Most rely on tradition, authority, or interpretation rather than proof. That is why I can understand the belief, but not be convinced without stronger evidence.",
      },
    ],
    keyIdeas: [
      "Judaism arguments emphasize revelation, Torah, covenant, law, and continuity.",
      "Survival and identity show stability, not automatic truth.",
      "The structure is close to Islam but more tied to inherited peoplehood.",
      "The stance separates meaning and tradition from independent proof.",
    ],
  },
];

export const topics: NavTopic[] = [
  {
    id: "religion",
    label: "Part 2 — Argument Patterns",
    title: "Part 2 — Argument Patterns",
    intro:
      "Before looking at specific religions, it is useful to recognize a pattern: many of the arguments used to support belief repeat across different systems. They may appear different on the surface, but they often rely on similar types of reasoning.",
    contentBlocks: [
      "These arguments do not just attempt to prove something is true. They also serve to reinforce belief, reduce uncertainty, and maintain consistency within the system.",
      "To understand them more clearly, it helps to separate them into layers, ranging from broad, high-level claims to more detailed internal reasoning.",
    ],
    layers: [
      {
        title: "Layer 1 — Foundational Claims",
        description:
          "These are broad arguments about existence, meaning, or origin. They operate at a high level and are meant to establish the base of the belief.",
        examples: [
          "Everything needs a creator",
          "There must be a first cause",
          "Life must have purpose",
        ],
      },
      {
        title: "Layer 2 — System-Level Justification",
        description:
          "These arguments try to validate a specific religion as true. This is where different religions begin to diverge while using similar structures.",
        examples: [
          "Holy books",
          "Prophets",
          "Miracles",
          "Consistency of the text",
        ],
      },
      {
        title: "Layer 3 — Internal Interpretation and Detail",
        description:
          "At this level, the focus shifts to specific rules, verses, and interpretations within the system.",
        examples: [
          "Interpretation of specific passages",
          "Small doctrinal differences",
          "Rules and edge cases",
        ],
        note:
          "At this point, the discussion is no longer about whether the system is true, but about how it should be understood.",
      },
    ],
    afterLayers: [
      "Most discussions do not stay in one layer. People often move between layers without noticing: starting with a broad claim, shifting to system-level validation, then narrowing into detailed interpretation.",
      "This creates the impression of depth, but the underlying structure often remains the same. With that in mind, the following sections look at common arguments within specific religions, not just individually, but as examples of these repeating patterns.",
    ],
    argumentPatternGroups: [
      {
        title: "Layer 1 — Foundational Claims",
        intro: "These arguments try to establish the base of belief itself.",
        patterns: [
          {
            title: "Universal Cause",
            claim:
              "Everything must have a cause, therefore the universe must have a creator.",
            issue:
              "The rule is applied selectively. If everything needs a cause, the creator would too.",
            takeaway:
              "Allowing one exception weakens the argument and opens alternative explanations.",
          },
          {
            title: "First Cause",
            claim:
              "Causes cannot go back infinitely, so there must be a starting point: God.",
            issue:
              "Even if a first cause exists, it does not necessarily imply a conscious or specific religious entity.",
            takeaway:
              "The conclusion extends beyond what the premise proves.",
          },
          {
            title: "Something Cannot Come From Nothing",
            claim: "The universe must have a cause, which is God.",
            issue:
              "This assumes that the origin of the universe follows the same cause-and-effect rules observed within it.",
            takeaway:
              "Even if a cause exists, identifying that cause as God is an additional conclusion that has not been demonstrated.",
          },
          {
            title: "Complexity of the World",
            claim: "Complexity implies a designer.",
            issue:
              "Complexity can arise through natural processes over time.",
            takeaway:
              "The argument assumes design without showing that design is the only possible explanation.",
          },
          {
            title: "Purpose Requires God",
            claim: "Life must have meaning, and God provides that meaning.",
            issue:
              "Wanting meaning does not prove an external source for it.",
            takeaway: "Meaning can be constructed rather than assigned.",
          },
          {
            title: "Morality Requires God",
            claim: "Right and wrong must come from a higher authority.",
            issue:
              "Similar moral systems exist across different cultures without agreement on a single source.",
            takeaway:
              "Morality can emerge from social behavior, not necessarily a divine origin.",
          },
          {
            title: "Explanatory Gaps",
            claim: "Science does not explain everything, so gaps support belief in God.",
            issue:
              "A lack of explanation does not confirm a specific explanation.",
            takeaway: "Unknown does not equal proven.",
          },
          {
            title: "Unseen Reality",
            claim: "God is like air or gravity: unseen but real.",
            issue:
              "Air and gravity are not accepted simply because they are unseen. They are measurable and produce consistent, testable effects.",
            takeaway:
              "The comparison assumes all unseen things should be treated equally, which is not established.",
          },
        ],
      },
      {
        title: "Layer 2 — System-Level Justification",
        intro: "These arguments attempt to prove a specific religion is true.",
        patterns: [
          {
            title: "Revelation via Messengers",
            claim:
              "God sent prophets whose messages are recorded in holy texts.",
            issue:
              "Multiple religions make the same claim with conflicting conclusions.",
            takeaway: "Claims of revelation are not self-validating.",
          },
          {
            title: "Scripture as Proof",
            claim: "The text itself proves it is divine.",
            issue:
              "Judgments about uniqueness or depth are subjective.",
            takeaway:
              "Meaningful or powerful text does not equal divine origin.",
          },
          {
            title: "Scientific Miracles",
            claim:
              "The text contains knowledge people could not have known.",
            issue:
              "Often relies on post hoc interpretation and confirmation bias.",
            takeaway:
              "Retrofitting meaning to known facts is not predictive evidence.",
          },
          {
            title: "No Contradictions",
            claim: "Perfect consistency proves divinity.",
            issue:
              "Consistency depends on interpretation, which varies between readers.",
            takeaway:
              "Interpretation prevents this from being objective proof.",
          },
          {
            title: "Preservation",
            claim: "The text being preserved proves it is divine.",
            issue: "Preservation shows careful transmission, not origin.",
            takeaway:
              "A well-preserved text is not necessarily a divine one.",
          },
          {
            title: "Inimitability",
            claim:
              "No one can produce something like it, therefore it is divine.",
            issue:
              "Standards of match are subjective and culturally dependent.",
            takeaway:
              "Unmatched status cannot be objectively established.",
          },
          {
            title: "Prophecy",
            claim: "Predictions coming true prove divine origin.",
            issue:
              "Often vague and interpreted after events occur.",
            takeaway:
              "Ambiguous predictions are not strong evidence.",
          },
        ],
      },
      {
        title: "Layer 3 — Internal and Defensive Reinforcement",
        intro:
          "These arguments operate within the belief system or defend it against outside pressure.",
        patterns: [
          {
            title: "Self-Validation",
            claim: "The text is true because it says it is from God.",
            issue: "Circular reasoning.",
            takeaway: "Claims require external verification.",
          },
          {
            title: "Personal Experience",
            claim:
              "The belief feels true because it provides clarity or meaning.",
            issue:
              "Similar experiences occur across conflicting belief systems.",
            takeaway:
              "Subjective conviction does not determine objective truth.",
          },
          {
            title: "Belief Without Proof",
            claim:
              "People accept things without proof, so belief in God is equivalent.",
            issue:
              "Not all beliefs are supported in the same way. Some are supported by consistent evidence, testing, or observable effects.",
            takeaway:
              "Treating all unproven beliefs as equivalent removes the difference in how they are supported.",
          },
          {
            title: "Widespread Belief",
            claim: "Large numbers of believers suggest truth.",
            issue:
              "Large numbers of people can believe different and conflicting things.",
            takeaway:
              "Belief spreading through culture or environment does not confirm that it is true.",
          },
          {
            title: "Cannot Disprove God",
            claim: "Since God cannot be disproven, belief is justified.",
            issue:
              "The inability to disprove something does not make it true.",
            takeaway: "The claim still requires evidence.",
          },
          {
            title: "It Just Makes Sense",
            claim: "The belief is logical and coherent.",
            issue:
              "A system can feel internally consistent while still being based on assumptions.",
            takeaway:
              "Different belief systems can be internally consistent while contradicting each other.",
          },
          {
            title: "Have You Read the Book?",
            claim:
              "If the scripture has not been read, its truth cannot be judged.",
            issue:
              "Reading a text helps clarify its claims, but it does not verify that those claims are true.",
            takeaway:
              "Different religions have readable texts with conflicting conclusions; reading alone does not establish which one is correct.",
          },
          {
            title: "You Need to Understand It Properly",
            claim: "Disagreement comes from misunderstanding the text.",
            issue:
              "Interpretation varies between readers, including within the same religion.",
            takeaway:
              "Disagreement is not necessarily misunderstanding; it can come from differences in how the text is understood.",
          },
          {
            title: "You Are Taking It Out of Context",
            claim:
              "The argument only fails because it is being interpreted incorrectly.",
            issue:
              "Context can change meaning, but different interpretations of context can lead to different conclusions.",
            takeaway:
              "If understanding depends on interpretation, context cannot function as clear independent proof.",
          },
          {
            title: "Scholars Have Already Proven This",
            claim: "Experts or scholars validate the truth of the religion.",
            issue:
              "Scholars can interpret, explain, and defend a belief system.",
            takeaway:
              "Scholarship does not independently verify core truth claims, and other religions also have scholars who reach different conclusions.",
          },
        ],
      },
    ],
    keyIdeas: [
      "Religious arguments often repeat across different systems.",
      "Separate broad claims from system-level proofs and internal details.",
      "Watch for discussions shifting layers without saying so.",
      "Specific religions can be compared by their shared argument patterns.",
    ],
    children: religionSections,
  },
];

export const frameworkSections: ReadingSection[] = [
  {
    id: "religion-overviews",
    label: "Part 1 — Religion Overviews",
    title: "Part 1 — Religion Overviews",
    eyebrow: "Descriptive Context",
    intro:
      "Before analyzing religious arguments, belief formation, or certainty claims, it is important to understand the systems themselves at a basic structural level.",
    contentBlocks: [
      "This section is not meant to debunk religion or reduce entire belief systems to a few arguments. Religions are large frameworks that contain metaphysical claims, moral systems, identity structures, historical development, behavioral expectations, interpretive traditions, internal disagreements, and different methods of understanding truth.",
      "Because of this, no religion exists as a single perfectly unified position. The same text can produce multiple interpretations, sects, schools of thought, and conflicting conclusions over time. This matters because many debates about religion assume there is one universally agreed interpretation when, in practice, interpretation itself is part of the system.",
      "The goal of these overviews is to establish a baseline understanding of how each religion formed, what it claims, how it spread, how authority and interpretation function, how branches emerged, and how the religion has shaped culture and society.",
      "Understanding the system first makes later discussions about arguments, miracle claims, prophecy, mathematical patterns, belief reinforcement, and the difference between plausibility and proof easier to evaluate in context.",
    ],
    arguments: [],
    notes: [
      {
        title: "Islam — Overview",
        body:
          "Origin\nIslam emerged in 7th-century Arabia through the teachings of Muhammad, who Muslims believe received revelations from God that became the Qur'an. It formed within a tribal and polytheistic environment and quickly developed into both a religious community and a political order.\n\nCore Beliefs\nCentral beliefs include one God (Allah), Muhammad as the final prophet, the Qur'an as final revelation, judgment, accountability, heaven and hell, and submission to God's will. Islam also emphasizes structured practice through prayer, fasting, charity, pilgrimage, and religious law.\n\nText and Authority\nThe Qur'an is considered the direct word of God within Islam. Additional guidance comes through Hadith literature, which records sayings and actions attributed to Muhammad. Interpretation plays a major role in practice. Different scholars, schools, and traditions can reach different conclusions from the same foundational texts.\n\nInternal Variation\nIslam is not fully uniform. Major divisions include Sunni and Shia Islam. Differences originally emerged around leadership succession after Muhammad's death, but expanded into broader theological, legal, and institutional differences over time. Within those branches, additional schools of interpretation exist, ranging from more literal to more symbolic or reform-oriented approaches.\n\nExpansion and Historical Role\nIslam spread through military expansion, trade networks, empire-building, cultural integration, scholarship, and missionary influence. Over time it became deeply tied to governance, law, education, identity, and civilization across multiple regions.\n\nCulture and Society\nIslam has shaped daily life through prayer rhythms, fasting periods, dietary rules, family norms, community obligations, charity, dress practices, education, and legal traditions. In some societies it functions mainly as personal faith and cultural identity; in others it also shapes law, political legitimacy, public morality, and social expectations.\n\nStructural Observation\nOne recurring tension inside Islam, and religion more broadly, is the relationship between fixed revelation and human interpretation. The same source text can produce multiple conclusions depending on methodology, historical context, language, authority structures, and interpretive framework. This becomes important later when examining certainty claims, scientific miracle arguments, and disagreements over what the religion actually teaches.",
      },
      {
        title: "Christianity — Overview",
        body:
          "Origin\nChristianity began in the 1st century within a Jewish context in the eastern Roman Empire. It formed around the life, teachings, death, and reported resurrection of Jesus of Nazareth, whom Christians identify as the Christ. Early Christian communities spread through preaching, missionary activity, urban networks, and eventually imperial support.\n\nCore Beliefs\nCentral beliefs often include one God, the divinity of Jesus, sin, salvation, resurrection, judgment, grace, and eternal life. Christian traditions differ in how they understand salvation, sacraments, church authority, scripture, and the relationship between faith and works.\n\nText and Authority\nThe Bible is Christianity's primary scripture and includes the Old and New Testaments. Authority is understood differently across traditions. Catholicism gives major authority to scripture, church tradition, and the teaching office of the church. Protestant traditions tend to emphasize scripture more directly. Orthodoxy emphasizes scripture, tradition, liturgy, and continuity with the early church.\n\nInternal Variation\nChristianity is not one uniform system. Major branches include Catholicism, Orthodoxy, and Protestantism, with many denominations and theological differences within them. Disagreements have formed around church authority, salvation, sacraments, biblical interpretation, saints, Mary, clergy, morality, and modern social questions.\n\nExpansion and Historical Role\nChristianity spread through missionary work, Roman imperial adoption, monastic movements, colonial expansion, education, translation, and global institutions. It became deeply connected to European law, art, philosophy, universities, charity, political legitimacy, and later secular reactions against religious authority.\n\nCulture and Society\nChristianity has shaped moral language, family ideals, holidays, art, music, architecture, education, healthcare, charity, political movements, and concepts of personhood and dignity. It has also been tied to state power, colonial history, reform movements, abolition movements, social conservatism, liberation theology, and modern debates about secularism.\n\nStructural Observation\nA recurring tension in Christianity is the relationship between scripture, tradition, church authority, and personal interpretation. The same Bible can produce different doctrines, denominations, and moral conclusions depending on interpretive framework. This matters later when examining claims about prophecy, miracles, scripture, personal experience, and exclusive truth.",
      },
      {
        title: "Judaism — Overview",
        body:
          "Origin\nJudaism developed in the ancient Near East and is rooted in the covenantal traditions of the Israelites. It is one of the oldest monotheistic religions and is closely tied to the history, law, memory, and identity of the Jewish people. After the destruction of the Second Temple in 70 CE, Jewish life increasingly centered on scripture, rabbinic interpretation, synagogue life, law, and communal practice.\n\nCore Beliefs\nJudaism centers on one God, covenant, Torah, commandment, community, memory, and ethical responsibility. It places strong emphasis on law and practice, though Jewish belief and observance vary widely across communities and individuals.\n\nText and Authority\nThe Torah is central, along with the wider Hebrew Bible and later rabbinic writings such as the Mishnah, Talmud, commentaries, legal codes, and responsa. Authority often functions through interpretation, legal reasoning, tradition, communal practice, and rabbinic scholarship rather than a single centralized institution for all Jews.\n\nInternal Variation\nJudaism is not fully uniform. Major modern branches include Orthodox, Conservative, Reform, Reconstructionist, and secular or cultural Jewish identities. Differences involve law, observance, scripture, tradition, modernity, gender, conversion, Zionism, and the role of rabbinic authority.\n\nExpansion and Historical Role\nJudaism developed through ancient Israelite religion, exile, diaspora, rabbinic scholarship, migration, persecution, adaptation, and community preservation. The diaspora shaped Judaism into a tradition deeply concerned with memory, continuity, law, education, and maintaining identity across changing societies.\n\nCulture and Society\nJudaism has shaped communal life through Sabbath, dietary laws, festivals, lifecycle rituals, education, family identity, synagogue life, textual study, and collective memory. It is both a religion and, for many, an ethnic, cultural, historical, and civilizational identity. Jewish communities have often had to negotiate the boundary between integration into surrounding societies and preservation of distinct identity.\n\nStructural Observation\nA recurring tension in Judaism is the relationship between covenant, law, interpretation, and peoplehood. The tradition is not only a set of claims about God, but a system of memory, practice, law, and communal continuity. This becomes important later when examining arguments from revelation, preservation, identity, continuity, and moral law.",
      },
    ],
    keyIdeas: [
      "Religions are systems of belief, practice, identity, authority, and interpretation.",
      "No major religion exists as a single perfectly unified position.",
      "Interpretation is part of the system, not an outside detail.",
      "Culture and society shape how religions are lived and understood.",
    ],
  },
  {
    id: "probability-convergence-certainty",
    label: "Part 3 — Probability, Convergence, and Certainty",
    title: "Part 3 — Probability, Convergence, and Certainty",
    eyebrow: "Evidence Thresholds",
    intro:
      "This section looks at how separate arguments combine into a sense of certainty. The issue is not only whether individual patterns exist, but what conclusion should be drawn when many patterns appear to converge.",
    contentBlocks: [
      "The debate is often framed as whether the patterns are real. In many cases, that is not the true disagreement. Both sides may acknowledge that the structures are interesting, the correspondences can feel meaningful, and the cumulative evidence may seem difficult to dismiss casually.",
      "The real disagreement emerges at the next step: what conclusion should be drawn from that complexity?",
      "For some, cumulative improbability crosses a threshold where ordinary explanation no longer feels sufficient. As more patterns converge, divine origin begins to feel increasingly unavoidable.",
      "A different perspective is possible. Cumulative improbability can increase plausibility without eliminating uncertainty or proving one specific conclusion with certainty.",
      "The disagreement is not patterns versus no patterns. It is whether extraordinary structure uniquely proves divine origin.",
    ],
    arguments: [],
    notes: [
      {
        title: "Plausibility vs. Certainty",
        body:
          "A pattern can make a claim more plausible without making it certain. The central question is where the threshold sits between 'this is interesting' and 'this proves the conclusion.' Different people place that threshold differently.",
      },
      {
        title: "Improbability Does Not Automatically Identify Cause",
        body:
          "A highly improbable pattern can strongly suggest that ordinary randomness alone may not fully explain the outcome. However, identifying a pattern as unlikely is not the same as uniquely identifying its cause.\n\nIf a coin lands on heads 1000 times in a row, most people would conclude that ordinary randomness is probably not the full explanation. But multiple possibilities could still exist: the coin could be manipulated, the flipping system could be biased, the sample could have been selectively chosen, hidden constraints could exist, or the event could be interpreted incorrectly.\n\nThe improbability reduces confidence in simple randomness, but it does not automatically prove one specific explanation.\n\nThe same distinction appears in debates involving mathematical patterns, miracle claims, hidden numerical structures, prophecy, and cumulative convergence systems such as Code 19.\n\nThe central disagreement is often not whether the patterns are real. It is whether the improbability uniquely identifies one specific cause strongly enough to justify certainty.",
      },
      {
        title: "The \"What Else Could It Be?\" Loop",
        body:
          "At a certain point, discussions about hidden structures or miracle claims often narrow into a repeated challenge: if not divine origin, then what else could it realistically be?\n\nThis question becomes powerful because the convergence may already feel overwhelming to the believer: too many patterns, too many alignments, too much apparent intentionality, and too much improbability. At that stage, uncertainty itself can begin looking unreasonable.\n\nThe discussion then becomes circular. One side says the convergence is too extraordinary to dismiss. The other side says extraordinary convergence still does not uniquely establish one conclusion with certainty. The first side responds by asking for another explanation.\n\nBut unresolved uncertainty does not require a fully completed replacement theory in order to remain rational.\n\nThroughout history, humans repeatedly treated difficult-to-explain phenomena as requiring supernatural explanation because no satisfying alternative existed at the time. In many cases, later understanding introduced hidden variables, broader context, methodological flaws, emergent structure, unknown mechanisms, or natural explanations people previously could not see.\n\nBecause of this, a person can rationally maintain that they do not yet know the final explanation without automatically concluding that the explanation must be supernatural.\n\nThis does not disprove the supernatural conclusion. But it means unresolved convergence alone may not fully eliminate uncertainty for everyone.",
      },
      {
        title: "Post Hoc Interpretation",
        body:
          "One recurring issue in miracle and pattern arguments is post hoc interpretation. This occurs when a conclusion is mapped onto a text or structure after the desired pattern is already known.\n\nInstead of making a clear prediction first and then testing whether reality matches it, the process can become observing reality first and then searching backward for wording, structures, or interpretations that can be connected to it.\n\nThe more flexible the interpretation space becomes, the easier it becomes to generate convincing correspondences after the fact. Symbolic meanings, loose wording, selective counting methods, translation variation, multiple definitions, and adjustable constraints can all expand the number of possible matches.\n\nThis does not automatically mean every pattern is false or meaningless. But it changes the evidential weight of the convergence because discovery and interpretation become harder to separate.",
      },
      {
        title: "Structure Emerging from Large Systems",
        body:
          "Large structured systems naturally contain repetition, symmetry, recursion, numerical relationships, clustering, and hidden correspondences.\n\nThe more dimensions analyzed simultaneously, the more likely it becomes that interesting structures and convergences will emerge somewhere within the system. Letters, chapter counts, word frequencies, roots, positional relationships, numerical patterns, and thematic repetition can all become searchable dimensions.\n\nThis does not automatically make the patterns meaningless. But it means the existence of hidden structure alone is not sufficient to uniquely establish supernatural origin.\n\nThe key question becomes whether the constraints were predictive and fixed beforehand, or whether the relationships were discovered retrospectively through deep exploration.",
      },
      {
        title: "Large Search Spaces and Pattern Convergence",
        body:
          "Imagine analyzing a massive database of chess games: millions of moves, openings, checkmate patterns, player ratings, timestamps, move counts, board positions, and positional relationships.\n\nNow imagine the number 8 was considered important beforehand. A researcher begins searching the database for relationships involving 8: White wins every 8th game in certain filtered sequences, some openings appear in multiples of 8, a specific checkmate pattern occurs 8 times in a subset, starting counts from different positions produces additional alignments, certain move totals become divisible by 8, and clusters of events begin converging repeatedly around the same number.\n\nAs more dimensions are explored, the convergence starts feeling increasingly intentional. At some point, someone observing the patterns may begin asking how all of this could possibly be coincidence.\n\nThe issue is not that the patterns are fake. The patterns may genuinely exist.\n\nThe issue is that large structured systems naturally contain enormous numbers of possible relationships: counting methods, starting points, subsets, combinations, symbolic mappings, positional relationships, exclusions, and layered interpretations.\n\nAs the search space expands, increasingly striking convergences become more likely to emerge somewhere within the system. This does not automatically mean every discovered pattern is meaningless. But it does mean the existence of convergence alone does not automatically identify its cause.",
      },
      {
        title: "Constraint Strength and Evidential Weight",
        body:
          "Not all patterns carry equal evidential weight.\n\nA pattern discovered under fixed rules, predictive constraints, limited interpretive flexibility, and independently testable methodology is generally stronger than a pattern discovered through broad interpretive freedom.\n\nBecause of this, debates often shift toward how constrained the methodology was, whether counting rules changed, whether exclusions were introduced, whether the framework was fixed beforehand, and how many alternative searches were attempted before the final pattern was selected.\n\nThe tighter the constraints, the stronger the evidential force may appear. The more flexible the process, the harder it becomes to separate discovery from selective interpretation.",
      },
      {
        title: "Why the Argument Feels So Convincing",
        body:
          "The persuasive force of systems like Code 19 does not come from one isolated coincidence.\n\nBelievers argue that the target number is declared beforehand, the text is finite rather than infinite, the structures converge repeatedly across multiple dimensions, the convergence appears disproportionately centered around one number, and the resulting probability becomes astronomically low.\n\nFrom this perspective, the patterns stop feeling like isolated curiosities and begin feeling like intentional authentication.\n\nThis is important because the emotional force of the argument comes less from any single example and more from cumulative convergence: repeated reinforcement, interconnected structure, apparent consistency, and the feeling that ordinary explanation no longer seems sufficient.\n\nAt that stage, the question naturally becomes: if this still is not enough, then what else could realistically explain it?",
      },
      {
        title: "The Core Methodological Question",
        body:
          "The disagreement does not necessarily come from rejecting the existence of the patterns. The disagreement comes from uncertainty about how much evidential force the convergence actually carries.\n\nThis includes questions such as how constrained the methodology truly was, how many searches were attempted, whether alternate patterns were discarded, how much interpretive flexibility existed, whether retrospective fitting occurred, how likely convergence becomes when enough dimensions are searched simultaneously, and whether large symbolic systems naturally generate hidden regularities more often than intuition expects.\n\nThis distinction matters because probability calculations depend heavily on what assumptions are included, which relationships are counted, which search spaces are considered, and whether the final convergence was selected from many possible exploratory paths.\n\nAs a result, two people can look at the same convergence and reach different conclusions: one sees statistical impossibility pointing toward divine design; another sees a highly interesting structure whose ultimate cause still remains unresolved.",
      },
      {
        title: "Similar to a Detective Solving a Case",
        body:
          "Imagine a detective investigating a highly unusual case.\n\nAt first, there are only a few suspicious details: a fingerprint, an unusual timestamp, and conflicting witness statements.\n\nBut then more things begin converging: the suspect knew the victim, their phone was turned off during the event, their car appears near the scene, security footage partially matches them, financial motives emerge, hidden messages are discovered, and multiple clues begin pointing in the same direction.\n\nAs the convergence increases, the conclusion begins feeling increasingly unavoidable. At some point, one investigator may say there are too many alignments for this to be coincidence.\n\nAnother investigator may still ask whether some clues were interpreted too aggressively, whether alternate suspects were fully ruled out, whether investigators focused too heavily on one suspect once suspicion formed, whether unrelated details were gradually pulled into one narrative afterward, or whether hidden assumptions exist inside the methodology itself.\n\nThe disagreement is not necessarily about whether the clues exist. The disagreement is about whether the convergence uniquely closes off uncertainty strongly enough to justify certainty.\n\nThis same tension appears in discussions involving religious miracles, prophecy, hidden numerical structures, scientific correspondences, and systems such as Code 19.\n\nAs patterns accumulate, one side may increasingly feel: what else could this realistically be? The other side may still distinguish between highly compelling and fully proven beyond remaining uncertainty.",
      },
      {
        title: "The Benoit Blanc Example",
        body:
          "A useful cultural comparison is Detective Benoit Blanc from the Knives Out films, especially Wake Up Dead Man: A Knives Out Mystery, which places a murder investigation inside a church setting with religious symbolism, faith, and competing interpretations.\n\nBlanc's role is not simply to reject what appears mysterious or improbable. His method is built around resisting premature certainty. When something looks intentional, coordinated, statistically unlikely, or difficult to explain at first glance, he does not immediately collapse that ambiguity into one conclusion.\n\nAs clues accumulate, other characters may emotionally cross into certainty: it has to be this. Blanc's approach is different. He keeps asking whether assumptions were introduced into the interpretation, whether the patterns are constrained or flexible, whether alternatives were fully ruled out, whether the conclusion is being discovered or reinforced through framing, and whether the evidence uniquely forces one explanation or merely points strongly toward it.\n\nThis distinction matters because highly converging evidence can exist without fully eliminating uncertainty. In detective work, many clues pointing in one direction increase plausibility. But plausibility and certainty are not identical.\n\nThe central issue becomes: at what point does accumulated convergence justify treating one conclusion as unquestionably true?\n\nDifferent people place that threshold differently. Some cross quickly into certainty once enough convergence appears. Others continue distinguishing between this is compelling and this fully closes uncertainty.\n\nThat tension appears not only in detective fiction, but in debates about religion, miracles, prophecy, hidden patterns, and supernatural claims more broadly.",
      },
      {
        title: "Asymmetrical Depth",
        body:
          "Another factor is the depth and direction of analysis. A person may spend years deeply analyzing one religious framework: searching for patterns, reinterpretations, correspondences, hidden structures, convergences, numerical relationships, and scientific parallels.\n\nOver time, repeated immersion naturally increases familiarity, coherence, confidence, and perceived inevitability, especially when the framework itself contains the idea that deeper analysis will reveal more truth.\n\nThis can create a recursive loop: search deeper, find more correspondences, increase confidence, reinterpret more information through the framework, then search even deeper.\n\nThis does not automatically invalidate the conclusions being reached. But it raises another question: is the process fully open-ended, or is it increasingly reinforcing one framework through repeated depth applied primarily in one direction?",
      },
      {
        title: "What Would Convince You?",
        body:
          "Another pressure point appears when a person asks what would count as enough. This question can be legitimate, because endless skepticism can become unfalsifiable. But it can also function as a forced threshold: if the current convergence is not enough, continued uncertainty is treated as irrational by default.\n\nThe difficulty is that evidence does not only need to be impressive. It needs to be discriminating. It has to show why one conclusion is uniquely stronger than competing explanations, not merely why the pattern is difficult to dismiss.\n\nA person can therefore answer the question by saying: what would count as enough is evidence that is specific, constrained, independently verifiable, resistant to flexible interpretation, and strong enough to rule out meaningful alternatives. Without that, uncertainty may remain reasonable even when the cumulative case is significant.",
      },
      {
        title: "Why the Debate Rarely Resolves",
        body:
          "The debate rarely resolves because it is not only about evidence. It is about epistemic thresholds: how much structure, convergence, and improbability are required before a person treats a conclusion as proven.",
      },
    ],
    keyIdeas: [
      "Cumulative evidence can increase plausibility without guaranteeing certainty.",
      "The central question is whether patterns uniquely prove one conclusion.",
      "Alternative explanations do not need to be complete for uncertainty to remain rational.",
      "Many debates persist because thresholds for certainty differ.",
    ],
  },
  {
    id: "belief-mechanics",
    label: "Part 4 — Belief Mechanics",
    title: "Part 4 — Belief Mechanics",
    eyebrow: "Belief Formation",
    intro:
      "This part explains why belief forms, why it becomes useful, why it fuses with identity, and why arguments often protect a belief more than they discover truth.",
    contentBlocks: [
      "After looking at how arguments can accumulate into certainty, the next question is how that certainty becomes psychologically reinforced.",
      "People usually do not start from pure logic. They often start from uncertainty, fear, lack of direction, or the need for structure. A belief system can offer answers, rules, identity, and stability before it has been fully evaluated.",
      "Once the belief starts functioning psychologically, it can feel validated. Community, routine, improved behavior, meaning, and certainty create a feedback loop where usefulness is mistaken for proof.",
    ],
    arguments: [],
    notes: [
      {
        title: "1. Entry Point: Low Certainty -> Need for Structure",
        body:
          "The initial adoption is often not 'this is proven true.' It is closer to: 'this gives me something stable to stand on.' Religion can answer uncertainty, reduce chaos, create direction, and give identity.",
      },
      {
        title: "2. Reinforcement Loop",
        body:
          "Once inside, the system begins working. Community reinforces it. Behavior may improve. Life feels more structured. Meaning increases. That creates positive feedback: belief feels validated because it functions well psychologically, even if it has not been independently proven.",
      },
      {
        title: "3. Identity Fusion",
        body:
          "Over time, belief can shift from 'something I think' to 'part of who I am.' Once that happens, challenging the belief can feel like challenging the person.",
      },
      {
        title: "4. The Doubt Event",
        body:
          "When uncertainty, alternative explanations, or logical pressure enter the system, cognitive dissonance appears. Two states conflict: 'this is true' and 'this might not be provable.' The discomfort creates pressure to resolve the contradiction.",
      },
      {
        title: "5. The Fork",
        items: [
          "Path A: explore doubt, tolerate uncertainty, re-evaluate beliefs, possibly change stance.",
          "Path B: protect stability, reinforce belief, dismiss opposing ideas, increase confidence.",
          "Path B often wins because it preserves psychological stability.",
        ],
      },
      {
        title: "6. Lock-In Mechanism",
        body:
          "Once reinforcement is chosen, the belief becomes stronger. Opposing ideas feel threatening. Arguments become repetitive. Certainty increases artificially. The system becomes resistant to change.",
      },
      {
        title: "7. Escalation Under Pressure",
        body:
          "If pressure continues, logic often decreases and emotional tone increases. Repetition replaces reasoning. This is not stupidity; it is defense under pressure.",
      },
      {
        title: "Where Arguments Fit",
        body:
          "Arguments like miracles, scripture, scientific claims, and personal experience serve two roles: they justify belief internally and protect belief externally. The deeper insight is that many religious arguments are not mainly attempts to discover truth; they are mechanisms that stabilize belief.",
      },
      {
        title: "Why Challenge Often Backfires",
        body:
          "When I challenge an idea, I may feel like I am testing truth. The other person may experience it as a threat to stability. So the system responds by increasing belief strength.",
      },
      {
        title: "Symmetry",
        body:
          "This loop applies beyond religion: religious believers, anti-religious people, political ideologies, and even rationalist identities can all fuse belief with identity and stability.",
      },
      {
        title: "Insider vs. Outsider Frameworks",
        body:
          "Some groups do not understand themselves as ordinary believers. They see themselves as people who have decoded objective authentication. This changes the psychology of belief.\n\nThe identity is no longer only inherited faith or personal conviction. It becomes discovery identity: the sense of being part of a smaller group that has found the hidden structure others are missing.\n\nThat can make disagreement feel different. An outsider is not only rejecting a belief; they are rejecting what the insider experiences as verification. The disagreement can therefore feel like a failure to see the evidence, a refusal to follow the pattern, or resistance to what has already been decoded.\n\nThis can strengthen certainty because the person is not merely defending a tradition. They are defending their role as someone who recognized the truth beneath the surface.",
      },
      {
        title: "How Belief Shapes Behavior",
        body:
          "Belief does not just shape what people think. It shapes how they interpret, act, and relate to others. It can provide stability, purpose, and community, but it can also reinforce certainty, justify actions, and shape how outsiders are perceived.",
      },
      {
        title: "Conversion, Adoption, and Influence",
        body:
          "Belief is often introduced through family, community, institutions, or conversations. Early exposure can make belief feel like the default. Moments of vulnerability can make structured answers feel especially convincing. Social pressure can be subtle: norms, repetition, reinforcement, and guided conversations.",
      },
      {
        title: "Influence Under Uncertainty",
        body:
          "Belief can feel most convincing when introduced at the moment someone is least able to question it. Uncertainty, authority, emotional intensity, and social dynamics can narrow attention and increase suggestibility. A structured system introduced at the right moment can feel immediately right.",
      },
      {
        title: "State Change and Re-Evaluation",
        body:
          "When pressure lowers or the environment changes, autonomy can increase and independent assessment becomes more available. Some beliefs remain stable; others get re-examined. Relief can also be attributed to the system, even when it partly comes from a change in conditions.",
      },
      {
        title: "Responsibility and External Anchoring",
        body:
          "Belief systems can guide responsibility through an external authority. This can strengthen accountability, but it can also reframe responsibility so that resolution is processed through the system rather than through direct personal ownership alone.",
      },
      {
        title: "Reflective and Voluntary Formation",
        body:
          "Not all belief forms under pressure. Some belief develops through slow evaluation, exposure to multiple perspectives, lower emotional intensity, and more independent decision-making. That path does not guarantee truth, but it operates differently.",
      },
      {
        title: "Case Study: Intimacy and Commitment",
        body:
          "A rule like avoiding sex before marriage shows how a stance can form. It may begin as something taught or inherited, then become internalized as something that simply makes sense. The reasoning often follows the belief: it is reframed as protective, meaning-preserving, or a test of commitment. What feels like a conclusion is often a value expressed in the form of reasoning.",
      },
      {
        title: "My Stance",
        body:
          "Belief systems like religion do not exist only because of evidence. They provide structure, certainty, and identity. Over time, belief can become tied to the person, so when it is challenged, stability feels threatened. The arguments can explain why belief feels convincing, but they do not necessarily provide independent proof that it is true.",
      },
    ],
    keyIdeas: [
      "Belief often starts as stability before proof.",
      "Usefulness can feel like validation.",
      "Identity fusion makes doubt feel personal.",
      "Arguments often protect belief as much as they justify it.",
    ],
  },
  {
    id: "from-belief-to-positions",
    label: "Part 5 — From Belief → Positions",
    title: "Part 5 — From Belief to Positions",
    eyebrow: "Positions and Sides",
    intro:
      "The same patterns that appear in religious belief show up in politics, media, leaders, countries, social issues, and public conflict.",
    contentBlocks: [
      "When people face something large, uncertain, and difficult to fully understand, they often simplify it into something manageable: right or wrong, good or bad, for or against.",
      "This is not always because people are careless. Uncertainty is uncomfortable, and simple positions provide something to stand on.",
      "As a result, many opinions form less through deep evaluation and more through alignment with a group, narrative, or simplified version of reality.",
    ],
    arguments: [],
    notes: [
      {
        title: "Having a Stance Can Replace Understanding",
        body:
          "Once a person commits to a position, information is often filtered. Evidence that supports the view is selected, while conflicting details are minimized. The goal shifts from understanding to maintaining coherence and confidence.",
      },
      {
        title: "Partial Reality -> Strong Conclusions",
        body:
          "Most people do not engage with an issue from all sides. They gather information that supports their stance and ignore uncertainty, unknown variables, or difficult-to-verify details. This creates certainty that is not fully earned.",
      },
      {
        title: "Conflict and the Loss of Middle Ground",
        body:
          "When positions are formed through selective information, reinforced certainty, and identity, each side builds its own version of reality. Disagreement becomes harder because adjusting a position means giving up something tied to identity and certainty.",
      },
      {
        title: "Alignment and Tribal Pull",
        body:
          "Once a position is taken, people move toward others who share it. Agreement becomes social alignment. The reasons behind the position can matter less than the fact that it signals belonging.",
      },
      {
        title: "Why Clear Sides Stabilize Groups",
        body:
          "Taking a side is socially legible. It simplifies identity, trust, prediction, alliance, and group coordination. A person with a clear side becomes easier to categorize as ally, opponent, believer, skeptic, loyal, disloyal, safe, or unsafe.\n\nSomeone maintaining unresolved uncertainty is harder to place inside a social map. That ambiguity creates tension because many systems, religious, political, ideological, and online, are optimized around alignment clarity.\n\nShared certainty stabilizes groups psychologically and socially. A person saying they are still uncertain can disrupt that stability because they reopen unresolved questions, resist identity consolidation, and weaken the emotional closure the group shares.\n\nThat is why uncertainty is often interpreted not as ongoing evaluation, but as weakness, avoidance, hidden opposition, indecisiveness, or failure to accept what is obvious.",
      },
      {
        title: "Information Limits",
        body:
          "Many issues people argue about are not fully visible from the outside. Motives, constraints, and long-term plans are often opaque. Strong conclusions are frequently built on incomplete information, but the expectation to have a firm opinion persists anyway.",
      },
      {
        title: "Attention and Trade-Offs",
        body:
          "Forming detailed opinions on complex issues takes time and attention. That time competes with skills, work, relationships, and daily life. This is not a rejection of engagement; it is a prioritization: depth where it changes outcomes, restraint where it does not.",
      },
      {
        title: "Framing, Belief, and the Shift to Sides",
        body:
          "Questioning a belief is often framed as attacking it. But belief systems are not passive; they are shared, defended, and presented as correct. The interaction is not simply one person believing and another attacking. It is both sides engaging the same idea from different standards of certainty.",
      },
      {
        title: "Questioning vs. Attacking",
        body:
          "A clearer frame is: 'I am not trying to remove your belief. I am just not convinced by the same reasoning.' One person may believe something is true. Another may believe there is not enough evidence to confirm it.",
      },
      {
        title: "Simplification and Forced Positions",
        body:
          "Questions like 'Do you believe in God?', 'Do you support this side?', or 'Who is the greatest?' compress complexity into a simple answer. At that point, the question becomes a way to categorize someone, not understand the issue.",
      },
      {
        title: "Connection to the Larger Pattern",
        items: [
          "Belief forms.",
          "Belief is reinforced.",
          "Belief becomes a position.",
          "Position becomes identity.",
          "Identity drives defense.",
        ],
      },
      {
        title: "One-Line Anchors",
        items: [
          "When questioning is framed as opposition, discussion shifts from understanding ideas to defending positions.",
          "When complex questions are reduced to simple answers, positions form faster than understanding.",
          "Positions often double as signals of belonging, which makes them harder to adjust.",
          "Strong certainty is often built on partial visibility.",
        ],
      },
    ],
    keyIdeas: [
      "Complexity gets compressed into sides.",
      "Positions often signal belonging.",
      "Information is usually partial.",
      "Attention should go where depth changes outcomes.",
    ],
  },
  {
    id: "my-stance",
    label: "Part 6 — Your Stance",
    title: "Part 6 — Your Stance",
    eyebrow: "Personal Position",
    intro:
      "This part states the current position directly: not simple disbelief, not automatic belief, and not simple side-taking.",
    contentBlocks: [
      "I do not take simple sides on complex issues. There is often too much we do not see: motives, constraints, internal decisions, hidden trade-offs, and partial narratives.",
      "I would rather look at specific actions, outcomes, reasoning quality, and evidence than assume I fully understand the whole situation.",
    ],
    arguments: [],
    notes: [
      {
        title: "Evidence Standard",
        body:
          "Meaningful does not equal proven. Belief does not equal evidence. Experience does not equal objective truth. A claim becomes stronger when it can be checked outside the system that benefits from it.",
      },
      {
        title: "Approach to Uncertainty",
        body:
          "Uncertainty is not avoidance. It can be a more accurate position when the available information is incomplete. The goal is not to look undecided forever; the goal is to avoid pretending certainty before the evidence supports it.",
      },
      {
        title: "Why I Leaned Away from Religion",
        body:
          "This was not driven only by lack of convincing evidence. It was also shaped by how these systems organize interpretation, maintain consistency, and influence behavior over time. The more I looked at the structures, the less it felt like something purely derived from a clear objective source, and more like something shaped by interpretation, reinforcement, and group dynamics.",
      },
      {
        title: "Authority and Interpretation",
        body:
          "When interpretation is centralized, people often rely on trusted authority rather than evaluating ideas independently. This creates coherence, but it can shift evaluation away from personal assessment.",
      },
      {
        title: "Internal Divergence",
        body:
          "If the same source leads to different outcomes, interpretation, not just content, drives the result. Different sects and rulings from the same source show that meaning is actively constructed.",
      },
      {
        title: "Competing Absolutes",
        body:
          "When multiple systems claim exclusive truth, conflict is a structural outcome, not an anomaly. Each system can feel internally coherent while contradicting others.",
      },
      {
        title: "Rule Design: Stability vs. Adaptation",
        body:
          "Rigid rules maximize consistency. Adaptive rules maximize flexibility. Each trades off against the other. No system fully resolves this tension; it manages it.",
      },
      {
        title: "Cohesion, Pressure, and Autonomy",
        body:
          "The same forces that create cohesion can also constrain autonomy. Strong norms can feel like guidance, support, or accountability from inside the system, while narrowing what choices feel acceptable.",
      },
      {
        title: "Current Stance",
        body:
          "I can understand why people believe and why it is hard to change. I can also see how belief can help someone. But understanding the function of a belief is different from accepting that the belief is objectively proven.",
      },
    ],
    keyIdeas: [
      "Do not force simple sides on complex issues.",
      "Require evidence outside the system being defended.",
      "Uncertainty can be an honest position.",
      "Religion was evaluated by evidence and system behavior.",
    ],
  },
  {
    id: "modern-context",
    label: "Part 7 — Modern Context",
    title: "Part 7 — Modern Context",
    eyebrow: "Modern Society",
    intro:
      "This part places the belief analysis inside modern society: religion, media, technology, AI, public narratives, and systems that may be outdated in some areas while adaptive in others.",
    contentBlocks: [
      "Modern life changes the environment where beliefs operate. People are exposed to more worldviews, more information, more disagreement, and more pressure to form opinions quickly.",
      "That does not automatically make older systems false. But it does force the question of which parts still adapt well and which parts become rigid under modern conditions.",
    ],
    arguments: [],
    notes: [
      {
        title: "Religion vs. Modern Society",
        body:
          "Religious systems often formed in older social environments with different assumptions about authority, family, gender, community, knowledge, and social control. Modern society introduces pluralism, individual autonomy, scientific reasoning, and rapid cultural change.",
      },
      {
        title: "Outdated vs. Adaptive Systems",
        body:
          "Some rules preserve stability. Others may struggle with edge cases, new contexts, or individual differences. A system can be meaningful and still need adaptation. It can also adapt too much and lose consistency.",
      },
      {
        title: "Technology and AI Influence",
        body:
          "Technology changes how belief spreads and how people evaluate truth. AI can clarify arguments, summarize views, compare frameworks, expose contradictions, and accelerate analysis. It can also increase coherence around a framework that has not been independently verified.",
      },
      {
        title: "AI and Reinforced Certainty",
        body:
          "Modern AI systems introduce a new layer into belief formation and ideological reinforcement.\n\nPeople increasingly use AI to validate arguments, test beliefs, simulate debate, generate explanations, organize evidence, and search for coherence across large information spaces.\n\nThis can be useful. AI can clarify reasoning, expose contradictions, summarize positions, compare frameworks, and accelerate analysis.\n\nAt the same time, AI systems are highly sensitive to framing, prompting, conversational momentum, cumulative context, interpretive assumptions, and the structure of the discussion itself.\n\nBecause of this, AI can sometimes reinforce a user's existing framework by mirroring assumptions, increasing internal coherence, strengthening perceived convergence, or presenting probabilistic interpretations with excessive confidence.\n\nThis becomes especially important in areas involving religion, ideology, politics, conspiracy, metaphysics, and systems built around hidden structure or cumulative interpretation.\n\nIn these contexts, people may begin treating AI agreement as external validation of certainty. But AI agreement does not automatically resolve the underlying epistemic questions.\n\nAn AI system can strengthen arguments, improve articulation, expose weaknesses, or increase plausibility without independently proving that a conclusion is objectively true.\n\nThe issue is not that AI is unreliable. The issue is that AI can amplify both understanding and reinforcement depending on how the framework guiding the interaction is constructed.",
      },
      {
        title: "Media Distortion",
        body:
          "Media rewards attention, speed, emotional framing, and simplified sides. This makes complex issues feel more certain than they are. Narratives can replace full context, and people often react to the frame rather than the whole situation.",
      },
      {
        title: "Modern Pressure to Take a Side",
        body:
          "Modern platforms reward visible certainty.\n\nStrong declarations spread faster than nuanced positions. Clear alignment is easier to process socially than unresolved uncertainty. Because of this, people who refuse to fully commit to a side are often framed as weak, indecisive, dishonest, having no backbone, or avoiding the truth.\n\nIn many environments, uncertainty itself becomes socially suspicious.\n\nA person saying, \"I do not think the evidence fully closes uncertainty yet,\" can be interpreted very differently from how it is intended.\n\nInstead of hearing, \"I am trying to maintain epistemic restraint,\" others may hear, \"You are refusing to accept what is obvious.\"\n\nThis creates pressure to collapse complexity into certainty faster than one actually believes is justified.\n\nModern discussion environments amplify this pressure because algorithms reward confidence, communities reward loyalty, debate culture rewards decisive rhetoric, and social identity rewards visible alignment.\n\nNuanced positions often perform poorly in these systems because they do not produce emotional certainty, tribal clarity, immediate conclusions, or strong in-group signaling.\n\nAs a result, many discussions stop being about what is most accurate and become about which side a person is on.\n\nThis creates a false binary where certainty is treated as strength and restraint is treated as weakness, even though withholding certainty under unresolved conditions can itself be a principled position.\n\nA person can acknowledge compelling evidence, meaningful patterns, strong arguments, or emotionally powerful experiences without believing that uncertainty has been reduced enough to justify complete certainty.\n\nBut in highly polarized environments, maintaining that distinction can itself become socially difficult because the environment increasingly pressures people toward simplified identity positions rather than sustained ambiguity or open-ended analysis.",
      },
      {
        title: "Public Perception and Narrative Framing",
        body:
          "Religions are not only experienced internally by believers. They are also perceived externally through media, politics, history, personal experience, activism, criticism, and public debate.\n\nBecause of this, religions often develop competing public narratives: how followers describe the religion, how critics describe the religion, how outsiders experience it socially, and how the religion behaves across cultures and political systems.\n\nThese narratives can become highly polarized. Islam may be described through discipline, submission to God, charity, structure, and community, or through extremism, authoritarianism, gender restrictions, and political violence. Christianity may be described through forgiveness, charity, and compassion, or through colonialism, institutional abuse, suppression, and historical coercion. Judaism may be described through continuity, law, scholarship, and survival, or through nationalism, exclusivity, geopolitics, and identity conflict.\n\nThe same religion can therefore appear radically different depending on historical context, political environment, interpretation, media framing, individual experience, and which aspects are emphasized or ignored.\n\nThis creates another layer of complexity: people are often not debating the same religion, but different constructed versions of it.",
      },
    ],
    keyIdeas: [
      "Modern society increases pluralism and complexity.",
      "Older systems can be stable but rigid.",
      "AI can clarify or distort reasoning.",
      "Media pushes simplified narratives and fast sides.",
      "Public narratives can turn the same religion into different social objects.",
    ],
  },
  {
    id: "personal-framework",
    label: "Part 8 — Personal Framework",
    title: "Part 8 — Personal Framework",
    eyebrow: "Life Framework",
    intro:
      "This is the personal operating system: how to think, how to evaluate truth, and what to optimize for.",
    contentBlocks: [
      "Instead of replacing religion with nothing, this part defines a practical framework for judgment: stay open, avoid false certainty, look for independent evidence, and prioritize actions that compound in real life.",
    ],
    arguments: [],
    notes: [
      {
        title: "How I Think",
        items: [
          "Separate what feels meaningful from what is proven.",
          "Separate usefulness from truth.",
          "Separate a person's sincerity from the accuracy of the claim.",
          "Separate a system's stability from evidence for its origin.",
        ],
      },
      {
        title: "How I Evaluate Truth",
        items: [
          "Does the claim rely on circular reasoning?",
          "Can it be checked outside the system?",
          "Would the same argument prove a conflicting belief?",
          "Is the conclusion stronger than the evidence allows?",
          "Is the belief being protected because it is true, or because it provides stability?",
        ],
      },
      {
        title: "What I Optimize For",
        body:
          "I want clarity without false certainty, openness without gullibility, discipline without rigid identity, and depth where it actually changes outcomes. I want to spend attention where it compounds: skills, work, relationships, health, judgment, and actions I can affect.",
      },
      {
        title: "Guardrail",
        body:
          "This is not a rejection of engagement. It is a prioritization: depth where it changes outcomes, restraint where it does not.",
      },
      {
        title: "Proportional Certainty",
        body:
          "The goal is not to treat certainty itself as bad. Certainty can be appropriate when the evidence is strong, specific, and uniquely points toward a conclusion.\n\nThe stronger position is that certainty should scale with the strength and uniqueness of the evidence. A claim should not receive more confidence than its support can carry.\n\nThis also prevents skepticism from becoming its own rigid identity. People can become attached to endless doubt, contrarianism, performative skepticism, or refusal to commit under any conditions. The point is not permanent uncertainty. The point is proportionate belief.",
      },
      {
        title: "One-Line Anchor",
        body:
          "The goal is not to have the strongest identity. The goal is to have the cleanest relationship with truth, uncertainty, and action.",
      },
    ],
    keyIdeas: [
      "Meaning and truth are different questions.",
      "Independent verification matters.",
      "Avoid false certainty and forced sides.",
      "Certainty should scale with the strength and uniqueness of the evidence.",
      "Optimize attention for what changes outcomes.",
    ],
  },
];

export const politicsSections: ReadingSection[] = [
  {
    id: "politics-government",
    label: "Government",
    title: "Government",
    eyebrow: "Politics / Government",
    intro:
      "This test section looks at government as a structure for authority, coordination, law, and power.",
    contentBlocks: [
      "Government is not only a set of leaders. It is a system that defines rules, enforces decisions, manages institutions, and shapes what people experience as legitimate authority.",
      "The same framework used in Religion can apply here: claims become narratives, narratives become positions, and positions often become identity.",
    ],
    arguments: [],
    notes: [
      {
        title: "Test Focus",
        body:
          "Later this section can separate government into authority, legitimacy, incentives, institutions, law, rights, and public trust.",
      },
    ],
    keyIdeas: [
      "Government organizes authority and enforcement.",
      "Political legitimacy depends on both structure and public belief.",
      "Government can be analyzed through systems, incentives, and trust.",
    ],
  },
  {
    id: "politics-ideology",
    label: "Ideology",
    title: "Ideology",
    eyebrow: "Politics / Ideology",
    intro:
      "This test section looks at ideology as a political belief system that simplifies complexity into a usable worldview.",
    contentBlocks: [
      "Ideology helps people organize large political questions quickly. It provides categories, values, enemies, priorities, and explanations.",
      "The risk is that ideology can become identity. Once that happens, disagreement is no longer only about policy. It becomes a threat to the person's sense of coherence and belonging.",
    ],
    arguments: [],
    notes: [
      {
        title: "Test Focus",
        body:
          "Later this section can cover left/right identity, moral framing, political certainty, group loyalty, and why people defend positions before fully understanding them.",
      },
    ],
    keyIdeas: [
      "Ideology turns complexity into a usable worldview.",
      "Political beliefs can become identity markers.",
      "Once ideology fuses with identity, evidence is often filtered through loyalty.",
    ],
  },
  {
    id: "politics-media-influence",
    label: "Media Influence",
    title: "Media Influence",
    eyebrow: "Politics / Media",
    intro:
      "This test section looks at how media shapes political perception by deciding which frames, conflicts, and narratives become visible.",
    contentBlocks: [
      "Most people do not experience political reality directly. They experience edited fragments: headlines, clips, commentary, viral posts, and repeated narratives.",
      "Because of that, political confidence can form around a partial version of reality. The issue is not only misinformation, but compression: complex situations are reduced into emotionally clear sides.",
    ],
    arguments: [],
    notes: [
      {
        title: "Test Focus",
        body:
          "Later this section can cover agenda-setting, framing, outrage cycles, attention incentives, propaganda, and how public opinion gets shaped through repetition.",
      },
    ],
    keyIdeas: [
      "Media turns complex reality into selected frames.",
      "Political confidence often forms from partial visibility.",
      "Attention systems reward conflict, speed, and emotional clarity.",
    ],
  },
];

export const allSections = [
  startSection,
  frameworkSections[0],
  topics[0],
  ...frameworkSections.slice(1),
  ...politicsSections,
];

export function getKeyIdeas(sectionId: string) {
  const section = allSections.find((item) => item.id === sectionId);
  return section?.keyIdeas ?? startSection.keyIdeas;
}
