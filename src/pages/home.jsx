import { HomeV2View } from 'src/sections/home-v2';

// ----------------------------------------------------------------------

const metadata = {
  title: 'EERC LMS | Professional Learning Platform',
  description:
    'Professional LMS landing page for EERC with guided learning paths, courses, quizzes, analytics, and leaderboard-driven progress.',
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />

      <HomeV2View />
    </>
  );
}
