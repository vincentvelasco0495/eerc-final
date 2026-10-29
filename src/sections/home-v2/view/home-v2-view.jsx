import { useSearchParams } from 'react-router';

import Box from '@mui/material/Box';

import { useHomepageContent } from 'src/features/homepage-v2/hooks/use-homepage-content';

import { BackToTopButton } from 'src/components/animate/back-to-top-button';
import { pageContentStyles } from 'src/components/layout/lms-page-shell.styles';

import { useAuthContext } from 'src/auth/hooks';

import { sectionStyles } from '../styles/section-styles';
import { HomeV2Skeleton } from '../components/HomeV2Skeleton';
import { HomepageV2ContentProvider } from '../context/homepage-v2-content-context';
import {
  HowItWorks,
  HeroSection,
  FeatureCards,
  SuccessStories,
  FeaturedCarousel,
  StatisticsBanner,
  InstructorSection,
  SampleLectureSection,
} from '../sections';

const HOMEPAGE_SECTION_VIEWS = {
  hero: HeroSection,
  feature_cards: FeatureCards,
  instructors: InstructorSection,
  sample_lecture: SampleLectureSection,
  stats: StatisticsBanner,
  success_stories: SuccessStories,
  how_it_works: HowItWorks,
  featured_content: FeaturedCarousel,
};

export function HomeV2View() {
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const preview = searchParams.get('preview') === '1' && Boolean(user);
  const { data, isLoading } = useHomepageContent({ preview });
  const sections = data?.sections ?? {};

  if (isLoading && !data?.sections) {
    return <HomeV2Skeleton />;
  }

  return (
    <HomepageV2ContentProvider sections={sections}>
      <Box sx={[sectionStyles.pageRoot, pageContentStyles.homeContainers]}>
        <BackToTopButton />
        {Object.keys(sections)
          .filter((key) => HOMEPAGE_SECTION_VIEWS[key])
          .map((key) => {
            const Section = HOMEPAGE_SECTION_VIEWS[key];
            return <Section key={key} />;
          })}
      </Box>
    </HomepageV2ContentProvider>
  );
}

export default HomeV2View;
