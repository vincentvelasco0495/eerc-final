import styled from 'styled-components';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { goldAlpha, brandVars } from 'src/theme';

import { CourseFaq } from './CourseFaq';
import { CourseTabs } from './CourseTabs';
import { CourseNotice } from './CourseNotice';
import { tabKeys } from './course-detail-data';
import { CourseCurriculum } from './CourseCurriculum';
import { radii, space, colors, shadow } from './course-detail-tokens';

const HeroFigure = styled.figure`
  margin: 0 0 ${space(2)};
`;

const heroBannerFrameStyle = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: radii.card,
  overflow: 'hidden',
  bgcolor: brandVars.sunken,
  boxShadow: shadow.card,
};

const HeroImg = styled.img`
  display: block;
  width: 100%;
  border-radius: ${radii.card};
  aspect-ratio: 16 / 9;
  object-fit: cover;
  box-shadow: ${shadow.card};
  background: ${colors.bg};
`;

const ProseStack = styled.div`
  font-size: 14px;
  line-height: 1.65;
  color: ${colors.muted};
`;

const Para = styled.p`
  margin: 0 0 ${space(2)};
`;

const PlaceholderPane = styled.div`
  padding: ${space(3)};
  border: 1px dashed ${colors.border};
  border-radius: ${radii.card};
  color: ${colors.muted};
  font-size: 14px;
  line-height: 1.6;
`;

const TAB_LABEL_READABLE = {
  reviews: 'Reviews',
};

const ContentRoot = styled.div``;

const ProgramCoursesWrap = styled.section`
  margin: ${space(2)} 0 ${space(2.5)};
  padding: ${space(2)};
  border: 1px solid ${colors.border};
  border-radius: ${radii.card};
  background: ${colors.bg};
`;

const ProgramCoursesTitle = styled.h3`
  margin: 0 0 ${space(1.25)};
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text};
`;

const ProgramCoursesList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
`;

const ProgramCourseItem = styled.li``;

const ProgramCourseLink = styled.a`
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.text};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    border-color: ${goldAlpha(0.45)};
    background: ${brandVars.hover};
  }
`;

/** Hero + tabs + panels (sits in right column beneath full-width course header). */
export function CourseContent({
  data,
  heroImageUrl,
  noticeContent,
  curriculumModules,
  faqItems,
  courseLookup,
  requiresEnrollment = false,
  canAccessLessons = true,
  programCourses,
  programCoursesHeading,
}) {
  const [tabKey, setTabKey] = useState('description');

  const tabOptions = useMemo(() => [...tabKeys], []);
  useEffect(() => {
    const applyHashTab = () => {
      const raw = String(window.location.hash || '').replace(/^#/, '').trim().toLowerCase();
      if (raw === 'curriculum') {
        setTabKey('curriculum');
      } else if (raw === 'description') {
        setTabKey('description');
      } else if (raw === 'faq') {
        setTabKey('faq');
      } else if (raw === 'notice') {
        setTabKey('notice');
      } else if (raw === 'reviews') {
        setTabKey('reviews');
      }
    };
    applyHashTab();
    window.addEventListener('hashchange', applyHashTab);
    return () => window.removeEventListener('hashchange', applyHashTab);
  }, []);

  const { paragraphs } = data;

  const [bannerLoadFailed, setBannerLoadFailed] = useState(false);

  useEffect(() => {
    setBannerLoadFailed(false);
  }, [heroImageUrl]);

  const handleBannerError = useCallback(() => {
    setBannerLoadFailed(true);
  }, []);

  const showBannerImage = Boolean(heroImageUrl) && !bannerLoadFailed;

  return (
    <ContentRoot>
      <HeroFigure role="presentation">
        {showBannerImage ? (
          <HeroImg src={heroImageUrl} alt="" onError={handleBannerError} />
        ) : (
          <Box sx={heroBannerFrameStyle}>
            <Skeleton
              variant="rectangular"
              animation="wave"
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                width: 1,
                height: 1,
                transform: 'none',
              }}
            />
          </Box>
        )}
      </HeroFigure>

      {Array.isArray(programCourses) && programCourses.length > 0 ? (
        <ProgramCoursesWrap>
          <ProgramCoursesTitle>{programCoursesHeading || 'Courses in this program'}</ProgramCoursesTitle>
          <ProgramCoursesList>
            {programCourses.map((row) => (
              <ProgramCourseItem key={row.id}>
                <ProgramCourseLink href={row.href}>{row.title}</ProgramCourseLink>
              </ProgramCourseItem>
            ))}
          </ProgramCoursesList>
        </ProgramCoursesWrap>
      ) : null}

      <CourseTabs activeKey={tabKey} onChange={setTabKey} options={tabOptions} />

      {tabKey === 'description' ? (
        <ProseStack>
          {paragraphs.map((text, index) => (
            <Para key={String(index)}>{text}</Para>
          ))}
        </ProseStack>
      ) : null}

      {tabKey === 'curriculum' ? (
        <CourseCurriculum
          modules={curriculumModules}
          courseLookup={courseLookup}
          requiresEnrollment={requiresEnrollment}
          canAccessLessons={canAccessLessons}
        />
      ) : null}

      {tabKey === 'faq' ? <CourseFaq items={faqItems} /> : null}

      {tabKey === 'notice' && noticeContent ? (
        <CourseNotice heading={noticeContent.heading} items={noticeContent.items} />
      ) : null}

      {tabKey === 'reviews' ? (
        <PlaceholderPane role="region" aria-labelledby="placeholder-title">
          <strong id="placeholder-title" style={{ color: colors.text }}>
            {TAB_LABEL_READABLE.reviews}
          </strong>
          {' — '}
          This reference page uses static copy for this tab until content is wired.
        </PlaceholderPane>
      ) : null}
    </ContentRoot>
  );
}
