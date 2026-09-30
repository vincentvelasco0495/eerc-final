export const FEATURE_ITEMS = [
  {
    title: 'Structured learning paths',
    description: 'Review, practice, refresher, and final coaching in one guided journey.',
    icon: 'solar:clipboard-check-bold-duotone',
  },
  {
    title: 'Instructor-managed programs',
    description: 'Run CE, Master Plumbing, and engineering tracks with reusable content blocks.',
    icon: 'solar:book-bookmark-bold-duotone',
  },
  {
    title: 'Assessments and analytics',
    description: 'Timed quizzes, attempt history, progress insights, and suggested next modules.',
    icon: 'solar:chart-square-bold-duotone',
  },
  {
    title: 'Enrollment and admin tools',
    description: 'Handle approvals, learner management, and module publishing from one dashboard.',
    icon: 'solar:shield-user-bold-duotone',
  },
];

export const VALUE_PILLARS = [
  {
    title: 'Training centers',
    description:
      'Implement complete learning workflows for engineering academies, review centers, and institutional cohorts.',
    color: '#ffd166',
  },
  {
    title: 'Individual instructors',
    description:
      'Deliver live-ready content, structured modules, and timed assessments for every learner group.',
    color: '#ef2f7a',
  },
  {
    title: 'Online platform teams',
    description:
      'Scale secure course delivery, learner insights, and reusable learning programs with one platform.',
    color: '#55c2ff',
  },
];

export const ENGINEERING_FEATURES = [
  'CE, Master Plumbing, and Materials Engineering tracks',
  'Hydraulics, fluid flow, and energy-loss module libraries',
  'Review -> Practice -> Refresher -> Final Coaching flow',
  'Secure streaming player with watermark and session warning',
  'Video, PDF, and eBook lesson resource tabs',
  'Timed mock board exams with randomized question sets',
  'Quiz history, retries, and attempt-by-attempt reporting',
  'Strength and weakness analytics by topic cluster',
  'Suggested remediation modules for weak engineering topics',
  'Leaderboard benchmarking for daily, weekly, and overall cohorts',
  'Enrollment approvals for review batches and program intakes',
  'Admin upload controls for videos, references, and visibility',
];

export const LMS_CARD_FEATURES = [
  {
    title: 'Hydraulics Review Tracks',
    description: 'Organize technical review content by subject, topic, and subtopic for board-exam preparation.',
    icon: 'solar:waterdrops-bold-duotone',
  },
  {
    title: 'Master Plumbing Modules',
    description: 'Deliver code-based lessons, system diagrams, and review drills in structured module sequences.',
    icon: 'solar:widget-5-bold-duotone',
  },
  {
    title: 'Engineering Video Lessons',
    description: 'Stream review lectures with UI-only session warnings, watermark overlays, and playback continuity.',
    icon: 'solar:videocamera-record-bold-duotone',
  },
  {
    title: 'Reference Material Viewer',
    description: 'Pair each lesson with PDF references, reviewer notes, and eBook study support inside the LMS.',
    icon: 'solar:document-text-bold-duotone',
  },
  {
    title: 'Timed Mock Examinations',
    description: 'Run quiz attempts with timing, randomized questions, and performance history for each learner.',
    icon: 'solar:stopwatch-bold-duotone',
  },
  {
    title: 'Progress Engineering Analytics',
    description: 'Measure completed lessons, weak competencies, and pending review paths across technical tracks.',
    icon: 'solar:chart-2-bold-duotone',
  },
  {
    title: 'Suggested Remediation',
    description: 'Recommend the next engineering module based on quiz gaps and incomplete learning milestones.',
    icon: 'solar:lightbulb-bolt-bold-duotone',
  },
  {
    title: 'Leaderboard Motivation',
    description: 'Rank learners across daily, weekly, and overall performance to encourage consistent study.',
    icon: 'solar:cup-star-bold-duotone',
  },
  {
    title: 'Enrollment and Admin Control',
    description: 'Manage review-batch intake, module publishing, approvals, and learner visibility from one panel.',
    icon: 'solar:shield-user-bold-duotone',
  },
];

export const LESSON_TYPE_ITEMS = [
  { title: 'VIDEO', icon: 'solar:play-circle-bold-duotone', color: '#ef2f7a' },
  { title: 'PDF', icon: 'solar:document-text-bold-duotone', color: '#69a7ff' },
  { title: 'E-BOOK', icon: 'solar:book-bookmark-bold-duotone', color: '#ffd166' },
];

export const PROFILE_MENU_ITEMS = [
  'Dashboard',
  'Announcements',
  'Gradebook',
  'Assignments',
  'Programs',
  'Add course',
];

export const QUIZ_TYPE_CARDS = [
  {
    title: 'Single Choice',
    accent: '#52d273',
    lines: [
      { width: '76%', color: '#e5f7ea' },
      { width: '88%', color: '#e5f7ea' },
      { width: '68%', color: '#f4f6fb' },
    ],
  },
  {
    title: 'Matching Type',
    accent: '#52d273',
    lines: [
      { width: '100%', color: '#f4f6fb' },
      { width: '92%', color: '#e5f7ea' },
      { width: '94%', color: '#f4f6fb' },
    ],
  },
  {
    title: 'True or False',
    accent: '#ef2f7a',
    pills: ['True', 'False', 'Agree', 'Reject'],
  },
  {
    title: 'Short Answer',
    accent: '#52d273',
    lines: [
      { width: '90%', color: '#e5f7ea' },
      { width: '72%', color: '#f4f6fb' },
    ],
  },
  {
    title: 'Multiple Choice',
    accent: '#52d273',
    lines: [
      { width: '82%', color: '#e5f7ea' },
      { width: '87%', color: '#e5f7ea' },
      { width: '76%', color: '#eef2ff' },
      { width: '92%', color: '#fde8f0' },
    ],
  },
  {
    title: 'Fill In The Gap',
    accent: '#69a7ff',
    paragraph: true,
  },
  {
    title: 'Image Matching',
    accent: '#ffd166',
    gallery: true,
  },
  {
    title: 'Image Choice',
    accent: '#ffd166',
    imageChoice: true,
  },
];

export const QUIZ_FEATURES = [
  'Create categorized question banks for engineering subjects',
  'Automatically randomize questions across quiz attempts',
  'Set up automated quiz scoring and result summaries',
  'Allow learners to retake quizzes with tracked history',
  'Attach media references such as diagrams and formula sheets',
  'Set timers for board-style review assessments',
];

export const LMS_ADDON_ITEMS = [
  {
    title: 'Certificate Builder',
    description:
      'Create completion certificates for engineering review tracks, mock exams, and technical training milestones.',
    preview: 'certificate',
  },
  {
    title: 'Email Template Manager',
    description:
      'Send branded notifications for enrollment approvals, module releases, quiz reminders, and engineering class updates.',
    preview: 'email',
  },
  {
    title: 'Content Drip',
    description:
      'Release engineering lessons in sequence so learners finish prerequisite topics before advanced board-review modules.',
    preview: 'content-drip',
  },
  {
    title: 'LMS Forms Editor',
    description:
      'Customize registration and intake forms for engineering programs, learner profiles, and review-batch applications.',
    preview: 'forms',
  },
  {
    title: 'Group Courses',
    description:
      'Organize company-sponsored trainings, university cohorts, and engineering review sections with group enrollment support.',
    preview: 'group-courses',
  },
  {
    title: 'The Gradebook',
    description:
      'Track quiz scores, attendance, completion rates, and technical performance across every engineering subject area.',
    preview: 'gradebook',
  },
  {
    title: 'Prerequisites',
    description:
      'Require learners to complete foundation engineering modules before unlocking higher-level review content.',
    preview: 'prerequisites',
  },
  {
    title: 'Assignments',
    description:
      'Assign design exercises, calculation worksheets, project uploads, and written technical responses inside the LMS.',
    preview: 'assignments',
  },
];

export const INTEGRATION_ITEMS = [
  { key: 'elementor', title: 'Elementor' },
  { key: 'wpbakery', title: 'WPBakery Page Builder' },
  { key: 'woocommerce', title: 'WooCommerce' },
  { key: 'zoom', title: 'Zoom' },
  { key: 'paidmemberships', title: 'Paid Memberships Pro' },
  { key: 'stripe', title: 'Stripe' },
  { key: 'paypal', title: 'PayPal' },
  { key: 'gamipress', title: 'GamiPress' },
  { key: 'presto', title: 'Presto Player' },
  { key: 'googleclassroom', title: 'Google Classroom' },
  { key: 'mailchimp', title: 'Mailchimp' },
  { key: 'wpml', title: 'WPML' },
  { key: 'contactform', title: 'Contact Form 7' },
  { key: 'h5p', title: 'H5P' },
  { key: 'buddypress', title: 'BuddyPress' },
];

export const TESTIMONIAL_ITEMS = [
  {
    quote:
      'EERC LMS helped us organize review programs, assignments, and learner tracking in one place. Our engineering batches now follow a much clearer study flow.',
    author: 'ALESSANDRO',
    color: '#ef2f7a',
  },
  {
    quote:
      'The lesson structure and quiz workflow made it easier for our instructors to deliver technical topics online. It feels polished and practical for review sessions.',
    author: 'MARTHY',
    color: '#74d4f2',
  },
  {
    quote:
      'We especially value the module organization, timed quizzes, and analytics. MasterStudy-style sections adapted well to our engineering review setup.',
    author: 'KARLLO',
    color: '#6e83ff',
  },
  {
    quote:
      'From announcements to learner discussions, the platform gives our students a more professional and consistent online review experience.',
    author: 'SCOTTY',
    color: '#7ed957',
  },
];

export const LMS_FAQ_ITEMS = [
  {
    label: 'WHAT IS ONLINE EDUCATION?',
    content:
      'Online education delivers learning through digital platforms where lessons, recorded lectures, live sessions, quizzes, references, and assignments are accessible in one place. For engineering review programs, this means learners can study technical topics, attend guided discussions, complete assessments, and revisit materials anytime they need reinforcement.',
  },
  {
    label: 'WEBSITE AS A MEANS OF GAINING KNOWLEDGE',
    content:
      'A structured LMS website gives students one central place for modules, handouts, replayable video lessons, mock-board quizzes, and progress tracking. Instead of jumping between disconnected tools, learners can build knowledge through a guided online workflow.',
  },
  {
    label: 'WHAT IS LEARNING MANAGEMENT WORDPRESS THEME?',
    content:
      'An LMS WordPress theme is a website framework built for online education. It provides the layout, course structure, lesson pages, learner dashboards, and teaching tools needed to run digital training programs more efficiently.',
  },
  {
    label: 'WHAT DOES LMS THEMES PROVIDE?',
    content:
      'LMS themes usually provide course catalogs, lesson pages, quizzes, assignments, student communication tools, enrollment workflows, and payment-ready integrations. In a professional setup, they help institutions organize learning in a polished and scalable way.',
  },
  {
    label: 'WHO CAN USE EDUCATION WP THEMES?',
    content:
      'Education themes can be used by review centers, instructors, schools, training teams, and organizations that need to deliver structured online learning. They are especially useful when content, learner progress, and communication need to be managed inside one platform.',
  },
];
