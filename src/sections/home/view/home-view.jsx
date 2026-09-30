import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { varFade, MotionViewport } from 'src/components/animate';
import { BackToTopButton } from 'src/components/animate/back-to-top-button';

import { styles } from './home-view.styles';
import {
  FaqSection,
  HeroSection,
  QuizzesSection,
  AdvancedSection,
  DeliverySection,
  LearningSection,
  ExperienceSection,
  TestimonialsSection,
  CourseManagementSection,
  PlatformOverviewSection,
} from './sections';

const sectionReveal = varFade('inUp', {
  distance: 40,
  transitionIn: { duration: 1.05 },
});

export function HomeView() {
  return (
    <Box sx={styles.root}>
      <BackToTopButton />
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <HeroSection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <PlatformOverviewSection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <DeliverySection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <LearningSection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <QuizzesSection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <CourseManagementSection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <ExperienceSection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <AdvancedSection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <TestimonialsSection />
        </Box>
      </MotionViewport>
      <MotionViewport viewport={{ amount: 0.15 }}>
        <Box component={m.div} variants={sectionReveal}>
          <FaqSection />
        </Box>
      </MotionViewport>
    </Box>
  );
}

export default HomeView;
