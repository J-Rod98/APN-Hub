// APN Guides — reviewed, practical articles for Apostolic pastors and churches.
// Launch content is intentionally stored in code so every article is readable,
// searchable, and reviewed before publishing.

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
  referencesHeading?: string;
  references?: { label: string; href: string }[];
};

type StandardGuide = Omit<Guide, "publishedAt" | "sections"> & {
  foundationHeading: string;
  foundation: string[];
  practiceHeading: string;
  practice: string[];
  actions: string[];
  careHeading: string;
  care: string[];
};

const publishedAt = "2026-07-19T00:00:00.000Z";

const standard = ({
  foundationHeading,
  foundation,
  practiceHeading,
  practice,
  actions,
  careHeading,
  care,
  ...guide
}: StandardGuide): Guide => ({
  ...guide,
  publishedAt,
  sections: [
    { heading: foundationHeading, paragraphs: foundation },
    { heading: practiceHeading, paragraphs: practice, bullets: actions },
    { heading: careHeading, paragraphs: care },
  ],
});

const pastorPromptGroups: { heading: string; prompts: string[] }[] = [
  {
    heading: "Study and observation",
    prompts: [
      "Give me ten observation questions for [passage]. Do not interpret the text or create a sermon.",
      "List repeated words, contrasts, commands, and questions in [passage]. Quote only the passage I provide.",
      "Create a blank observation worksheet for studying [passage] in context.",
      "What historical and literary-context questions should I research before teaching [passage]?",
      "Turn these personal study notes into a clean outline without adding new claims: [notes].",
      "Suggest cross-reference categories I should investigate for [theme], and tell me to verify every reference.",
      "Create a comparison table for the people, places, actions, and promises in [passage].",
      "Give me five questions a skeptical listener may ask about [biblical topic].",
      "Make a reading plan for studying [book or theme] over the next seven days.",
      "Turn this public-domain translation of [passage] into simple observation questions for a small group.",
    ],
  },
  {
    heading: "Sermon structure",
    prompts: [
      "Help me test this sermon big idea for clarity and faithfulness to my notes: [big idea and notes].",
      "Give me three outline shapes for this already-studied main point: [main point]. Do not write the sermon.",
      "Identify sentences in this outline that repeat the same idea or distract from the central burden: [outline].",
      "Turn these three points into listener-friendly headings under eight words each: [points].",
      "Give me transition options between these two sermon movements: [movement one] and [movement two].",
      "Create a one-sentence sermon aim from this main point: [main point].",
      "Suggest questions that could help a pastor test whether this application is concrete: [application].",
      "Organize these illustrations by the sermon point they best support: [illustrations].",
      "Create a final-review checklist for this sermon outline, including Scripture, accuracy, and tone.",
      "Turn this sermon outline into discussion questions that stay within the claims I have already made: [outline].",
    ],
  },
  {
    heading: "Application and discipleship",
    prompts: [
      "Give me five practical application questions for believers based on this approved sermon point: [point].",
      "Help me make this application more specific without becoming harsh or simplistic: [application].",
      "Create age-appropriate discussion questions for youth from this teaching summary: [summary].",
      "Create a one-week devotional reflection plan based only on these approved notes: [notes].",
      "Suggest ways to invite response without manipulating emotion for this message: [summary].",
      "Turn these discipleship notes into a leader handout with blanks for discussion: [notes].",
      "Write neutral reflection questions for a new-believers class on [topic].",
      "Create a family conversation guide from this sermon summary: [summary].",
      "List ways this application may land differently for a new believer, a parent, and a long-time saint.",
      "Check this small-group question set for unclear wording or duplicate questions: [questions].",
    ],
  },
  {
    heading: "Church communication",
    prompts: [
      "Rewrite this approved announcement for a text message under 280 characters: [announcement].",
      "Create a warm email version and a short social caption from these verified event details: [details].",
      "Make a volunteer reminder checklist from these confirmed tasks and times: [details].",
      "Turn this event information into a first-time-guest-friendly FAQ: [details].",
      "Give me five headline options that accurately reflect this announcement: [announcement].",
      "Create a plain-language website blurb from this approved ministry description: [description].",
      "Condense these service changes into a clear, kind text message: [changes].",
      "Make a 30-day communication calendar using only these confirmed dates: [dates].",
      "Create caption variations for this approved photo, avoiding invented details: [context].",
      "Proofread this announcement for date, time, place, spelling, and missing next steps: [copy].",
    ],
  },
  {
    heading: "Leadership and teams",
    prompts: [
      "Turn this ministry goal into a one-page meeting agenda: [goal].",
      "Create a volunteer onboarding checklist from these church-approved steps: [steps].",
      "Draft questions for a post-event debrief focused on what worked, what did not, and next actions.",
      "Make a role description from these responsibilities without inventing expectations: [responsibilities].",
      "Turn these meeting notes into an action list with owner and due-date placeholders: [notes].",
      "Create a simple run-of-show template for a church event.",
      "Suggest questions a leadership team should ask before adopting a new software tool.",
      "Create a rotation-planning template with empty names and dates for our ministry team.",
      "Rewrite this volunteer thank-you message in a warm, specific tone: [draft].",
      "Turn these approved policies into a one-page quick-reference guide: [policies].",
    ],
  },
  {
    heading: "Pastoral care boundaries",
    prompts: [
      "Give me a general, non-personalized list of questions a pastor may consider before a hospital visit.",
      "Create a public prayer-meeting order of service with no private names or requests.",
      "Write a general reminder to the church about how to share prayer requests respectfully.",
      "Give me a checklist for reviewing whether an email contains confidential information before sending it.",
      "Create a general follow-up process for first-time guests that does not assume private details.",
      "Make a public-facing explanation of how our church handles prayer requests, using this approved policy: [policy].",
      "Create a generic bereavement-support resource list template for a church to customize locally.",
      "Suggest compassionate but non-clinical wording for inviting someone to speak with a pastor in person.",
      "Create a list of privacy questions a church should answer before adopting a member-care tool.",
      "Proofread this pastoral note for warmth and clarity after I have removed all identifying details: [draft].",
    ],
  },
  {
    heading: "Teaching and media",
    prompts: [
      "Turn this approved teaching outline into a title, description, and three searchable topic tags: [outline].",
      "Create a YouTube description from these verified sermon details and links: [details].",
      "Suggest chapter-marker labels for this message based only on this timeline: [timeline].",
      "Create a transcript cleanup checklist for a public sermon recording.",
      "Turn these public teaching notes into a printable study-guide layout.",
      "Write accessibility-friendly alt text for this church event image: [description of image].",
      "Create a concise podcast episode summary from this approved transcript excerpt: [excerpt].",
      "Generate three non-clickbait titles for this teaching summary: [summary].",
      "Turn this message theme into a simple social carousel outline with no new theological claims: [theme].",
      "Create a review checklist for sermon thumbnails: legibility, accuracy, permissions, and consistency.",
    ],
  },
  {
    heading: "Website and search",
    prompts: [
      "Audit this public church webpage for missing visitor information: [page copy].",
      "Create clear FAQ questions from these verified service details: [details].",
      "Suggest a page title and meta description for this church page without keyword stuffing: [page summary].",
      "Turn these ministry details into a simple ‘Plan Your Visit’ page outline.",
      "Check this event page for missing date, time, address, contact, and registration information: [copy].",
      "Create a local-search checklist for a church’s public information across its website and map listing.",
      "Rewrite this ministry page in plain language for a first-time visitor: [copy].",
      "Suggest internal links from this article to these existing church pages: [article and links].",
      "Create a monthly website-maintenance checklist for a church communications team.",
      "Flag jargon in this church copy that a first-time guest may not understand: [copy].",
    ],
  },
  {
    heading: "Events and outreach",
    prompts: [
      "Create an event-planning timeline from these confirmed dates and tasks: [details].",
      "Turn this event brief into a volunteer callout with clear roles and arrival times: [brief].",
      "Create a guest-follow-up message for this event that is warm and optional: [event details].",
      "Make a supply checklist from this confirmed event plan: [plan].",
      "Write three invitation messages for this community event using only verified details: [details].",
      "Create a post-event survey with five respectful questions for attendees.",
      "Turn these outreach notes into a debrief template for the team.",
      "Write a clear weather-plan announcement using these approved alternatives: [alternatives].",
      "Create an accessible event FAQ from this plan: [plan].",
      "Proofread this registration page for clarity, deadlines, fees, and contact details: [copy].",
    ],
  },
  {
    heading: "Personal productivity",
    prompts: [
      "Turn this list of ministry tasks into a weekly priority plan with time blocks: [tasks].",
      "Create a Sunday-to-Sunday communications checklist for a pastor or communications lead.",
      "Make a reusable template for recording sermon ideas without treating them as a finished sermon.",
      "Turn these scattered notes into a project brief with goals, owners, and unanswered questions: [notes].",
      "Create a meeting-preparation template for a ministry leader.",
      "Suggest a simple way to batch these repeated communication tasks: [tasks].",
      "Create a checklist for closing out a church project and saving reusable lessons.",
      "Turn this rough calendar into a readable month-at-a-glance format: [calendar].",
      "Write a polite decline email for a request our ministry cannot support right now: [context].",
      "Create a personal review template for evaluating which tools actually saved time this month.",
    ],
  },
];

const churchPromptGroups: { heading: string; prompts: string[] }[] = [
  {
    heading: "Guest communication",
    prompts: [
      "Create a first-time guest email from these approved service details: [details].",
      "Turn this service-time change into a plain-language text message: [details].",
      "Build a ‘What to expect’ FAQ using only these verified details: [details].",
      "Proofread this welcome-page copy for unfamiliar church jargon: [copy].",
      "Create a gentle invitation to ask questions without collecting unnecessary information.",
    ],
  },
  {
    heading: "Volunteer teams",
    prompts: [
      "Make a volunteer reminder from these confirmed arrival times and duties: [details].",
      "Turn these instructions into a one-page event run sheet: [instructions].",
      "Create a post-event debrief template with wins, issues, and next steps.",
      "Write a specific volunteer thank-you note from this list of contributions: [contributions].",
      "Create an onboarding checklist from these approved ministry steps: [steps].",
    ],
  },
  {
    heading: "Public content",
    prompts: [
      "Create three accurate social captions from this verified announcement: [announcement].",
      "Turn this sermon summary into a website description and searchable topic tags: [summary].",
      "Write alt text for this image based on this factual description: [description].",
      "Create a four-week content calendar from these confirmed events and teaching themes: [details].",
      "Check this public page for missing date, location, next step, and contact information: [copy].",
    ],
  },
  {
    heading: "Operations",
    prompts: [
      "Turn these staff notes into an action list with empty owner and due-date fields: [notes].",
      "Create a decision checklist for evaluating a new church software subscription.",
      "Make a reusable meeting agenda for a church communications team.",
      "Organize this public project brief into goals, tasks, risks, and questions: [brief].",
      "Create a monthly website and social-media maintenance checklist.",
    ],
  },
  {
    heading: "Safety and review",
    prompts: [
      "List any private information in this draft that should be removed before it is entered into an AI tool: [draft].",
      "Create a final-review checklist for public copy: facts, names, dates, Scripture, permissions, and tone.",
      "Rewrite this only after I have removed personal details; tell me what information should never be pasted into a public AI tool.",
      "Suggest questions our leaders should ask about data handling before adopting this tool: [tool].",
      "Create a short staff reminder: AI outputs are drafts and require human approval before publication.",
    ],
  },
];

export const guides: Guide[] = [
  standard({
    slug: "can-christians-use-ai",
    eyebrow: "Faith & Technology",
    title: "Can Christians Use AI?",
    description: "A biblical and practical framework for Christians who want to use artificial intelligence with wisdom, truthfulness, and care for people.",
    readingTime: "8 min read",
    intro: "Christians do not need to choose between fear of artificial intelligence and uncritical excitement about it. AI is a human-made tool. The better question is whether a particular use helps us love God and neighbor, speak truthfully, steward our responsibilities, and protect people from harm.",
    foundationHeading: "Start with the dignity of people",
    foundation: [
      "Scripture does not name artificial intelligence, so it is wise to resist easy proof texts. It does teach that people are made in the image of God. A tool may generate language or images, but it does not carry spiritual life, moral responsibility, or the calling to love its neighbor.",
      "That distinction keeps the conversation grounded. AI can assist with a task; it cannot become a conscience, pastor, counselor, or authority over Scripture. The person using the tool remains responsible for the truth and consequences of what is done.",
    ],
    practiceHeading: "Use AI as an assistant, not an authority",
    practice: [
      "The healthiest first uses are low-risk and easy to review: organizing your own notes, drafting a public announcement, building a checklist, or suggesting a first-pass structure. The result should be treated as a draft, not as something ready to share.",
      "Ask a simple question before each use: if this output is wrong, who could be harmed? The greater the risk to a person, a relationship, or the church's witness, the more the work should remain human and accountable.",
    ],
    actions: [
      "Verify claims, Scripture references, quotations, names, and dates before sharing anything.",
      "Keep prayer, biblical interpretation, pastoral care, and final ministry decisions with people.",
      "Do not paste counseling notes, prayer requests, giving information, children’s data, passwords, or private member records into a general AI service.",
      "Be honest about AI-assisted work when that context matters to the people receiving it.",
    ],
    careHeading: "Choose wisdom over speed",
    care: [
      "AI can sound confident while being wrong. Christians are called to truthfulness, not merely efficiency. Never publish a result you have not understood and checked, especially when it names people, describes an event, teaches Scripture, or represents the church publicly.",
      "A brief written policy can help a church use new tools without losing its bearings. Decide what data may never be entered, who approves public work, and how the team evaluates whether a tool is actually serving ministry.",
    ],
    faqs: [
      { question: "Is using AI sinful?", answer: "AI is a tool, not a moral agent. The moral question is how people design, use, trust, and apply it—whether that use serves truth, stewardship, and love of neighbor." },
      { question: "Should Christians avoid AI entirely?", answer: "Caution is wise, but total avoidance is not the only faithful response. A limited, accountable use can help Christians evaluate whether a particular tool genuinely serves a good purpose." },
    ],
  }),
  standard({
    slug: "can-pastors-use-chatgpt",
    eyebrow: "Pastoral Leadership",
    title: "Can Pastors Use ChatGPT?",
    description: "A practical guide for pastors who want to use ChatGPT for low-risk work without outsourcing prayer, biblical study, pastoral care, or accountability.",
    readingTime: "7 min read",
    intro: "A pastor can use ChatGPT as a writing and organization assistant, but it should never become a substitute for prayer, study, spiritual discernment, or personal shepherding. Its best role is to reduce repetitive work that a pastor can personally review.",
    foundationHeading: "Know what ChatGPT is good at",
    foundation: [
      "ChatGPT is useful for turning rough notes into a clearer format, suggesting questions, creating a first draft of public copy, or organizing a project. It predicts useful language; it does not know your congregation, your doctrine, or the spiritual needs behind a question.",
      "That means a response is not a final answer. It is material for a pastor or trusted team member to test, revise, and either use or discard.",
    ],
    practiceHeading: "Start with a public, low-risk task",
    practice: [
      "Begin with a task where the downside of an error is low and human review is easy. For example, provide your own approved announcement notes and ask for a text-message version, a short email, and a social caption. Then check each one for accuracy and voice.",
      "If the tool saves time without lowering clarity or care, keep the prompt as a repeatable template. Expand only after the team has a clear review process.",
    ],
    actions: [
      "Rewrite an approved event announcement for email, text, and social media.",
      "Create a first-pass volunteer or meeting checklist from facts you provide.",
      "Organize your own teaching notes without asking it to invent biblical claims.",
      "Create discussion questions from a sermon you have already prepared and reviewed.",
    ],
    careHeading: "Keep ministry responsibility with people",
    care: [
      "Do not use ChatGPT to impersonate your pastoral voice in a sensitive exchange, give counseling, handle discipline, or make decisions about people. Never enter private prayer requests, counseling details, financial data, or children's information into a general-purpose tool.",
      "Before sharing an AI-assisted draft, check facts, tone, Scripture references, and whether it reflects your actual church. A polished generic answer is not the same thing as faithful pastoral care.",
    ],
    faqs: [
      { question: "Can ChatGPT write a pastor's sermon?", answer: "It can generate language, but a pastor should not outsource prayerful study, biblical interpretation, discernment, or responsibility for what is preached. It may help organize your own notes, but it should not replace the work of preaching." },
      { question: "What should pastors never put into ChatGPT?", answer: "Never paste confidential ministry information, including counseling details, prayer requests, financial records, member data, children's information, or passwords." },
    ],
    references: [{ label: "ChatGPT: getting started", href: "https://openai.com/academy/getting-started/" }],
  }),
  standard({
    slug: "best-ai-tools-for-pastors-in-2026",
    eyebrow: "Church Operations",
    title: "Best AI Tools for Pastors in 2026",
    description: "A practical way to evaluate AI writing, design, productivity, and transcription tools for pastoral work without chasing every new feature.",
    readingTime: "9 min read",
    intro: "The best AI tool for a pastor is usually not the newest tool. It is the one that helps with a real, low-risk task, fits the church’s workflow, and can be reviewed responsibly. Start with the work you need done, not the hype around a product.",
    foundationHeading: "Choose a category before a product",
    foundation: [
      "Pastors often need help with four kinds of work: writing and brainstorming, visual design, shared productivity, and public-media transcription. Naming the actual need will prevent a collection of subscriptions that nobody uses well.",
      "A writing assistant may help clarify announcements or organize notes. A design tool may help a volunteer resize approved material. A productivity assistant may fit a church already working in a shared office system. Each should be tested against a real task.",
    ],
    practiceHeading: "Run a short, accountable pilot",
    practice: [
      "Choose one or two trusted users, one task, and a short trial period. Measure whether the tool reduced repetitive work, whether the output was accurate enough to review efficiently, and whether the team understood its privacy settings.",
      "Plans, features, permissions, and pricing change frequently. Review the exact plan you would use before sharing data, buying a subscription, or relying on a feature in a ministry workflow.",
    ],
    actions: [
      "ChatGPT or Claude: brainstorm, organize public notes, and create reviewed first drafts.",
      "Canva Magic Studio: develop first-pass visual ideas and adapt approved graphics for different formats.",
      "Microsoft Copilot: consider it when staff already work inside Microsoft 365.",
      "A transcription tool: turn a public sermon recording into a draft that a human editor checks.",
    ],
    careHeading: "Adopt safeguards before you adopt subscriptions",
    care: [
      "No tool should receive confidential pastoral, financial, children's, or member information unless the church has approved a secure process for it. Public-facing work should be reviewed by a person for facts, theology, voice, permissions, and tone.",
      "Choose who can create accounts, approve paid tools, and remove access when a staff member or volunteer leaves. A simple policy is far more valuable than a long list of apps.",
    ],
    faqs: [
      { question: "What is the best free AI tool for a pastor?", answer: "Start with the free version of one general writing assistant for one low-risk task, such as rewriting an approved announcement. A repeatable, reviewed process matters more than having multiple tools." },
      { question: "Will AI replace pastors?", answer: "AI may assist with administrative or first-draft work, but it cannot pray, shepherd, discern, take responsibility, or live in accountable relationship with a congregation." },
    ],
    references: [
      { label: "ChatGPT: getting started", href: "https://openai.com/academy/getting-started/" },
      { label: "Claude: common uses", href: "https://support.anthropic.com/en/articles/7996845-what-are-some-things-i-can-use-claude-for" },
      { label: "Canva Magic Studio", href: "https://www.canva.com/magic-studio/" },
      { label: "Microsoft Copilot", href: "https://www.microsoft.com/microsoft-365/copilot" },
    ],
  }),
  standard({
    slug: "claude-vs-chatgpt-for-sermon-preparation",
    eyebrow: "Preaching & Teaching",
    title: "Claude vs ChatGPT for Sermon Preparation",
    description: "How pastors can compare Claude and ChatGPT for low-risk sermon-preparation support while keeping prayerful study and final responsibility human.",
    readingTime: "8 min read",
    intro: "Claude and ChatGPT can both help a pastor organize notes, test clarity, and create first-pass discussion questions. Neither should be treated as a source of doctrine, a replacement for biblical study, or a sermon writer. Compare them by the task you need to review—not by which tool makes the boldest claim.",
    foundationHeading: "Both tools are assistants, not authorities",
    foundation: [
      "Both services can produce useful structure from material you provide, and both can make confident mistakes. A sermon is not ready because a tool made it sound polished. A pastor remains responsible to study the text, pray, verify claims, and preach faithfully.",
      "The safest comparison is practical: give each tool the same non-confidential notes and ask for the same narrow task. Then review accuracy, clarity, usefulness, and how easily the output can be corrected.",
    ],
    practiceHeading: "Compare one clear workflow",
    practice: [
      "Choose an existing sermon outline or public teaching summary. Ask each tool to identify repeated ideas, suggest neutral discussion questions, or organize your own notes into headings. Do not ask either service to invent exegesis or speak with authority where you have not studied.",
      "Use the version that helps your actual workflow while remaining easy to review. If neither improves clarity or saves meaningful time, do not force a tool into the process.",
    ],
    actions: [
      "Ask both tools to turn your approved outline into a final-review checklist.",
      "Compare how each organizes your own notes without adding new theological claims.",
      "Test how well each turns an approved sermon summary into small-group questions.",
      "Keep a record of prompts that were helpful and outputs that needed correction.",
    ],
    careHeading: "Do not turn comparison into dependence",
    care: [
      "Never paste confidential information into either tool. Do not ask either service for pastoral counseling, private-care responses, or final decisions about people. The more personal or spiritually weighty the work, the more it belongs in prayerful human relationships.",
      "Features and data settings change, so read current provider documentation before a church adopts either product. The best result is not more automation; it is a clearer, more faithful process.",
    ],
    faqs: [
      { question: "Which is better for writing sermons, Claude or ChatGPT?", answer: "Neither should write a pastor's sermon. Either may help with low-risk tasks such as organizing your own notes or generating discussion questions from an approved summary. Choose based on a small, reviewed test of those tasks." },
      { question: "Can I upload sermon notes to an AI tool?", answer: "Only upload notes you are comfortable sharing under the provider's current settings. Remove private names, counseling details, prayer requests, and any confidential church information first." },
    ],
    references: [
      { label: "ChatGPT: getting started", href: "https://openai.com/academy/getting-started/" },
      { label: "Claude: common uses", href: "https://support.anthropic.com/en/articles/7996845-what-are-some-things-i-can-use-claude-for" },
    ],
  }),
  {
    slug: "100-chatgpt-prompts-every-pastor-should-save",
    eyebrow: "Pastoral Leadership",
    title: "100 ChatGPT Prompts Every Pastor Should Save",
    description: "One hundred copy-ready prompts for sermon organization, communication, teams, events, media, and ministry planning—plus the boundaries pastors should keep.",
    readingTime: "18 min read",
    publishedAt,
    intro: "These prompts are designed to help pastors organize work they already own. They are not shortcuts for prayer, biblical interpretation, counseling, or final ministry decisions. Replace bracketed text with verified, non-confidential information, then review every response before using it.",
    sections: [
      { heading: "Use these prompts wisely", paragraphs: ["A useful prompt gives the tool a narrow task, clear source material, and a defined format. It does not ask a language model to become a pastor, invent facts, or handle a private situation.", "Never enter prayer requests, counseling notes, member records, financial information, children's data, passwords, or anything else entrusted to your care. Treat every output as an untrusted draft until you have checked it."], bullets: ["Use your own reviewed notes as the source material.", "Check Scripture references, quotations, names, dates, and event details.", "Keep theological judgment, pastoral care, and final approval with people."] },
      ...pastorPromptGroups.map((group) => ({ heading: group.heading, paragraphs: ["Copy a prompt below, replace the bracketed material with verified information, and review the result before sharing it."], bullets: group.prompts })),
    ],
    faqs: [
      { question: "Can I copy these prompts exactly?", answer: "Yes. Replace the bracketed text with your own non-confidential material and adjust the requested format for your church. The output still needs your review." },
      { question: "Should I use these prompts for counseling or private care?", answer: "No. Keep counseling, discipline, prayer requests, and sensitive pastoral care in accountable human relationships. Do not enter private information into a general AI tool." },
    ],
    references: [{ label: "ChatGPT: getting started", href: "https://openai.com/academy/getting-started/" }],
  },
  standard({
    slug: "ai-sermon-preparation-workflow",
    eyebrow: "Preaching & Teaching",
    title: "AI Sermon Preparation Workflow",
    description: "A responsible AI-assisted workflow for pastors who want to reduce repetitive sermon-preparation tasks without outsourcing prayerful study or preaching.",
    readingTime: "9 min read",
    intro: "An AI sermon-preparation workflow should protect the most important parts of sermon work: prayer, reading the text in context, careful study, discernment, and the pastor's responsibility for what is preached. AI can assist around the edges; it should not carry the center.",
    foundationHeading: "Keep the text and prayer at the center",
    foundation: [
      "Begin by reading the passage in context and recording your own observations. Ask what the text says, what it meant in its setting, and what faithful response it calls for today. Do this before asking a tool to organize anything.",
      "Use trusted study practices and accountable leadership for interpretation. AI-generated claims, quotations, and references must be verified independently; confident wording is not evidence.",
    ],
    practiceHeading: "Let AI help with low-risk organization",
    practice: [
      "After you have studied and drafted a main idea, use AI to organize your own notes, identify duplicate points, test whether headings are clear, or create questions from an approved summary. Give the tool a narrow task and source material you are willing to share.",
      "The workflow should save you time on editing and communication, not cut the spiritual work out of the message. If an output pushes you away from the passage or your own burden, set it aside.",
    ],
    actions: [
      "Read, pray, observe, and study before using an AI tool.",
      "Write a one-sentence sermon burden in your own words.",
      "Use AI to organize notes or test clarity after the main work is done.",
      "Read the final message aloud and verify every Scripture reference and illustration.",
    ],
    careHeading: "Finish with human review and pastoral care",
    care: [
      "Before preaching, examine whether each point actually serves the passage and whether applications are clear, gracious, and appropriate for the people in the room. Ask a trusted leader to identify unclear language or unintended implications.",
      "Do not paste private conversations, prayer requests, or counseling material into the workflow. AI may help organize a public teaching task; it should not become part of confidential pastoral care.",
    ],
    faqs: [
      { question: "Can AI create a sermon outline?", answer: "It can create a draft structure, but the pastor should only use it after prayerful study and personal verification. The final outline must be faithful to the text and the pastor's responsibility." },
      { question: "What is a safe first AI task for sermon preparation?", answer: "Try asking it to organize your own non-confidential notes into headings or create discussion questions from a final, approved sermon summary." },
    ],
  }),
  standard({
    slug: "how-i-prepare-a-sermon-in-half-the-time",
    eyebrow: "Preaching & Teaching",
    title: "How I Prepare a Sermon in Half the Time",
    description: "A realistic sermon-preparation system for reducing repeated administration and decision fatigue without rushing prayer, biblical study, or pastoral discernment.",
    readingTime: "8 min read",
    intro: "Preparing a sermon in less time should never mean giving Scripture less attention. The goal is to reduce repeated logistics, scattered notes, and unnecessary decisions so that prayerful study and wise application receive the time they deserve.",
    foundationHeading: "Protect the work that cannot be rushed",
    foundation: [
      "Set apart your first block of preparation for prayer, reading, observation, and study. Begin with the text rather than your slides, social posts, or an outline template. A fast process that produces a shallow message has not actually saved anything.",
      "What can be streamlined is the surrounding work: capturing ideas, organizing research, naming files, scheduling reviews, and repurposing an approved final message.",
    ],
    practiceHeading: "Build a repeatable weekly rhythm",
    practice: [
      "Use the same stages each week: collect observations, clarify the main burden, build the outline, prepare application, review aloud, and then create communication assets. A repeatable order helps you know what comes next without recreating the process from scratch.",
      "Batch similar work together. Keep a single place for sermon ideas, a reusable outline template, and a short final-review list. You may use AI for low-risk organization after your study is already underway.",
    ],
    actions: [
      "Choose a passage and begin observation early in the week.",
      "Write one sentence that captures the message before designing slides or titles.",
      "Use a single template for outlines, notes, and final review.",
      "Repurpose only the approved final sermon into captions, discussion questions, or a summary.",
    ],
    careHeading: "Measure faithfulness as well as speed",
    care: [
      "Do not judge a new process by hours saved alone. Ask whether the message is clearer, whether you arrived prepared rather than hurried, and whether the process left room for prayer and pastoral reflection.",
      "If a tool or shortcut makes the message generic, unverified, or disconnected from your people, it is not serving the purpose. Remove it and protect the parts of preparation only a pastor can do.",
    ],
    faqs: [
      { question: "Can every pastor cut sermon preparation time in half?", answer: "No. Context, preaching frequency, study needs, and pastoral responsibilities differ. The point is to remove repeatable administrative friction, not to promise a fixed number of hours." },
      { question: "What is the fastest safe improvement?", answer: "Use one place for notes, a reusable outline and final-review template, and a regular early-week study block. Those changes reduce decision fatigue without reducing care." },
    ],
  }),
  standard({
    slug: "ai-church-administration-guide",
    eyebrow: "Church Operations",
    title: "AI Church Administration Guide",
    description: "A practical guide to using AI for repeatable church administration while protecting confidential data, leadership accountability, and the people you serve.",
    readingTime: "8 min read",
    intro: "AI can help a church administration team move through routine writing, planning, and organization tasks more clearly. It should not become a back door for confidential data or a replacement for accountable leadership decisions.",
    foundationHeading: "Identify repeatable work first",
    foundation: [
      "Look for work that is public, repetitive, and easy for a person to verify: event checklists, meeting agendas, volunteer reminders, plain-language announcements, and project debrief templates. These are better starting places than people records or sensitive correspondence.",
      "Write down the current process before adding AI. If the team cannot describe the task clearly, a tool will usually make the confusion faster rather than solve it.",
    ],
    practiceHeading: "Create a simple review workflow",
    practice: [
      "Give the tool approved facts and ask for a defined output such as a checklist, agenda, or public draft. A staff member then verifies dates, names, responsibilities, tone, and next steps before anything is used.",
      "Save only prompts and templates that repeatedly help. A small library of reviewed workflows is safer and more useful than letting every user invent an approach alone.",
    ],
    actions: [
      "Create an event run-of-show from confirmed details.",
      "Turn meeting notes into an action list with owner and due-date placeholders.",
      "Rewrite a public announcement for email and text after a leader verifies it.",
      "Create a monthly maintenance checklist for the website and social channels.",
    ],
    careHeading: "Protect data and accountability",
    care: [
      "Never place counseling details, prayer requests, member records, giving data, children's information, passwords, or other confidential material into a general-purpose AI tool. Review the provider's current settings and your church's policy before any tool touches internal work.",
      "Decide who may create accounts, approve subscriptions, and remove access. Church administration becomes safer when responsibility is clear before the tool arrives.",
    ],
    faqs: [
      { question: "Can churches use AI to manage members?", answer: "Churches should be extremely cautious with member and pastoral data. Do not upload private records to a general AI service. Use only approved systems and policies designed for the information involved." },
      { question: "What is a good first administrative use of AI?", answer: "Try a public event checklist or an agenda built from confirmed information. It is low-risk, easy to review, and helps the team learn a safe process." },
    ],
  }),
  standard({
    slug: "church-website-checklist",
    eyebrow: "Church Communications",
    title: "Church Website Checklist",
    description: "A practical checklist for making a church website clear for first-time guests, regular attendees, and local search—on phones as well as desktops.",
    readingTime: "7 min read",
    intro: "A church website does not need every feature to serve people well. It needs to answer a visitor’s first questions quickly: Who are you? When do you meet? Where do I go? What can I expect? What should I do next?",
    foundationHeading: "Put guest information where people can find it",
    foundation: [
      "A first-time guest should not need to open several menus to find service times, location, or a clear welcome. Put those details near the top of the homepage and check them on a phone, where many visitors will first encounter them.",
      "Keep the public facts consistent across your website, map listing, social profiles, and event pages. Inconsistent times, addresses, or church names create hesitation before someone ever visits.",
    ],
    practiceHeading: "Build essential pages before extras",
    practice: [
      "Give each key page one job: help someone plan a visit, understand your beliefs, find a sermon, see a current event, or ask a question. Clear, maintained pages build more trust than a crowded site with old information.",
      "Set a recurring monthly check so dates, staff information, buttons, and contact paths stay current. Ask someone who does not manage the website to test the journey as a first-time guest.",
    ],
    actions: [
      "Homepage: church name, city, service times, directions, and a clear welcome.",
      "Plan Your Visit: parking, children, dress expectations, accessibility, and what a guest can expect.",
      "Beliefs and next steps: plain-language information and an easy way to connect.",
      "Sermons, events, contact, and privacy: current details with links to original sources where appropriate.",
    ],
    careHeading: "Make mobile clarity a ministry priority",
    care: [
      "Open every important page on a small phone screen. Check whether headings fit, buttons work, maps open, forms are usable, and the most important information appears without excessive scrolling.",
      "Search engines benefit from the same basics visitors need: clear headings, accurate local information, useful pages, fast loading, and content that is kept current. Start with people, and the technical work becomes easier to prioritize.",
    ],
    faqs: [
      { question: "What should be on a church homepage?", answer: "At minimum: a clear welcome, service times, location or directions, a visitor next step, current events, and paths to beliefs, sermons, and contact details." },
      { question: "How often should a church website be updated?", answer: "Review public details weekly and complete a wider check monthly. Update service changes, event information, staff details, and broken links as soon as they change." },
    ],
  }),
  standard({
    slug: "church-branding-guide",
    eyebrow: "Church Communications",
    title: "Church Branding Guide",
    description: "A practical church branding guide for building a clear message, usable visual system, and consistent communication without mistaking branding for ministry.",
    readingTime: "7 min read",
    intro: "Church branding is not about making a church look like a business. It is about helping people recognize who you are, understand your message, and take a next step wherever they encounter your church.",
    foundationHeading: "Start with mission, not colors",
    foundation: [
      "Before changing a logo, write a simple sentence describing who your church is called to serve and how you hope people will respond. If the message is unclear internally, more visual polish will not solve the underlying problem.",
      "Ask leaders to name what is true and distinctive about the church in plain language. The words that survive that conversation should guide your website, signs, ministry pages, and invitations.",
    ],
    practiceHeading: "Create a small system volunteers can use",
    practice: [
      "A practical identity system is better than a complicated brand book nobody can find. Choose a limited color palette, one heading font, one body font, a clear logo treatment, and a small set of reusable templates.",
      "Consistency builds trust because people can quickly recognize a communication as yours. It also saves a small team from recreating every event graphic and announcement each week.",
    ],
    actions: [
      "Use the same church name and location across your website, map listing, social profiles, and print materials.",
      "Give volunteers approved templates for events, sermons, and announcements.",
      "Use real church life and properly licensed imagery whenever possible.",
      "Write in a voice that is warm, clear, honest, and never more polished than your actual welcome.",
    ],
    careHeading: "Let every design point to a next step",
    care: [
      "Every public piece should make one next step clear: visit, register, watch a message, ask a question, join a group, or receive prayer. When a poster asks for five different actions, many people take none.",
      "Review public materials quarterly. Remove outdated language, test mobile readability, and ask a first-time guest what they understood in ten seconds. Clarity is a form of hospitality.",
    ],
    faqs: [
      { question: "Does a small church need branding?", answer: "Every church already communicates an identity. A simple, usable system helps a small team communicate consistently without spending more time recreating the same materials." },
      { question: "What is the most important part of church branding?", answer: "Clarity. A visitor should quickly understand who you are, where and when you meet, what you believe, and how to take a next step." },
    ],
  }),
  standard({
    slug: "church-seo-for-beginners",
    eyebrow: "Church Communications",
    title: "Church SEO for Beginners",
    description: "A plain-language introduction to church SEO: help local people find accurate service information, useful pages, and trustworthy next steps.",
    readingTime: "7 min read",
    intro: "Church SEO is not a trick for manipulating search engines. It is the discipline of making your public information accurate, useful, and easy for people to find when they search for a church, a service time, or a ministry need in your area.",
    foundationHeading: "Start with information people actually search for",
    foundation: [
      "People often search for a church name, a city, service times, beliefs, children's ministry, events, prayer, or sermons. Your site should answer those questions clearly in the language a first-time visitor would understand.",
      "Make sure your church name, address, phone number, service times, and website are consistent wherever people encounter them. Accuracy matters more than repeating a phrase unnaturally.",
    ],
    practiceHeading: "Create helpful, specific pages",
    practice: [
      "Give important topics their own pages rather than hiding everything in a single long homepage. A Plan Your Visit page, current events page, beliefs page, sermon archive, and ministry pages give both people and search engines clear context.",
      "Use descriptive page titles and headings. For example, a page about visiting should say what it offers rather than using a vague label such as ‘Discover.’",
    ],
    actions: [
      "Keep service times, address, and contact details current on every public channel.",
      "Write a useful title and description for each important page.",
      "Add clear links between related pages, such as events, visitor information, and contact.",
      "Review the site on a phone and fix broken links, slow images, and confusing navigation.",
    ],
    careHeading: "Avoid shortcuts that damage trust",
    care: [
      "Do not stuff a page with repeated keywords, copy another church's writing, or publish thin pages only to chase traffic. Those choices are unhelpful to visitors and can weaken trust.",
      "Publish information your church can stand behind. Update it when it changes, link to original sources for outside events or resources, and let usefulness—not volume—guide your content calendar.",
    ],
    faqs: [
      { question: "How long does church SEO take?", answer: "It is an ongoing practice, not a one-time switch. Start by correcting public information and creating useful pages; results depend on your area, competition, and the quality of the site over time." },
      { question: "Do churches need a blog for SEO?", answer: "Not necessarily. Accurate visitor information and useful core pages come first. Articles can help when they genuinely answer questions people ask and are maintained over time." },
    ],
  }),
  standard({
    slug: "church-marketing-on-a-budget",
    eyebrow: "Church Communications",
    title: "Church Marketing on a Budget",
    description: "A practical church marketing plan for small teams: focus on clear guest information, consistent communication, local relationships, and measurable next steps.",
    readingTime: "7 min read",
    intro: "Church marketing on a budget is not about manufacturing attention. It is about making a genuine invitation easy to understand, helping people find accurate information, and communicating faithfully with the community you are called to serve.",
    foundationHeading: "Spend clarity before spending money",
    foundation: [
      "Before buying ads, make sure someone can find your service times, address, beliefs, next steps, and a way to ask a question. A clear website and current map listing often do more for a first-time guest than a polished campaign that leads to outdated information.",
      "Choose one audience and one next step for each communication. A new family may need a clear Plan Your Visit page; a community event may need a date, location, and uncomplicated registration path.",
    ],
    practiceHeading: "Use the channels you can maintain",
    practice: [
      "A consistent weekly rhythm on a few channels is stronger than opening every platform and abandoning them. Build from what your team can actually sustain: website updates, an email list, a map listing, social posts, printed invitations, and personal relationships.",
      "Track simple signals such as page visits, registrations, questions, and first-time guests. Use those signals to improve clarity rather than treating every number as a measure of spiritual fruit.",
    ],
    actions: [
      "Keep your website, map listing, and social profiles accurate.",
      "Create one clear invitation page for each major event or ministry emphasis.",
      "Repurpose approved information into email, text, social, and print formats.",
      "Ask guests how they heard about the church and record only what is useful and appropriate.",
    ],
    careHeading: "Keep communication truthful and hospitable",
    care: [
      "Use real details, real church life, and properly licensed images. Do not promise an experience your church cannot provide or use emotional pressure to create a response.",
      "Budget for the basics first: clear information, a welcoming follow-up process, and tools the team can maintain. A modest plan faithfully carried out often outperforms a complicated campaign without ownership.",
    ],
    faqs: [
      { question: "Should a church pay for social-media ads?", answer: "It can be appropriate for a specific local event or invitation after your landing page and follow-up are ready. Start small, use a clear purpose, and evaluate whether it led to meaningful next steps." },
      { question: "What is the best free marketing tool for churches?", answer: "A current, mobile-friendly website and accurate local listing are foundational. They help people act on the interest created by any other invitation." },
    ],
  }),
  standard({
    slug: "best-church-website-builders",
    eyebrow: "Church Communications",
    title: "Best Church Website Builders",
    description: "How to choose a church website builder based on your team, content needs, budget, ownership, accessibility, and ability to keep visitor information current.",
    readingTime: "8 min read",
    intro: "The best church website builder is the one your team can keep accurate, accessible, and welcoming. A platform should make it easy to update service information, publish sermons and events, support mobile visitors, and hand ownership to the next volunteer or staff member.",
    foundationHeading: "Choose for your real team and workflow",
    foundation: [
      "Start by listing what the site must do in the next year: communicate service times, provide directions, host or link sermons, publish events, collect basic inquiries, and explain beliefs or next steps. Then consider who will update those things each week.",
      "A platform that looks impressive but requires a specialist for every update may be a poor fit for a small church. Ownership and maintainability are features, not afterthoughts.",
    ],
    practiceHeading: "Compare practical requirements",
    practice: [
      "Build a short comparison sheet and test each option with a real page. Can a volunteer update service times? Does the page look good on a phone? Can you export content or hand off access? Are forms, privacy, domains, and media costs clear?",
      "Avoid making the decision from a template gallery alone. The best test is whether a first-time guest can find the essential information and whether your team can keep it current.",
    ],
    actions: [
      "Mobile editing and responsive design.",
      "Clear ownership, administrator access, and account recovery.",
      "Events, sermon links, contact forms, and privacy controls that fit your needs.",
      "Accessible templates, fast-loading pages, and a manageable total cost.",
    ],
    careHeading: "Own your information and your next step",
    care: [
      "Use a church-controlled account, a church-controlled domain, and a shared record of renewals and access. Avoid building a public presence that depends entirely on one volunteer's personal login.",
      "Before moving platforms, back up content, check redirects for old pages, and make sure important contact or donation links still work. A good transition protects visitors from dead ends.",
    ],
    faqs: [
      { question: "Do churches need a special church website builder?", answer: "Not always. A general website platform can work well if it meets your needs for updates, mobile usability, forms, privacy, ownership, and public content." },
      { question: "What should a church website cost?", answer: "Costs vary by platform, domain, forms, media, design help, and support. Compare the full annual cost and the time required to maintain the site rather than looking only at the introductory price." },
    ],
  }),
  standard({
    slug: "logos-vs-accordance",
    eyebrow: "Bible Study",
    title: "Logos vs Accordance",
    description: "A pastor-focused way to compare Logos and Accordance Bible software by study workflow, library needs, device use, learning curve, and budget.",
    readingTime: "8 min read",
    intro: "Logos and Accordance are established Bible-study software options with different strengths, libraries, interfaces, and learning curves. The best choice depends on how you study, what resources you need, what devices you use, and whether the investment helps your actual preparation rhythm.",
    foundationHeading: "Compare your workflow, not a feature list",
    foundation: [
      "Begin with the work you repeat: reading a passage in context, searching Scripture, consulting trusted resources, organizing notes, preparing a lesson, or studying original languages if that is part of your calling and training. A large feature set only helps when it supports those habits.",
      "Library packages, pricing, platform support, and features can change. Use the current product information and a personal trial or demonstration rather than relying on an old comparison chart.",
    ],
    practiceHeading: "Test a real study assignment",
    practice: [
      "Choose a passage you will teach soon. In each program, complete the same basic tasks: read the context, find cross-references, consult resources you trust, take notes, and export or organize the result. Notice which interface helps you work carefully without getting lost in options.",
      "If possible, use a trial period or ask another pastor to show you the workflow they actually use. The goal is not to own the largest library; it is to support faithful study over time.",
    ],
    actions: [
      "Check the resources included in the exact package you would purchase.",
      "Test searching, notes, reading plans, and your preferred device.",
      "Compare total cost, upgrade expectations, and access to the books you need.",
      "Ask whether the tool supports your study habits instead of replacing them with constant feature exploration.",
    ],
    careHeading: "Software does not remove the need for discernment",
    care: [
      "A study platform can organize resources, but it cannot interpret Scripture faithfully on your behalf. Read the biblical text in context, use resources responsibly, and stay accountable to sound doctrine and trusted leadership.",
      "Avoid using a tool to collect quotations without understanding their context. The strength of a sermon or lesson is not the number of resources cited; it is the truthfulness and faithfulness of what is taught.",
    ],
    faqs: [
      { question: "Which is better, Logos or Accordance?", answer: "There is no universal answer. Compare them using the passages, devices, resources, budget, and study habits you actually have. A real workflow test is more helpful than a generic winner." },
      { question: "Do Bible-software tools replace commentaries or study?", answer: "No. They provide access and organization. Pastors still need prayerful reading, careful interpretation, sound resources, and personal responsibility for what they teach." },
    ],
    references: [
      { label: "Logos Bible Software", href: "https://www.logos.com/" },
      { label: "Accordance Bible Software", href: "https://www.accordancebible.com/" },
    ],
  }),
  standard({
    slug: "bible-study-workflow",
    eyebrow: "Bible Study",
    title: "Bible Study Workflow",
    description: "A repeatable Bible-study workflow for pastors, leaders, and believers: prayer, observation, context, interpretation, application, and review.",
    readingTime: "8 min read",
    intro: "A Bible-study workflow is not a formula for controlling what God will say. It is a repeatable way to slow down, read carefully, ask better questions, and move from the meaning of the text toward faithful obedience.",
    foundationHeading: "Begin with the passage itself",
    foundation: [
      "Read the passage more than once. Notice repeated words, people, commands, questions, movement, promises, warnings, and contrasts. Record what you observe before rushing to applications or searching for a quotation that fits a point you already have in mind.",
      "Ask where the passage sits in the book and the broader biblical story. Context protects us from treating a verse as a slogan detached from its meaning.",
    ],
    practiceHeading: "Move from observation to faithful application",
    practice: [
      "After observing, ask what the passage meant in its setting, what truth it reveals, and how that truth calls God's people to respond today. Use trusted resources to test your understanding, not to avoid the work of reading.",
      "Write one clear sentence that captures the main truth, then ask what faithful obedience, repentance, comfort, worship, or hope should follow. Application should grow from the text rather than being attached at the end.",
    ],
    actions: [
      "Pray and read the passage in context.",
      "Write observations before consulting outside resources.",
      "Study historical, literary, and canonical context.",
      "State the main truth clearly and test the application against the text.",
    ],
    careHeading: "Study in community and humility",
    care: [
      "Scripture study is personal, but it is not private in the sense of being detached from the church. Let trusted leaders, sound doctrine, and the wider counsel of Scripture correct blind spots.",
      "When a passage is difficult, do not force a quick answer. Note the question, continue studying, and seek wise help. Humility is part of handling the Word faithfully.",
    ],
    faqs: [
      { question: "How long should Bible study take?", answer: "The time will vary by passage and purpose. A consistent rhythm of careful reading and reflection is more helpful than a fixed length of time." },
      { question: "What is the first step in Bible study?", answer: "Begin with prayerful reading of the passage in context. Observe what is actually there before moving to outside resources or personal application." },
    ],
  }),
  standard({
    slug: "christian-content-creation-with-ai",
    eyebrow: "Church Communications",
    title: "Christian Content Creation with AI",
    description: "How Christian communicators can use AI for drafts, repurposing, and planning while protecting truth, originality, people, and the witness of the church.",
    readingTime: "8 min read",
    intro: "AI can make it easier to adapt approved content into captions, emails, summaries, and planning documents. Christian content creation still requires truthfulness, creativity, permission, and a real human voice. Faster output is not automatically faithful communication.",
    foundationHeading: "Create from truth, not from a prompt alone",
    foundation: [
      "Start with material you know is true: an approved sermon summary, verified event details, your own teaching notes, or a factual ministry story you have permission to share. Give AI a narrow task such as shortening, reorganizing, or adapting that material for a channel.",
      "Do not ask a tool to invent testimony, statistics, event details, ministry outcomes, or personal stories. A made-up illustration may sound moving, but it damages trust when presented as real.",
    ],
    practiceHeading: "Use AI to repurpose reviewed work",
    practice: [
      "After a leader approves a sermon or announcement, use AI to create format variations: a concise email, a short caption, a video description, a discussion guide, or a website summary. Review every version for clarity, facts, tone, and whether it makes a real next step clear.",
      "Keep a library of approved prompts and templates. This gives volunteers a safer starting point and helps the church communicate consistently without treating generic output as a brand voice.",
    ],
    actions: [
      "Turn an approved sermon summary into three audience-appropriate captions.",
      "Create a website description from verified event information.",
      "Build a content calendar from confirmed teaching themes and dates.",
      "Write accessibility-friendly alt text from a factual image description.",
    ],
    careHeading: "Protect people, authorship, and permissions",
    care: [
      "Do not enter private stories, personal messages, or unlicensed content into a tool. Use photos, artwork, music, and quotations only where you have permission or a valid license. AI does not remove the need to respect creators and the people pictured.",
      "A final human editor should decide what represents the church. The goal is communication that is accurate, warm, and recognizably connected to real ministry—not a flood of interchangeable posts.",
    ],
    faqs: [
      { question: "Can Christians use AI to write social-media posts?", answer: "Yes, as a drafting and repurposing assistant. Start with approved, factual source material and have a person verify every post before it is published." },
      { question: "Should churches label AI-generated images?", answer: "Use good judgment and be transparent when an image could reasonably be mistaken for a real event, person, or ministry moment. Never use synthetic imagery to misrepresent real people or outcomes." },
    ],
  }),
  standard({
    slug: "ai-for-small-churches",
    eyebrow: "Small Church Leadership",
    title: "AI for Small Churches",
    description: "A simple, low-cost way for small churches to use AI for repeated communication and planning tasks without adding complexity or compromising care.",
    readingTime: "7 min read",
    intro: "Small churches often do not need a large AI strategy. They need a few reliable ways to reduce repetitive work while preserving the personal care that makes a smaller congregation strong. Begin with one task, one tool, and one person responsible for review.",
    foundationHeading: "Solve a real bottleneck",
    foundation: [
      "Identify the work that keeps falling behind: weekly announcements, event reminders, website updates, volunteer checklists, or turning a sermon into a short summary. Start there instead of collecting apps because larger organizations are using them.",
      "A free or low-cost general writing assistant can be enough for an early pilot. The cost of extra complexity is real when a small team has limited time to learn and maintain tools.",
    ],
    practiceHeading: "Make one process repeatable",
    practice: [
      "Choose a task with verified, public information. For example, create one approved event brief, then use AI to turn it into an email, a text reminder, and a web blurb. A leader verifies each piece before it is sent.",
      "Save the approved prompt and a sample result. Over time, a small library of templates can help volunteers communicate well without starting from a blank page.",
    ],
    actions: [
      "Repurpose confirmed announcements across channels.",
      "Create a volunteer checklist for a recurring event.",
      "Turn meeting notes into a simple action list.",
      "Draft a monthly website-maintenance reminder.",
    ],
    careHeading: "Do not automate the personal work",
    care: [
      "Small churches often have close relationships that deserve direct, personal care. Do not use AI to imitate a pastor in a sensitive message or to handle prayer requests, counseling, discipline, or private decisions.",
      "Keep account ownership with the church, not a personal volunteer account. Review access, costs, and data practices before the tool becomes part of a weekly rhythm.",
    ],
    faqs: [
      { question: "What is the first AI tool a small church should try?", answer: "Start with one general writing assistant for a public, repetitive task such as rewriting approved announcements. Test it with human review before adding more tools." },
      { question: "Does a small church need a paid AI plan?", answer: "Not necessarily. Start with a small, defined use and compare the time saved against the full cost and privacy needs before paying for additional features." },
    ],
  }),
  standard({
    slug: "ai-ministry-ideas",
    eyebrow: "Ministry Innovation",
    title: "AI Ministry Ideas",
    description: "Responsible, practical AI ministry ideas for communication, planning, accessibility, and volunteer support—without automating pastoral care or spiritual responsibility.",
    readingTime: "7 min read",
    intro: "The best AI ministry ideas are not flashy. They remove unnecessary friction from public communication and team organization so people can give more attention to prayer, relationships, teaching, and service.",
    foundationHeading: "Look for assistance around the edges of ministry",
    foundation: [
      "AI is most useful when it supports a task rather than impersonating a person. It can help prepare a checklist, turn approved notes into a clearer announcement, create a discussion guide from a finished sermon, or make public information more accessible.",
      "Begin with needs that are easy to review and do not involve confidential data. The church should always be able to explain how a tool is used and who remains responsible for the result.",
    ],
    practiceHeading: "Try ideas that increase clarity",
    practice: [
      "Choose one ministry area and run a short trial. Ask whether the idea improved clarity, saved genuine time, and left people better served. If it did not, discontinue it rather than adding technology for its own sake.",
      "Document what works so volunteers do not have to rediscover the same process. Approved templates are more useful than unstructured experimentation.",
    ],
    actions: [
      "Create accessible alt text for verified public images.",
      "Adapt approved sermons into discussion questions and short summaries.",
      "Build event-planning timelines and volunteer checklists from confirmed details.",
      "Translate or simplify public visitor information with a bilingual or accessibility reviewer checking the result.",
    ],
    careHeading: "Keep ministry human and accountable",
    care: [
      "Do not use AI for pastoral counseling, spiritual direction, prayer requests, disciplinary situations, or decisions about a person's needs. Technology should free up people to care more personally, not make care feel automated.",
      "Review provider settings and never put private data into a general tool. A good idea is only good if it also protects the people entrusted to the church.",
    ],
    faqs: [
      { question: "Can AI help with discipleship?", answer: "It can help format approved teaching into questions, reading plans, or leader resources. Discipleship itself remains relational, prayerful, and accountable within the life of the church." },
      { question: "Can AI answer prayer requests?", answer: "No. Prayer requests and pastoral care should be handled by trusted people in the church, not by a general AI tool." },
    ],
  }),
  standard({
    slug: "church-social-media-strategy",
    eyebrow: "Church Communications",
    title: "Church Social Media Strategy",
    description: "A sustainable church social-media strategy focused on clear invitations, approved content, consistency, hospitality, and meaningful next steps.",
    readingTime: "8 min read",
    intro: "A good church social-media strategy helps people take a meaningful next step. It does not require posting every day or chasing every trend. Start with a clear audience, a realistic rhythm, and content that reflects real church life.",
    foundationHeading: "Decide what each channel is for",
    foundation: [
      "Social channels can help a first-time guest find service information, help an attendee remember an event, or help a member share a sermon. Choose one or two purposes for each channel instead of posting without a destination.",
      "Every post should point somewhere useful: a service time, an event page, a sermon, a simple question, or an invitation to connect. Make sure the destination is current and easy to use on a phone.",
    ],
    practiceHeading: "Build a repeatable weekly rhythm",
    practice: [
      "Plan around the life you already have: a weekly invitation, a sermon or teaching highlight, a current event reminder, and occasional stories of real ministry where you have permission to share. Batch content from approved source material so each post is accurate.",
      "A small calendar and a clear approval process help more than a complicated content system. Use AI only to adapt already-approved material into formats that a person checks before posting.",
    ],
    actions: [
      "Weekly: service invitation with time, place, and a clear visitor link.",
      "After teaching: an approved sermon summary with a link to the original message.",
      "Before events: timely reminders with verified logistics and registration details.",
      "Monthly: review profile information, links, comments process, and what content helped people take a next step.",
    ],
    careHeading: "Protect people and represent church life honestly",
    care: [
      "Get permission for photos where appropriate, be especially careful with children, and do not publish private stories or prayer requests. Avoid synthetic or edited images that suggest a real event or ministry moment that did not happen.",
      "Respond to public questions with warmth, but move sensitive matters to an appropriate private and human channel. Social media is a front door, not a replacement for pastoral care.",
    ],
    faqs: [
      { question: "How often should a church post on social media?", answer: "Choose a rhythm your team can sustain with accurate, useful content. Consistency and clarity are more valuable than frequent posting with no clear purpose." },
      { question: "What should churches post?", answer: "Service invitations, verified event details, sermon links and summaries, approved ministry stories, and practical next steps are a strong starting point." },
    ],
  }),
  {
    slug: "ai-prompt-library-for-churches",
    eyebrow: "Church Operations",
    title: "AI Prompt Library for Churches",
    description: "Twenty-five copy-ready prompts for church teams: guest communication, volunteer coordination, public content, operations, and safe review.",
    readingTime: "10 min read",
    publishedAt,
    intro: "This prompt library is for public, low-risk church work. Every prompt should use verified information and every response should be reviewed by a person before publication. Keep confidential ministry details out of general AI tools.",
    sections: [
      { heading: "Before your team starts", paragraphs: ["Give every user the same boundaries: never paste private data, never let a tool make pastoral decisions, and never publish an output without checking it. Prompts work best when they name a narrow task and supply approved facts."], bullets: ["Use a church-controlled account where possible.", "Keep a shared library of prompts that have been reviewed.", "Assign a person to check public-facing output."] },
      ...churchPromptGroups.map((group) => ({ heading: group.heading, paragraphs: ["Replace bracketed material with verified, non-confidential information and review the response before using it."], bullets: group.prompts })),
    ],
    faqs: [
      { question: "Can volunteers use this prompt library?", answer: "Yes, if they understand the church's privacy and review rules. Start with public, repeatable tasks and give volunteers approved source information." },
      { question: "What should be excluded from a church prompt?", answer: "Exclude counseling details, prayer requests, member and giving records, children's data, passwords, internal discipline matters, and any other confidential information." },
    ],
  },
  standard({
    slug: "building-a-digital-ministry",
    eyebrow: "Digital Ministry",
    title: "Building a Digital Ministry",
    description: "A practical framework for building a digital ministry that supports real discipleship, clear communication, accessible content, and in-person church life.",
    readingTime: "8 min read",
    intro: "Digital ministry is not a separate church running beside the real one. It is a set of tools and habits that can help people discover, understand, and stay connected to the ministry God is doing through a local body.",
    foundationHeading: "Begin with people and a clear next step",
    foundation: [
      "Ask who you are trying to serve: a first-time guest, a member who missed a service, a parent, a new believer, or someone exploring faith. Then define the next step you want to make clear: visit, watch, ask a question, join, serve, or receive care.",
      "Technology should make that path easier, not create more layers. A simple, current website and a dependable communication rhythm may serve better than a complex platform with no team to maintain it.",
    ],
    practiceHeading: "Build a small, connected foundation",
    practice: [
      "Start with your owned channels: a website, a church-controlled email list, a sermon or teaching archive, and clear contact paths. Use social channels to invite people into those spaces rather than relying on an algorithm as your only connection point.",
      "Create a workflow for publishing: who verifies details, who uploads a sermon, who responds to inquiries, and how quickly outdated content is removed. Clear ownership is part of hospitality.",
    ],
    actions: [
      "Keep service information and Plan Your Visit details current.",
      "Publish sermons with searchable titles, descriptions, and original links.",
      "Use email and text only with appropriate consent and a clear unsubscribe path.",
      "Review accessibility, privacy, account ownership, and mobile usability regularly.",
    ],
    careHeading: "Do not confuse reach with discipleship",
    care: [
      "Views and followers can be useful signals, but they are not the same as care, conversion, formation, or belonging. Build digital paths that invite people into prayer, Scripture, community, and accountable relationships.",
      "Protect privacy, especially when children, prayer needs, or personal stories are involved. Digital ministry should extend the church's integrity into every online space.",
    ],
    faqs: [
      { question: "What is the first step in building digital ministry?", answer: "Start with accurate visitor information and one clear next step. A current, mobile-friendly website is often the foundation for everything else." },
      { question: "Does digital ministry replace gathering in person?", answer: "No. Digital tools can support discovery, communication, and ongoing connection, but they should point people toward real worship, community, discipleship, and care." },
    ],
  }),
  standard({
    slug: "church-communication-tools",
    eyebrow: "Church Operations",
    title: "Church Communication Tools",
    description: "How to choose church communication tools for website updates, email, text, events, sermons, team coordination, and member care without creating tool overload.",
    readingTime: "8 min read",
    intro: "Church communication tools should reduce confusion, not create another place people have to check. The best set is usually small, connected, church-owned, and supported by a clear process for what gets communicated where.",
    foundationHeading: "Choose channels by purpose",
    foundation: [
      "A website is a public source of truth. Email is useful for longer, consent-based updates. Text works for timely reminders. Social media can extend invitations and share approved public content. Team tools may help staff and volunteers coordinate internal work.",
      "Name the purpose of each channel before adding a tool. If every announcement appears everywhere with no plan, people may receive duplicates while important details still get missed.",
    ],
    practiceHeading: "Build around a source of truth",
    practice: [
      "Create approved event and service information in one place first. Then adapt it for email, text, social, and print. This reduces contradictory dates, locations, and next steps.",
      "Test ownership before launch: who can update the tool, who has administrator access, how do you export data, and what happens if a volunteer leaves? Church-controlled accounts make transitions safer.",
    ],
    actions: [
      "Website: public visitor information, events, sermons, and contact paths.",
      "Email: consent-based updates with a clear unsubscribe method.",
      "Text: short, timely reminders for people who opted in.",
      "Team coordination: internal tasks and schedules without exposing confidential care information.",
    ],
    careHeading: "Respect attention, consent, and privacy",
    care: [
      "Do not use every channel for every message. Let people know what they are signing up for, send relevant information, and make it easy to opt out where appropriate.",
      "Before adopting a tool, review privacy, security, cost, data export, and access controls. A simple tool used faithfully is more valuable than several disconnected systems.",
    ],
    faqs: [
      { question: "What communication tool does every church need?", answer: "A current website is the basic public source of truth. The other tools should follow the needs of your congregation and the capacity of your team." },
      { question: "Should churches text members?", answer: "Text can be useful for timely opt-in reminders. Use it respectfully, clearly state what people will receive, and offer an appropriate way to stop messages." },
    ],
  }),
  standard({
    slug: "ai-ethics-for-christians",
    eyebrow: "Faith & Technology",
    title: "AI Ethics for Christians",
    description: "A Christian ethics framework for using AI with truthfulness, human dignity, stewardship, accountability, care for the vulnerable, and honest communication.",
    readingTime: "9 min read",
    intro: "Christian ethics for AI begins with more than whether a tool is useful. It asks whether our use honors the dignity of people, tells the truth, protects the vulnerable, stewards power responsibly, and keeps human beings accountable for the effects of their choices.",
    foundationHeading: "Human dignity is not optional",
    foundation: [
      "People are not data points, content sources, or problems to optimize away. Any use of AI that exposes private information, imitates a person deceptively, or removes human responsibility from a high-stakes decision deserves careful scrutiny.",
      "This is especially important in churches, where people may share grief, sin, health concerns, family needs, finances, or prayer requests. The desire for efficiency must never override the duty to care.",
    ],
    practiceHeading: "Ask ethical questions before each use",
    practice: [
      "Before adopting a tool or publishing an output, ask: Is this true? Who could be helped or harmed? What information is leaving our care? Who reviews this? Could a reasonable person be misled? Is there a better human option?",
      "The answers may lead to a limited use, a stronger safeguard, or a decision not to use the tool at all. Wisdom is not adopting every technology; it is making responsible choices under God.",
    ],
    actions: [
      "Verify factual claims and citations rather than trusting confident output.",
      "Protect private and sensitive information from general AI services.",
      "Avoid deceptive synthetic images, voices, testimonials, or impersonation.",
      "Keep human accountability in decisions that affect people, livelihoods, care, or spiritual leadership.",
    ],
    careHeading: "Make ethics a shared practice",
    care: [
      "A written AI policy can turn convictions into daily choices. Explain what uses are allowed, what data is prohibited, what requires approval, and how staff or volunteers can raise concerns.",
      "Review the policy as tools and ministry needs change. Ethical use is not a badge a church earns once; it is ongoing faithfulness in ordinary decisions.",
    ],
    faqs: [
      { question: "What makes AI use unethical for a Christian?", answer: "Uses that involve deception, falsehood, exploitation, privacy violations, unaccountable harm, or treating people as less than image-bearers conflict with core Christian commitments." },
      { question: "Is it wrong to use AI at church?", answer: "Not necessarily. The question is whether a specific use is truthful, accountable, protective of people, and genuinely serves the church's mission." },
    ],
  }),
  standard({
    slug: "what-the-bible-says-about-technology",
    eyebrow: "Faith & Technology",
    title: "What the Bible Says About Technology",
    description: "A biblical framework for thinking about technology through creation, stewardship, truth, wisdom, community, and the unchanging worth of people.",
    readingTime: "8 min read",
    intro: "The Bible does not name smartphones, social media, or artificial intelligence, but it gives Christians enduring wisdom for every tool we make and use. Technology can extend human creativity and responsibility; it can also magnify distraction, injustice, pride, and deception.",
    foundationHeading: "Technology is a tool within creation",
    foundation: [
      "Human beings are called to cultivate and steward the world God made. Building tools is part of that calling, but no tool is morally neutral once it is placed in the hands of people with desires, power, and responsibility.",
      "The question is not only ‘Can we make this?’ but also ‘What does this make easier, what does it make harder, and who bears the cost?’ Biblical wisdom asks both questions together.",
    ],
    practiceHeading: "Use technology with truth and self-control",
    practice: [
      "Scripture calls God's people to truthfulness, wisdom, love of neighbor, and self-control. Those commitments shape whether we share unverified information, how we use another person's image or work, and whether a device is serving our responsibilities or ruling our attention.",
      "Build practices that keep tools in their proper place: verify before sharing, limit needless distraction, use secure systems for private information, and make time for embodied worship, conversation, rest, and service.",
    ],
    actions: [
      "Ask who is helped, who may be harmed, and who remains accountable.",
      "Verify before sharing words, images, quotations, or claims.",
      "Use technology to strengthen clarity and care rather than replace relationships.",
      "Set limits that protect worship, family, rest, and attention.",
    ],
    careHeading: "Do not let tools define what people are for",
    care: [
      "Technology can tempt us to measure people by productivity, visibility, or data. The gospel calls us to see people as neighbors and image-bearers, not as an audience to capture or a problem to optimize.",
      "A faithful approach to technology will be neither naïve nor fearful. It will be watchful, grateful for what is good, honest about what is harmful, and ready to choose a slower path when love requires it.",
    ],
    faqs: [
      { question: "Does the Bible forbid modern technology?", answer: "No. The Bible gives principles for wise and faithful use rather than a list of modern devices. Christians should apply those principles to the tools available in their time." },
      { question: "How should Christians decide whether to use a new technology?", answer: "Ask whether it is truthful, responsible, protective of people, compatible with your calling, and genuinely helpful. Seek wise counsel when the decision has significant consequences." },
    ],
  }),
  standard({
    slug: "future-of-ai-in-ministry",
    eyebrow: "Ministry Innovation",
    title: "The Future of AI in Ministry",
    description: "A grounded look at how AI may affect ministry work, communication, accessibility, and administration—plus the convictions churches should keep before the future arrives.",
    readingTime: "8 min read",
    intro: "AI will likely continue to change the way churches draft content, organize information, make media accessible, and manage repetitive work. The future of ministry, however, will still depend on prayer, Scripture, truth, embodied worship, pastoral care, and accountable relationships.",
    foundationHeading: "Expect change without surrendering the center",
    foundation: [
      "New tools may make it easier to translate public information, create first drafts, caption media, summarize public recordings, and support routine administration. Churches should pay attention to what is becoming possible without assuming every possible use is wise.",
      "The things a church must not outsource are not likely to change: loving people, handling Scripture faithfully, caring for the vulnerable, making accountable decisions, and gathering as the body of Christ.",
    ],
    practiceHeading: "Prepare with principles, not predictions",
    practice: [
      "Instead of trying to predict every new product, create a small evaluation process. Test one low-risk use, identify the people affected, review data handling, require human approval, and stop when a use does not serve the mission.",
      "Train leaders and volunteers to recognize common failures: confident false information, privacy leakage, synthetic media that misleads, and automation that makes people feel unseen.",
    ],
    actions: [
      "Write a short church AI policy before adoption expands.",
      "Pilot low-risk communication or organization tasks with human review.",
      "Invest in digital literacy, privacy awareness, and clear account ownership.",
      "Evaluate success by clarity, care, accessibility, and faithfulness—not novelty.",
    ],
    careHeading: "Keep the future accountable to the church's calling",
    care: [
      "The question is not whether a church can appear technologically current. It is whether a tool helps people encounter truthful teaching, clear communication, faithful care, and genuine community.",
      "Move slowly enough to remain responsible. A future-proof ministry is one that knows what it will never hand over to a machine.",
    ],
    faqs: [
      { question: "Will AI replace ministry leaders?", answer: "AI can assist with certain tasks, but it cannot replace the spiritual, relational, accountable work of leading and shepherding people." },
      { question: "What should churches do now about AI?", answer: "Start with a clear policy, one low-risk pilot, human review, and strong privacy boundaries. Learn from the results before expanding." },
    ],
  }),
  standard({
    slug: "upci-general-conference-2026-first-time-guide",
    eyebrow: "General Conference 2026",
    title: "UPCI General Conference 2026: First-Time Attendee Guide",
    description: "An independent planning guide for first-time attendees of UPCI General Conference 2026 in Salt Lake City, with official links for registration, schedule, hotels, and updates.",
    readingTime: "8 min read",
    intro: "UPCI General Conference 2026 is scheduled for September 29–October 2 at the Salt Palace Convention Center in Salt Lake City. This is an independent APN attendee guide—not an official event page—designed to help a first-time guest prepare, then point you to the official UPCI pages for the details that can change.",
    foundationHeading: "Know the essential details before you travel",
    foundation: [
      "The official conference site lists the Salt Palace Convention Center at 100 S W Temple St, Salt Lake City, Utah, as the venue. It says registration is free but required for entry into all services, and it recommends pre-registration to make entry faster. Confirm your registration, hotel, travel, and current schedule directly with UPCI before making plans.",
      "This is a multi-day gathering with worship services, seminars, exhibits, ministry-focused events, and a business meeting. You do not need to try to attend everything; choose the gatherings that best serve your spiritual, family, and ministry responsibilities.",
    ],
    practiceHeading: "Build a simple first-time plan",
    practice: [
      "Start by registering, reserving a room, and saving the official schedule. Then choose one or two services or seminar blocks that matter most to you. Leave room for meals, travel time, exhibit hall visits, and unexpected changes.",
      "If you are traveling with a church group, agree on a communication plan before you arrive. Share your hotel, emergency contacts, meeting places, and which official updates everyone should follow.",
    ],
    actions: [
      "Register every person attending before you travel, including children.",
      "Use the official schedule as your source of truth; it is marked tentative and subject to change.",
      "Choose comfortable walking shoes, a charged phone, and a way to carry your confirmation details.",
      "Plan one clear way to reconnect with your group if phones or schedules change.",
    ],
    careHeading: "Let the conference serve your local church",
    care: [
      "A conference can be encouraging, but the value grows when you bring the learning home. Take a few notes, identify one idea to discuss with your pastor or team, and avoid trying to turn every moment into content for social media.",
      "Honor the people around you. Ask before photographing others, keep sensitive conversations private, and make space for worship, prayer, and the ordinary kindness that makes a first-time attendee feel welcome.",
    ],
    faqs: [
      { question: "Where is UPCI General Conference 2026?", answer: "The official UPCI General Conference site lists the Salt Palace Convention Center in Salt Lake City, Utah, for September 29–October 2, 2026. Confirm current details on the official site before travel." },
      { question: "Is this an official UPCI conference page?", answer: "No. This is an independent APN planning guide. Use UPCI's official conference site for registration, hotel information, the live schedule, and event questions." },
    ],
    referencesHeading: "Official conference information",
    references: [
      { label: "UPCI General Conference 2026 home", href: "https://www.upcigc.net/" },
      { label: "Official conference FAQ", href: "https://www.upcigc.net/faq/" },
      { label: "Official schedule", href: "https://www.upcigc.net/schedule/" },
    ],
  }),
  standard({
    slug: "upci-general-conference-2026-schedule-planner",
    eyebrow: "General Conference 2026",
    title: "UPCI General Conference 2026 Schedule: How to Plan Your Days",
    description: "A practical way to plan worship services, seminars, exhibits, meals, and group time around the official UPCI General Conference 2026 schedule.",
    readingTime: "7 min read",
    intro: "A multi-day conference feels much more manageable when you plan around a few priorities instead of reacting to every option. UPCI’s official schedule includes services, seminars, exhibits, and ministry gatherings across September 29–October 2; use the official schedule as the current source because times and details can change.",
    foundationHeading: "Treat the official schedule as the source of truth",
    foundation: [
      "The conference schedule is published by UPCI and is marked tentative and subject to change. It also specifies that times are listed in mountain daylight time. Save the official page, check it before you leave your hotel each day, and do not rely only on a screenshot shared days earlier.",
      "Rather than duplicating the full schedule, APN recommends using it to make a personal plan: identify your priority service, any seminar block that serves your role, and the practical time you need for meals, travel, and rest.",
    ],
    practiceHeading: "Plan each day around three anchors",
    practice: [
      "Choose a worship service, a learning opportunity, and a relationship or logistics window. That gives your day purpose without creating a schedule so tight that a delayed meal or a long walk turns into frustration.",
      "Groups should agree on where to meet after a service and how they will handle overlapping interests. It is fine for a family or team to attend different seminars if everyone knows the plan for reconnecting.",
    ],
    actions: [
      "Save the official schedule and note that times are mountain daylight time.",
      "Circle one priority gathering per day before adding optional activities.",
      "Leave transition time for the convention center, meals, exhibits, and group meetups.",
      "Check the official schedule again each morning and before a major session.",
    ],
    careHeading: "Do not confuse a full calendar with a meaningful week",
    care: [
      "You may not attend every session, visit every exhibit, or meet every person. Give your attention to the moments that genuinely serve your walk with God, your family, and your local church.",
      "At the end of each day, write down one takeaway and one action you can carry home. That small practice keeps the conference from becoming a blur of activity.",
    ],
    faqs: [
      { question: "What time zone is the UPCI General Conference schedule in?", answer: "The official 2026 schedule states that its times are listed in mountain daylight time. Verify the latest schedule before travel or each conference day." },
      { question: "Can I use this as the official conference schedule?", answer: "No. This is a planning guide. Always use the official UPCI schedule for current times, speakers, sessions, and changes." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 schedule", href: "https://www.upcigc.net/schedule/" }],
  }),
  standard({
    slug: "what-to-pack-for-upci-general-conference",
    eyebrow: "General Conference 2026",
    title: "What to Pack for UPCI General Conference in Salt Lake City",
    description: "A practical packing checklist for UPCI General Conference attendees: conference essentials, walking comfort, group logistics, family needs, and respectful preparation.",
    readingTime: "6 min read",
    intro: "A thoughtful packing list makes General Conference less stressful. Plan for long convention-center days, changing plans, worship services, and the needs of your family or church group. Check the official conference site and your hotel directly for any venue-specific rules before you leave.",
    foundationHeading: "Pack for long days, not just services",
    foundation: [
      "Conference days can include walking between your hotel, the convention center, services, seminars, exhibits, meals, and group meetups. Comfortable, appropriate shoes and a small, organized day bag will usually serve you better than trying to carry everything at once.",
      "Bring your registration confirmation, identification, hotel details, emergency contacts, and a way to keep your phone charged. Keep important travel information available offline in case connectivity is inconsistent.",
    ],
    practiceHeading: "Use a simple three-part checklist",
    practice: [
      "Separate your packing list into conference essentials, personal comfort, and group or family needs. This makes it easier to identify what belongs in a day bag, what stays at the hotel, and what needs to be shared with a spouse or group leader.",
      "Travel conditions, weather, venue policies, airline rules, and hotel amenities can change. Check official and local sources close to departure instead of relying on a generic packing list alone.",
    ],
    actions: [
      "Conference essentials: registration confirmation, ID, hotel address, group contacts, charger, and a note-taking method.",
      "Personal comfort: comfortable shoes, layered clothing, refillable water container if venue rules permit, and any needed medication.",
      "Family needs: snacks and activities as appropriate, supervision plan, and a reunion point if your group separates.",
      "Ministry follow-up: a notebook or digital file for sermon notes, exhibitor contacts, and next steps for home.",
    ],
    careHeading: "Prepare for people as well as logistics",
    care: [
      "Bring a posture of patience. Lines, crowded hallways, travel delays, and schedule changes are normal in a large gathering. A little margin in your bag and your calendar helps you remain gracious.",
      "Respect photography, recording, and venue guidelines. Do not assume a private conversation, child, or worship moment should become public content.",
    ],
    faqs: [
      { question: "What is the most important thing to bring to General Conference?", answer: "Bring your registration details, identification, hotel and group information, comfortable shoes, a charged phone, and a plan for keeping up with official updates." },
      { question: "Should I bring a printed schedule?", answer: "A printed backup can be helpful, but the official online schedule should remain your source of truth because it may change." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 FAQ", href: "https://www.upcigc.net/faq/" }, { label: "Official schedule", href: "https://www.upcigc.net/schedule/" }],
  }),
  standard({
    slug: "upci-general-conference-2026-family-guide",
    eyebrow: "General Conference 2026",
    title: "UPCI General Conference 2026 Family Guide",
    description: "A family planning guide for UPCI General Conference 2026: registration, supervision, realistic schedules, rest, meals, packing, and group communication.",
    readingTime: "7 min read",
    intro: "Families can have a meaningful General Conference experience when they plan for the practical realities ahead of time. UPCI’s official FAQ says registration is required regardless of age, children are welcome with adult supervision, and the conference does not provide childcare. Confirm current details directly with UPCI before traveling.",
    foundationHeading: "Make a family plan before you arrive",
    foundation: [
      "Decide which gatherings the family will attend together, when younger children may need a break, where you will eat, and how you will reconnect if you divide for a short time. A realistic plan makes it easier for adults to enjoy the conference without asking children to sustain an adult schedule all day.",
      "Register every attendee early, carry the information you need, and keep an adult responsible for supervision at all times. Share hotel room details and a meeting point with every adult in the group.",
    ],
    practiceHeading: "Plan for energy, not just attendance",
    practice: [
      "Choose fewer priority moments and build in meals, rest, and movement. A child who has had a chance to eat, walk, and rest will likely have a better experience than one rushed from session to session.",
      "Bring quiet, age-appropriate activities for waiting periods and a small bag with essentials you normally use as a family. Check venue policies before bringing outside items.",
    ],
    actions: [
      "Register each family member and save confirmations in more than one place.",
      "Name the supervising adult and a clear meetup point before entering the venue.",
      "Choose one or two priority gatherings each day and protect rest time.",
      "Carry family contacts, hotel details, and any needed medication or comfort items.",
    ],
    careHeading: "Give children a genuine place in the experience",
    care: [
      "Explain what the conference is and invite age-appropriate questions. Let children participate through worship, listening, note-taking, or simple observations rather than expecting them to absorb every adult session in the same way.",
      "Be considerate of other attendees and your own family. Taking a needed break is not a failure; it can be part of caring well for the people God has entrusted to you.",
    ],
    faqs: [
      { question: "Do children need registration for UPCI General Conference?", answer: "The official FAQ says registration is required regardless of age. Check the official site for the most current information before travel." },
      { question: "Does UPCI provide childcare during General Conference?", answer: "The official FAQ says the conference does not provide childcare, though children of all ages are welcome with adult supervision." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 FAQ", href: "https://www.upcigc.net/faq/" }],
  }),
  standard({
    slug: "where-to-stay-near-salt-palace-general-conference",
    eyebrow: "General Conference 2026",
    title: "Where to Stay Near the Salt Palace for General Conference",
    description: "How to choose a hotel for UPCI General Conference 2026 near Salt Palace: official hotel blocks, walking distance, group needs, accessibility, costs, and cancellation terms.",
    readingTime: "7 min read",
    intro: "The right General Conference hotel is the one that fits your budget, mobility needs, family or group plan, and ability to get to the Salt Palace reliably. UPCI says it offers discounted hotel rooms for the conference; use the official conference site for the current hotel-block details and booking links.",
    foundationHeading: "Start with the official room block",
    foundation: [
      "The official UPCI conference FAQ says a discounted hotel block is provided. Begin there before looking at third-party listings, because the official options are connected to the event and may have specific booking instructions or deadlines.",
      "Do not assume a hotel is ‘close’ based only on a map thumbnail. Check the walking route, arrival route, accessibility needs, daily parking or transit plan, room type, cancellation terms, and the full price after taxes and fees.",
    ],
    practiceHeading: "Choose by your group’s actual needs",
    practice: [
      "A solo attendee may prioritize a shorter walk. A family may need room layout, food options, and a realistic rest plan. A church group may need a place to meet and clear expectations about who is responsible for reservations and payments.",
      "Reserve only after you understand the terms. Save the confirmation number, hotel address, check-in information, and cancellation policy somewhere the traveler and group leader can reach.",
    ],
    actions: [
      "Check the official conference hotel block first.",
      "Compare total cost, not only the advertised nightly rate.",
      "Confirm walking distance or transportation time to the Salt Palace at the times you will travel.",
      "Save your confirmation, cancellation policy, and group contact information offline.",
    ],
    careHeading: "Be alert to scams and unofficial offers",
    care: [
      "Use the official conference website or a hotel’s verified website when booking. Be careful with unsolicited messages, social posts, or unfamiliar booking pages that claim to be connected to the event.",
      "If something is unclear, contact the official conference team or hotel directly instead of sending payment or personal details through an unverified channel.",
    ],
    faqs: [
      { question: "Does UPCI offer a General Conference hotel block?", answer: "The official FAQ says discounted hotel rooms are provided. Use the official conference home page and FAQ for current hotel information, availability, and booking instructions." },
      { question: "Should I book a hotel within walking distance?", answer: "That depends on your budget, mobility, family needs, and group plan. Compare the actual route and total cost before deciding." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 FAQ", href: "https://www.upcigc.net/faq/" }, { label: "UPCI General Conference 2026 home", href: "https://www.upcigc.net/" }],
  }),
  standard({
    slug: "getting-around-salt-lake-city-for-general-conference",
    eyebrow: "General Conference 2026",
    title: "Getting Around Salt Lake City for General Conference",
    description: "A practical arrival and transportation planning guide for UPCI General Conference 2026 attendees at the Salt Palace Convention Center in Salt Lake City.",
    readingTime: "7 min read",
    intro: "Transportation is easier when it is planned before the first service. UPCI General Conference 2026 is scheduled at the Salt Palace Convention Center in downtown Salt Lake City. Use the official conference FAQ and current local transportation sources to confirm parking, venue access, walking routes, and travel conditions close to your trip.",
    foundationHeading: "Plan the route from your actual starting point",
    foundation: [
      "Your best option depends on where you are staying, how many people are traveling together, mobility needs, luggage, and the time you will arrive. Decide whether you will walk, use a rideshare or taxi, use public transportation, or park—and have a backup if the first option changes.",
      "The official FAQ confirms parking is available at the Salt Palace and links to additional parking information. Check the current venue and local guidance rather than assuming prices, entrances, or availability from an older post.",
    ],
    practiceHeading: "Build margin into every trip",
    practice: [
      "Large services and convention activity can create lines and slower movement. Leave earlier than your map estimate, especially for a priority service, group meetup, or airport departure. Decide on an exact meeting location instead of saying only ‘at the entrance.’",
      "Keep your hotel address, venue address, group contacts, and confirmation details available without relying on a single phone battery or signal.",
    ],
    actions: [
      "Confirm your hotel-to-venue route before the first conference day.",
      "Check current venue parking information if you plan to drive.",
      "Choose a clear, recognizable group meetup point and time.",
      "Allow margin for walking, security, crowds, meals, and schedule changes.",
    ],
    careHeading: "Keep your group connected and safe",
    care: [
      "Share plans before people separate, particularly with families, teens, or larger church groups. A simple group text or printed contact card can prevent unnecessary stress when a session ends or a phone battery fails.",
      "Use normal travel wisdom: be aware of your surroundings, protect personal belongings, and choose official or well-established transportation options.",
    ],
    faqs: [
      { question: "Is parking available at the Salt Palace for General Conference?", answer: "The official UPCI General Conference FAQ says parking is available at the Salt Palace and links to more information. Confirm the latest venue guidance before driving." },
      { question: "How early should I arrive for a service?", answer: "Allow more time than a normal local service for walking, parking or transportation, crowds, and finding your group. Use the official schedule and venue guidance for the latest details." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 FAQ", href: "https://www.upcigc.net/faq/" }, { label: "Official schedule and venue address", href: "https://www.upcigc.net/schedule/" }],
  }),
  standard({
    slug: "upci-general-conference-2026-exhibits-guide",
    eyebrow: "General Conference 2026",
    title: "UPCI General Conference 2026 Exhibits: Visitor and Exhibitor Guide",
    description: "How attendees and exhibitors can prepare for the UPCI General Conference 2026 exhibit hall, with official links for exhibit applications and current event details.",
    readingTime: "7 min read",
    intro: "The exhibit hall can be one of the most practical parts of General Conference: a place to learn about ministries, resources, services, and connections across the Apostolic movement. Whether you are visiting or considering an exhibit space, use the official UPCI page for current rules, deadlines, registration, and requirements.",
    foundationHeading: "Visit the exhibit hall with a purpose",
    foundation: [
      "Before the conference, make a short list of the ministry areas you want to explore: missions, church resources, education, leadership tools, family ministry, or other needs. A short list helps you have meaningful conversations instead of collecting material you will never revisit.",
      "Bring a way to take notes and save contact information. If you are interested in a resource, ask what problem it solves, what it costs, how it handles data if applicable, and who in your local church should evaluate it with you.",
    ],
    practiceHeading: "Exhibitors should rely on official requirements",
    practice: [
      "The official exhibit page contains the event’s application process, exhibit-space information, and current requirements. Do not rely on a social-media screenshot or an unofficial resale offer for space, badges, power, or setup details.",
      "An effective booth communicates one clear value, welcomes a conversation, and gives visitors a simple next step. Prepare your team to answer questions accurately without promising more than your ministry or service can deliver.",
    ],
    actions: [
      "Attendees: identify a few categories or exhibitors you want to visit before arriving.",
      "Attendees: take notes on resources that could serve your local church after prayerful review.",
      "Exhibitors: use only the official UPCI exhibit application and instructions.",
      "Exhibitors: prepare clear contact, follow-up, and privacy practices before collecting visitor information.",
    ],
    careHeading: "Choose resources with discernment",
    care: [
      "A busy exhibit hall can make every resource look urgent. Give your church time to review theology, cost, data practices, licensing, and fit before making a purchasing or ministry decision.",
      "Respect exhibitors and other visitors by asking permission before recording or photographing a booth. Keep conversations honest and remember that a connection is more valuable than a stack of flyers.",
    ],
    faqs: [
      { question: "Where can I find official UPCI General Conference exhibit information?", answer: "Use the official UPCI General Conference exhibits page for current application, registration, space, and event details." },
      { question: "Should churches buy resources at the exhibit hall?", answer: "A church should evaluate any resource for fit, cost, terms, theology, and data practices before making a decision. Taking information home for review is often wise." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 exhibits", href: "https://www.upcigc.net/exhibits/" }, { label: "Official schedule", href: "https://www.upcigc.net/schedule/" }],
  }),
  standard({
    slug: "what-happens-at-upci-general-conference",
    eyebrow: "General Conference 2026",
    title: "What Happens at UPCI General Conference?",
    description: "An introduction to what attendees can expect from UPCI General Conference: worship services, seminars, exhibits, ministry gatherings, business sessions, and fellowship.",
    readingTime: "7 min read",
    intro: "UPCI General Conference brings together Apostolic people, churches, ministers, ministries, and guests for worship, teaching, business, exhibits, and fellowship. The exact schedule changes each year, but understanding the main kinds of gathering can help a first-time attendee arrive prepared instead of overwhelmed.",
    foundationHeading: "Expect more than evening services",
    foundation: [
      "The official 2026 schedule includes worship services, seminars, exhibits, ministry-focused gatherings, and a business meeting. Each part serves a different purpose: worship and preaching strengthen the whole body, seminars offer focused learning, exhibits connect people with resources, and business sessions serve the organization’s shared life.",
      "Not every attendee will participate in every kind of gathering in the same way. A first-time guest may focus on worship and a few seminars, while ministers, leaders, exhibitors, or organizational delegates may have additional responsibilities.",
    ],
    practiceHeading: "Choose the parts that serve your calling",
    practice: [
      "Read the official schedule before you arrive, then choose a manageable plan. If you are a parent, ministry leader, student, pastor, or exhibitor, think about which sessions most directly serve your present responsibilities.",
      "Make room for fellowship as well as formal sessions. Some of the most helpful conference moments are a conversation with another believer, a connection with a ministry, or a quiet reflection after a service.",
    ],
    actions: [
      "Review the official schedule and identify your priority gatherings.",
      "Learn whether any session has special expectations for attendees or leaders.",
      "Visit exhibits with questions related to real local-church needs.",
      "Take notes on one or two ideas you can discuss with your local pastor or team afterward.",
    ],
    careHeading: "Let conference inspiration become local faithfulness",
    care: [
      "A powerful moment at a large gathering is a gift, but the lasting work happens in local churches and ordinary obedience. Choose a few next steps rather than making a long list of resolutions that disappear after travel home.",
      "Attend with humility. Listen well, honor your leadership, and be careful not to turn a partial impression or social-media clip into a sweeping judgment about a person, ministry, or the conference as a whole.",
    ],
    faqs: [
      { question: "Do I have to be a UPCI minister to attend General Conference?", answer: "The official FAQ says everyone is welcome to attend. Use the official site for current registration and entry information." },
      { question: "What kinds of events are at UPCI General Conference?", answer: "The official schedule includes services, seminars, exhibits, ministry gatherings, and a business meeting. Check the current schedule for the exact program." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 schedule", href: "https://www.upcigc.net/schedule/" }, { label: "Official conference FAQ", href: "https://www.upcigc.net/faq/" }],
  }),
  standard({
    slug: "general-conference-2026-sermons-and-services",
    eyebrow: "General Conference 2026",
    title: "General Conference 2026 Sermons and Services: Where to Watch",
    description: "A pre-conference guide to finding official UPCI General Conference 2026 services and sermons, with a clear plan for APN’s post-conference curated resource collection.",
    readingTime: "5 min read",
    intro: "This APN page is a planning guide, not a promise of unofficial livestreams or copied recordings. UPCI has not published all post-conference recordings in advance. When official services and messages are available, APN will point readers to the original sources and curate a clearly labeled collection of helpful follow-up resources.",
    foundationHeading: "Follow official channels for live and original content",
    foundation: [
      "For current information about services, recordings, and any live viewing options, begin with the official UPCI General Conference site and UPCI’s official channels. Do not rely on reposted clips that remove context, attribution, or the speaker’s complete message.",
      "The official 2026 schedule identifies the main gatherings, but the schedule is tentative and subject to change. Bookmark it now, then check for official viewing and recording links during and after the event.",
    ],
    practiceHeading: "Use APN for curated follow-up, not imitation",
    practice: [
      "After the conference, APN can help people find messages and resources by topic: prayer, missions, church growth, family ministry, leadership, or youth. Every card should link to the original video, sermon page, podcast, or ministry source.",
      "A useful recap should include a clear title, speaker or ministry name, official source link, a short factual description, and a note that readers should watch or hear the full message in context.",
    ],
    actions: [
      "Bookmark the official conference schedule before the event.",
      "Follow official UPCI channels for announced livestream and recording information.",
      "Afterward, save original links rather than downloading or reposting full messages without permission.",
      "Use APN’s curated collection to discover messages by topic once it is published.",
    ],
    careHeading: "Keep context and attribution intact",
    care: [
      "A sermon excerpt can encourage someone, but it can also misrepresent a message when separated from its context. Link to the full official recording whenever possible and name the speaker and original ministry accurately.",
      "Respect copyright, platform rules, and the ministries that created the original work. APN’s role is curation: helping people discover content while sending attention and traffic back to its source.",
    ],
    faqs: [
      { question: "Will APN livestream UPCI General Conference 2026?", answer: "No livestream is promised by APN. Use official UPCI channels for current viewing information. APN will curate links to original official sources when available." },
      { question: "Where will I find General Conference sermons after the event?", answer: "Check the official UPCI conference channels first. APN plans to publish a curated guide that links readers back to the original messages and resources." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 home", href: "https://www.upcigc.net/" }, { label: "Official schedule", href: "https://www.upcigc.net/schedule/" }],
  }),
  standard({
    slug: "apn-general-conference-2026-message-guide",
    eyebrow: "General Conference 2026",
    title: "APN General Conference 2026 Message Guide",
    description: "How APN will curate General Conference 2026 sermons, sessions, podcasts, and resources after the event—always linking to original Apostolic sources.",
    readingTime: "5 min read",
    intro: "APN’s General Conference Message Guide is a post-conference collection in progress. Its purpose is simple: help people find the most useful official sermons, sessions, resources, and follow-up material without claiming ownership of work created by UPCI, speakers, churches, or ministries.",
    foundationHeading: "Curation is different from copying",
    foundation: [
      "APN will not present another ministry’s sermon as its own or repost complete content without permission. Each curated item should name its speaker or ministry, give a factual summary, and link directly to the original video, audio, article, or resource.",
      "That approach respects the people who created the work while making it easier for someone to find a message by need or topic after the conference has ended.",
    ],
    practiceHeading: "What the post-conference guide will include",
    practice: [
      "After official recordings and resources are available, APN will organize them into helpful paths such as worship and prayer, missions, pastoral leadership, church growth, family ministry, youth, and practical church communication.",
      "Every resource will be reviewed for a working original link, accurate title, attribution, and a description that helps a visitor decide whether to invest time in the full source.",
    ],
    actions: [
      "Browse original sermons and sessions by topic after the conference.",
      "Save APN resources that serve a real ministry need.",
      "Use every APN card to visit and support the original source.",
      "Suggest a missing official resource through APN’s content-submission process.",
    ],
    careHeading: "Quality matters more than speed",
    care: [
      "APN will not rush to label a message ‘best’ based on a clip, a popularity count, or an incomplete impression. Curation should be prayerful, accurate, and clear about what is a direct source versus an APN editorial description.",
      "If a recording is removed or an original link changes, APN should update or remove the listing. A trustworthy library is maintained, not merely published once.",
    ],
    faqs: [
      { question: "Is the APN Message Guide available now?", answer: "The structure is available before the conference; the curated sermon and resource collection will be added after official material is available for review and linking." },
      { question: "Can I suggest a General Conference message for APN?", answer: "Yes. Send APN the original public link and the relevant details. APN can review it for accurate attribution, fit, and a working source link." },
    ],
    referencesHeading: "Official conference information",
    references: [{ label: "UPCI General Conference 2026 home", href: "https://www.upcigc.net/" }, { label: "Official schedule", href: "https://www.upcigc.net/schedule/" }],
  }),
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}

export const generalConferenceGuides = guides.filter((guide) => guide.eyebrow === "General Conference 2026");
