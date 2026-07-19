// APN Guides — practical, search-focused articles for Apostolic pastors and churches.
// Kept in code for the launch so each guide is reviewed before it is published.

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  readingTime: string;
  publishedAt: string;
  intro: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  references?: { label: string; href: string }[];
};

const publishedAt = "2026-07-19T00:00:00.000Z";

export const guides: Guide[] = [
  {
    slug: "ai-for-pastors",
    eyebrow: "Pastoral Leadership",
    title: "AI for Pastors: A Wise, Practical Starting Point",
    description:
      "A practical guide to using AI for church administration and first drafts while keeping prayer, Scripture, discernment, and pastoral care in their rightful place.",
    readingTime: "7 min read",
    publishedAt,
    intro:
      "Artificial intelligence can save a pastor time, but it cannot pray, discern, shepherd a soul, or replace the authority of Scripture. The healthiest starting point is simple: use AI as an assistant for low-risk work, and keep spiritual leadership human, prayerful, and accountable.",
    sections: [
      {
        heading: "What AI can help a pastor do",
        paragraphs: [
          "AI is most useful when it removes repetitive work or helps you get past a blank page. It can organize rough notes, suggest a first outline, turn a long announcement into a short text message, create a volunteer checklist, or help you compare several practical options.",
          "That does not make the result ready to publish. Treat every response as a draft that needs your facts, your voice, and your final review.",
        ],
        bullets: [
          "Rewrite a ministry announcement for email, text, and social media.",
          "Create a first-pass agenda for a staff or volunteer meeting.",
          "Turn your own teaching notes into discussion questions.",
          "Build a checklist for a guest follow-up, event, or outreach project.",
        ],
      },
      {
        heading: "What must stay with the pastor and the church",
        paragraphs: [
          "A language model does not know your people, carry spiritual responsibility, or submit to your church’s doctrine and leadership. Never let a tool impersonate your pastoral voice in a sensitive conversation or make a decision that requires wisdom, confidentiality, or accountability.",
        ],
        bullets: [
          "Prayer, biblical interpretation, and final sermon preparation.",
          "Pastoral counseling, discipline, crisis care, or decisions about people.",
          "Private prayer requests, counseling notes, giving data, or children’s information.",
          "Anything you have not personally checked for accuracy and tone.",
        ],
      },
      {
        heading: "Start with one small, repeatable workflow",
        paragraphs: [
          "Choose one task you already do every week. For example, write the Sunday announcement yourself in bullet points, then ask AI to create a short email, a text message, and three social captions. Review every version, remove anything that feels generic, and save the prompt that helped.",
          "After a month, ask your team one question: did this save time without lowering clarity or care? Keep what helps, change what does not, and do not expand the tool’s role faster than your oversight can keep up.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should pastors use AI to write sermons?",
        answer:
          "AI may help organize your own notes or surface questions to consider, but it should not replace prayerful study, biblical exegesis, pastoral discernment, or your responsibility for what is preached.",
      },
      {
        question: "What information should never be pasted into AI?",
        answer:
          "Do not paste counseling details, prayer requests, financial records, children’s information, passwords, or any other confidential church data unless your church has explicitly approved a secure process for it.",
      },
    ],
  },
  {
    slug: "best-ai-tools-for-churches",
    eyebrow: "Church Operations",
    title: "Best AI Tools for Churches: Start With the Work, Not the Hype",
    description:
      "A practical comparison of AI tool categories for churches—from writing and research to design and office productivity—plus the safeguards to put in place first.",
    readingTime: "8 min read",
    publishedAt,
    intro:
      "The best AI tool for a church is not necessarily the newest or most impressive one. It is the tool that makes a real ministry task clearer, faster, and safer without putting confidential information or spiritual responsibility at risk.",
    sections: [
      {
        heading: "Choose a tool by the job you need done",
        paragraphs: [
          "Begin with a real bottleneck. If your team spends too long rewriting announcements, a writing assistant may help. If design work is delayed, a visual tool may help. If staff already work in a Microsoft environment, a productivity assistant may be the most natural fit.",
          "Do not buy several subscriptions before a ministry need is clear. Run a short pilot with one or two trusted users, a defined task, and a simple review process.",
        ],
        bullets: [
          "Writing and research assistants: useful for brainstorming, drafting, outlining, and summarizing public material.",
          "Visual design tools: useful for first-pass event graphics, caption variants, layouts, and resizing approved creative.",
          "Productivity assistants: useful when your staff already work inside a shared document, email, or meeting system.",
          "Transcription tools: useful for turning a public recording into notes that a human editor can verify.",
        ],
      },
      {
        heading: "A practical church starter list",
        paragraphs: [
          "ChatGPT and Claude can assist with writing, brainstorming, document review, and structured first drafts. Canva Magic Studio can help a non-designer begin a visual concept or adapt approved content across formats. Microsoft Copilot may be worth evaluating when a church already relies on Microsoft 365 for staff work.",
          "These are examples, not endorsements or a substitute for a vendor review. Plans, features, permissions, and data practices change. Before adopting any service, read its current terms, privacy controls, administrator settings, and pricing for the plan you would actually use.",
        ],
      },
      {
        heading: "Set three guardrails before your first subscription",
        paragraphs: [
          "A simple policy prevents a useful tool from becoming a hidden risk. Put the policy in writing, tell staff and volunteers what it covers, and revisit it whenever a new tool is introduced.",
        ],
        bullets: [
          "No confidential data: never enter pastoral, financial, children’s, or member information without an approved secure process.",
          "Human approval: a person verifies facts, Scripture references, names, dates, tone, and any public-facing copy.",
          "Clear ownership: decide who can create accounts, approve paid tools, and remove access when a volunteer or staff member leaves.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best free AI tool for a small church?",
        answer:
          "Start with the free version of one general writing assistant for a low-risk task, such as rewriting announcements. A successful process matters more than having several tools.",
      },
      {
        question: "Can a church use AI for social media?",
        answer:
          "Yes, for first drafts, caption options, content calendars, and repurposing approved material. A ministry leader should still verify every post for accuracy, voice, and sensitivity.",
      },
    ],
    references: [
      { label: "ChatGPT: getting started", href: "https://openai.com/academy/getting-started/" },
      { label: "Claude: common uses", href: "https://support.anthropic.com/en/articles/7996845-what-are-some-things-i-can-use-claude-for" },
      { label: "Canva Magic Studio", href: "https://www.canva.com/magic-studio/" },
      { label: "Microsoft Copilot", href: "https://www.microsoft.com/microsoft-365/copilot" },
    ],
  },
  {
    slug: "church-website-checklist",
    eyebrow: "Church Communications",
    title: "Church Website Checklist: What Every Visitor Should Find Quickly",
    description:
      "A practical church website checklist for first-time guests, regular attendees, and search engines—covering service times, beliefs, next steps, content, and mobile usability.",
    readingTime: "6 min read",
    publishedAt,
    intro:
      "A church website does not need every feature to be helpful. It needs to answer a visitor’s most immediate questions with clarity: Who are you? When do you meet? What can I expect? Where do I go next?",
    sections: [
      {
        heading: "Put first-time guest information above the fold",
        paragraphs: [
          "A new visitor should not have to hunt for meeting times or an address. Put a clear invitation, service times, location, and a simple next step near the top of the homepage. Make sure that information is visible on a phone without opening several menus.",
        ],
        bullets: [
          "Church name, city, and a clear one-sentence welcome.",
          "Service times and a link to directions or a map.",
          "A short ‘Plan Your Visit’ path with practical expectations.",
          "A way to ask a question without exposing a visitor’s information publicly.",
        ],
      },
      {
        heading: "Build the essential pages before adding extras",
        paragraphs: [
          "A straightforward site with accurate information earns more trust than a crowded site with outdated pages. Give each essential page one job and update it as part of your weekly communications rhythm.",
        ],
        bullets: [
          "About and beliefs: explain who you are and what you believe in plain language.",
          "Next steps: show how someone can visit, connect, serve, or ask for prayer.",
          "Sermons or teaching: link to the original source and make titles searchable.",
          "Events: show dates, location, host information, and a current source for details.",
          "Contact and privacy: give people a real way to reach the church and explain how forms are handled.",
        ],
      },
      {
        heading: "Use a simple monthly quality check",
        paragraphs: [
          "Open the site from a phone and pretend you are visiting for the first time. Check every button, every date, and every contact method. Then ask one person who does not manage the website to try the same test.",
          "Search engines reward pages that are useful, clear, fast, and kept current. The best technical checklist starts with those human basics.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should be on a church homepage?",
        answer:
          "At minimum: a clear welcome, service times, location or directions, a visitor next step, current event information, and a path to beliefs, sermons, and contact details.",
      },
      {
        question: "How often should a church update its website?",
        answer:
          "Review public details weekly and perform a more complete check each month. Update service changes, event information, staff details, and broken links as soon as they change.",
      },
    ],
  },
  {
    slug: "sermon-preparation-workflow",
    eyebrow: "Preaching & Teaching",
    title: "A Sermon Preparation Workflow That Protects Study, Prayer, and Clarity",
    description:
      "A repeatable sermon preparation workflow for pastors and teachers—from prayerful study and biblical context to a clear big idea, application, and final review.",
    readingTime: "8 min read",
    publishedAt,
    intro:
      "A dependable sermon workflow is not a substitute for the leading of the Holy Spirit. It is a way to make room for prayerful study, careful handling of Scripture, and a message that people can understand and live.",
    sections: [
      {
        heading: "Begin with prayer and the biblical text",
        paragraphs: [
          "Start by reading the passage in context before reaching for outlines, clips, or commentary. Ask what the text says, what it meant to its first hearers, and how it points your congregation toward faithful obedience today.",
          "Write down observations before you organize them. Repeated words, contrasts, questions, commands, and the passage’s place in the larger biblical story all matter.",
        ],
      },
      {
        heading: "Move from many notes to one clear burden",
        paragraphs: [
          "A sermon usually becomes clearer when it has one memorable sentence at its center. Try to state the main truth in plain language, then test every illustration, point, and application against it. If something does not serve that truth, save it for another message.",
        ],
        bullets: [
          "Text: What does the passage actually say?",
          "Truth: What is the central biblical claim?",
          "Tension: Why does this matter to the people listening?",
          "Response: What faithful action, faith, repentance, or hope should follow?",
        ],
      },
      {
        heading: "Prepare application with pastoral care",
        paragraphs: [
          "Application should be concrete enough to be lived and gentle enough to be heard. Speak to the whole room without assuming every listener has the same story, maturity, resources, or pain.",
          "Before preaching, read the message out loud. Check Scripture references, names, dates, and illustrations. Ask a trusted leader whether the main point is clear and whether any sentence could be misunderstood.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long should sermon preparation take?",
        answer:
          "There is no single right number of hours. Build a repeatable rhythm that gives you time for prayer, reading, study, structure, and a final review instead of relying only on last-minute assembly.",
      },
      {
        question: "Can AI be part of sermon preparation?",
        answer:
          "It can assist with low-risk tasks such as organizing your own notes or suggesting discussion questions. It should never replace prayer, biblical study, discernment, or responsibility for what you preach.",
      },
    ],
  },
  {
    slug: "biblical-view-of-artificial-intelligence",
    eyebrow: "Faith & Technology",
    title: "A Biblical View of Artificial Intelligence: Wisdom Before Hype or Fear",
    description:
      "A Christian framework for thinking about artificial intelligence with biblical wisdom, human dignity, truthfulness, stewardship, and responsibility.",
    readingTime: "9 min read",
    publishedAt,
    intro:
      "The Bible does not mention artificial intelligence by name, so Christians should resist easy proof texts. Instead, we can ask how enduring biblical convictions—human dignity, truth, stewardship, neighbor-love, and accountability—should shape the way we use powerful tools.",
    sections: [
      {
        heading: "Human beings bear God’s image; tools do not",
        paragraphs: [
          "Genesis teaches that human beings are made in the image of God. That gives every person dignity that no tool can possess or replace. AI may generate language, images, and patterns, but it does not carry moral responsibility, spiritual life, or the calling to love God and neighbor.",
          "That distinction keeps us from both panic and idolatry. We can use a tool without asking it to become a pastor, counselor, conscience, or source of ultimate authority.",
        ],
      },
      {
        heading: "Truthfulness and wisdom matter more than speed",
        paragraphs: [
          "AI can produce confident errors, fabricated citations, and misleading images. Followers of Jesus are called to love truth, speak honestly, and avoid bearing false witness. A faster draft is never worth sharing something untrue, deceptive, or falsely attributed.",
          "Use AI outputs as starting points, not final authorities. Verify claims with reliable sources, read the Scripture passages you cite, and be transparent when an image or draft was assisted by a tool if that context matters to the people you serve.",
        ],
      },
      {
        heading: "Stewardship asks who is helped and who may be harmed",
        paragraphs: [
          "A wise church asks practical questions before adopting a new technology: Does this help our people? Does it protect the vulnerable? What information leaves our care? Who reviews the result? What happens when it gets something wrong?",
          "A small written policy can turn those questions into practice. Set limits on confidential information, require human review, and make sure any use of AI serves ministry rather than merely chasing novelty.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is artificial intelligence sinful?",
        answer:
          "AI is a human-made tool, not a moral agent. The moral questions concern how people design, use, trust, and apply it—especially whether it serves truth, neighbor-love, justice, and responsible stewardship.",
      },
      {
        question: "Should churches avoid AI completely?",
        answer:
          "Churches should not adopt a tool uncritically, but total avoidance is not the only faithful response. A thoughtful, limited, accountable approach can help a church evaluate whether a particular use truly serves its mission.",
      },
    ],
  },
  {
    slug: "church-branding-guide",
    eyebrow: "Church Communications",
    title: "Church Branding Guide: Build Clarity Before You Build a Logo",
    description:
      "A practical church branding guide for defining your message, voice, visual system, and communication habits without mistaking branding for ministry.",
    readingTime: "7 min read",
    publishedAt,
    intro:
      "Church branding is not about making a church look like a business. It is about helping people recognize who you are, understand how to take a next step, and receive the same clear message wherever they encounter your church.",
    sections: [
      {
        heading: "Start with mission, not colors",
        paragraphs: [
          "Before choosing a logo or redesigning a website, write a simple statement that describes who your church is called to serve and how you want people to respond. If the message is unclear internally, visual polish will not solve the problem.",
          "Ask your leaders to complete one sentence: ‘We want people in our community to know that our church is…’ Look for words that are both true and specific enough to guide your communication.",
        ],
      },
      {
        heading: "Create a small, usable identity system",
        paragraphs: [
          "A good system is easier for volunteers to use than a complicated brand book. Choose a limited color palette, one heading font, one body font, a simple logo treatment, and a short guide for photography and tone. Consistency builds trust over time.",
        ],
        bullets: [
          "Use the same church name and location across your website, maps listing, social profiles, and printed material.",
          "Give volunteers approved templates for announcements, events, and sermon graphics.",
          "Use real church life whenever possible instead of generic images.",
          "Write in a voice that is clear, warm, and honest—never more polished than your actual welcome.",
        ],
      },
      {
        heading: "Let your brand serve a next step",
        paragraphs: [
          "Every communication piece should make it easy to take one next step: visit, register, ask a question, watch a message, join a group, or receive prayer. When every poster has five competing calls to action, people often take none.",
          "Review your public materials quarterly. Remove outdated language, check mobile readability, and ask a first-time guest what they understood in ten seconds. Clarity is a ministry of hospitality.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does a small church need branding?",
        answer:
          "Every church already communicates an identity. A simple brand system helps a small team communicate consistently without spending more time recreating the same materials each week.",
      },
      {
        question: "What is the most important part of church branding?",
        answer:
          "Clarity. A visitor should quickly understand who you are, where and when you meet, what you believe, and how to take a next step.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}
