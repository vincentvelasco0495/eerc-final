/** Static mock data for the course detail reference page (no API). */

export const courseDetailMock = {
  category: 'Environmental Sciences',
  badge: 'SPECIAL',
  title: 'Basics of MasterStudy',
  /** Stars use `value` (0–5). Score label + review line match reference layout next to stars. */
  rating: {
    value: 4,
    max: 5,
    scoreLabel: '4.7',
    reviewLine: '3 reviews',
    summary: '4.7 (3 reviews)',
  },
  shortDescription: `MasterStudy is the best choice for everyone! A huge amount of possibilities with preset courses, quizzes and teachers. Powerful yet simple and insanely featured — this WordPress LMS theme solves all problems with online education.`,
  heroImageUrl:
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80',

  completion: {
    label: 'Course complete',
    quizScorePercent: 94,
    primaryCta: 'CONTINUE',
  },

  details: [
    { key: 'duration', label: 'Duration', value: '3 hours', icon: 'clock' },
    { key: 'lectures', label: 'Lectures', value: '16', icon: 'book' },
    { key: 'video', label: 'Video', value: '1 hour', icon: 'play' },
    { key: 'assignments', label: 'Assignments', value: '1', icon: 'clipboard' },
    { key: 'quizzes', label: 'Quizzes', value: '10', icon: 'check' },
  ],

  paragraphs: [
    `UX-heavy pages fail when fundamentals slip: grids drift, typography loses contrast, and call-to-actions compete with primary learning tasks. Strong component thinking keeps surfaces calm so instructions, media, and navigation stay legible.`,
    `This sprint walks modular regions, responsive breakpoints, critique loops, and handoff checkpoints so instructional UI ships with fewer surprises.`,
  ],
};

/**
 * Curriculum tab — collapsible modules + typed lesson rows (static demo).
 *
 * lesson.type: document | video | quiz | stream
 */
export const curriculumModulesMock = [
  {
    id: 'module-start',
    title: 'Starting Course',
    defaultOpen: true,
    lessons: [
      {
        id: 'les-lk',
        order: 1,
        type: 'document',
        title: 'Layout is King',
        meta: '6 min',
        expandable: true,
      },
      {
        id: 'les-typo',
        order: 2,
        type: 'document',
        title: 'Typography',
        meta: '5 min',
        expandable: true,
      },
      {
        id: 'les-responsive',
        order: 3,
        type: 'document',
        title: 'Responsive Design',
        meta: '8 min',
        expandable: true,
      },
      {
        id: 'les-grids',
        order: 4,
        type: 'document',
        title: 'Grids and Spacing',
        meta: '7 min',
        expandable: true,
      },
      {
        id: 'les-media',
        order: 5,
        type: 'document',
        title: 'Media & Embeds',
        meta: '6 min',
        expandable: true,
      },
      {
        id: 'les-nav',
        order: 6,
        type: 'document',
        title: 'Navigation Patterns',
        meta: '9 min',
        expandable: true,
      },
      {
        id: 'les-quiz-intro',
        order: 7,
        type: 'quiz',
        title: 'After Intro Quiz',
        meta: '7 questions',
        expandable: false,
      },
      {
        id: 'les-stream',
        order: 8,
        type: 'stream',
        title: 'Stream lesson',
        meta: 'Stream lesson',
        expandable: false,
      },
      {
        id: 'les-video',
        order: 9,
        type: 'video',
        title: 'Video lesson',
        meta: '12 min',
        expandable: true,
      },
    ],
  },
  {
    id: 'module-after',
    title: 'After Intro',
    defaultOpen: true,
    lessons: [
      {
        id: 'les-tokens',
        order: 1,
        type: 'document',
        title: 'Design tokens deep dive',
        meta: '10 min',
        expandable: true,
      },
      {
        id: 'les-walk',
        order: 2,
        type: 'video',
        title: 'Walkthrough recordings',
        meta: '15 min',
        expandable: true,
      },
      {
        id: 'les-check',
        order: 3,
        type: 'quiz',
        title: 'Module check-in',
        meta: '5 questions',
        expandable: false,
      },
    ],
  },
];

/** Horizontal list in sidebar — badges per reference (HOT, SPECIAL, NEW). */
export const popularCoursesMock = [
  {
    id: '1',
    title: 'Web Coding and Apache Basics theory',
    badge: 'HOT',
    badgeTone: 'hot',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    priceLabel: 'Free',
    instructor: 'Demo Instructor',
    rating: 5,
  },
  {
    id: '2',
    title: 'Concept Art Printing on 3d Printer',
    imageUrl:
      'https://images.unsplash.com/photo-1631543918753-70913d8f897f?auto=format&fit=crop&w=400&q=80',
    priceLabel: 'Free',
    instructor: 'George Clinton',
    rating: 3,
  },
  {
    id: '3',
    title: 'Interior design concepts Masterclass',
    badge: 'NEW',
    badgeTone: 'new',
    imageUrl:
      'https://images.unsplash.com/photo-1517842645767-c167b782060d?auto=format&fit=crop&w=400&q=80',
    priceLabel: 'Free',
    instructor: 'Demo Instructor',
    rating: 4,
  },
];

/** Related strip — 3-column grid; mix of free and sale. */
export const relatedCoursesMock = [
  {
    id: 'r1',
    title: 'Design Systems in Practice',
    badge: 'SPECIAL',
    badgeTone: 'special',
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=85&w=600&auto=format&fit=crop',
    priceLabel: '$29.99',
    priceStrike: '$49.99',
    instructor: 'Demo Instructor',
    rating: 4.9,
  },
  {
    id: 'r2',
    title: 'Critique Workshops',
    badge: 'HOT',
    badgeTone: 'hot',
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=85&w=600&auto=format&fit=crop',
    priceLabel: 'Free',
    instructor: 'Demo Instructor',
    rating: 4.4,
  },
  {
    id: 'r3',
    title: 'Interface Prototyping',
    badge: 'HOT',
    badgeTone: 'hot',
    imageUrl:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=85&w=600&auto=format&fit=crop',
    priceLabel: 'Free',
    instructor: 'Demo Instructor',
    rating: 4.7,
  },
];

/** Notice tab — productivity list + related strip uses `noticeRelatedCoursesMock`. */
export const noticeContentMock = {
  heading: 'Productivity Hacks to Get More Done',
  items: [
    {
      id: 'notice-fb',
      titleBold: 'Facebook News Feed Eradicator',
      linkLabel: 'free chrome extension',
      href: '#',
      body: ' Stay focused by removing your Facebook newsfeed and replacing it with an inspirational quote. Disable the tool anytime you want to see what friends are up to!',
    },
    {
      id: 'notice-inbox',
      titleBold: 'Hide My Inbox',
      linkLabel: 'free chrome extension for Gmail',
      href: '#',
      body: " Stay focused by hiding your inbox. Click 'show your inbox' at a scheduled time and batch processs everything one go.",
    },
    {
      id: 'notice-habitica',
      titleBold: 'Habitica',
      linkLabel: 'free mobile + web app',
      href: '#',
      body: ' Gamify your to do list. Treat your life like a game and earn gold goins for getting stuff done!',
    },
  ],
};

/** Related courses row shown under Notice tab (badges / prices per reference). */
export const noticeRelatedCoursesMock = [
  {
    id: 'nr1',
    title: 'Design Systems in Practice',
    badge: 'SPECIAL',
    badgeTone: 'special',
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=85&w=600&auto=format&fit=crop',
    priceLabel: 'Free',
    instructor: 'Demo Instructor',
    rating: 4,
  },
  {
    id: 'nr2',
    title: 'Critique Workshops',
    badge: 'HOT',
    badgeTone: 'hot',
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=85&w=600&auto=format&fit=crop',
    priceLabel: 'Free',
    instructor: 'Demo Instructor',
    rating: 5,
  },
  {
    id: 'nr3',
    title: 'Interface Prototyping',
    badge: 'SPECIAL',
    badgeTone: 'special',
    imageUrl:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=85&w=600&auto=format&fit=crop',
    priceLabel: '$29.99',
    priceStrike: '$49.99',
    instructor: 'Demo Instructor',
    rating: 4,
  },
];

export const faqItemsMock = [
  {
    id: 'faq-lorem',
    question: 'What is Lorem Ipsum?',
    answer: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    defaultExpanded: true,
  },
  {
    id: 'faq-why',
    question: 'Why do we use it?',
    answer: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using meaningful content that would draw attention away from the structure of the page.`,
    defaultExpanded: false,
  },
];

export const tabKeys = ['description', 'curriculum', 'faq', 'notice', 'reviews'];
