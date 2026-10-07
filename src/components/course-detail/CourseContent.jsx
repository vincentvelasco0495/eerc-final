import styled from 'styled-components';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { goldAlpha, brandVars } from 'src/theme';

import { CourseTabs } from './CourseTabs';
import { CourseCurriculum } from './CourseCurriculum';
import { radii, space, colors, shadow } from './course-detail-tokens';
import {
  tabKeys,
  tabEmptyMessages,
  resolveCourseDetailTabKey,
  filterCurriculumModulesForTab,
} from './course-detail-data';

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
  heroImageUrl,
  curriculumModules,
  courseLookup,
  requiresEnrollment = false,
  canAccessLessons = true,
  allowedTabKeys,
  programCourses,
  programCoursesHeading,
}) {
  const tabOptions = useMemo(() => {
    if (!Array.isArray(allowedTabKeys)) {
      return [...tabKeys];
    }
    return allowedTabKeys.filter((key) => tabKeys.includes(key));
  }, [allowedTabKeys]);
  const defaultTab = tabOptions[0] ?? 'quiz';
  const [tabKey, setTabKey] = useState(defaultTab);
  const filteredModules = useMemo(
    () => filterCurriculumModulesForTab(curriculumModules, tabKey),
    [curriculumModules, tabKey]
  );

  const selectTab = useCallback((key) => {
    setTabKey(key);
    const nextHash = `#${key}`;
    if (typeof window === 'undefined') {
      return;
    }
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }, []);

  useEffect(() => {
    const applyHashTab = () => {
      const resolved = resolveCourseDetailTabKey(window.location.hash);
      if (resolved && tabOptions.includes(resolved)) {
        setTabKey(resolved);
        return;
      }
      if (tabOptions.length > 0) {
        selectTab(tabOptions[0]);
      }
    };
    applyHashTab();
    window.addEventListener('hashchange', applyHashTab);
    return () => window.removeEventListener('hashchange', applyHashTab);
  }, [selectTab, tabOptions]);

  useEffect(() => {
    if (tabOptions.length > 0 && !tabOptions.includes(tabKey)) {
      selectTab(tabOptions[0]);
    }
  }, [selectTab, tabKey, tabOptions]);

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

      {canAccessLessons && tabOptions.length > 0 ? (
        <CourseTabs activeKey={tabKey} onChange={selectTab} options={tabOptions} />
      ) : null}

      <CourseCurriculum
        key={canAccessLessons ? tabKey : 'locked'}
        modules={canAccessLessons && tabOptions.includes(tabKey) ? filteredModules : []}
        courseLookup={courseLookup}
        requiresEnrollment={requiresEnrollment}
        canAccessLessons={canAccessLessons}
        emptyMessage={tabEmptyMessages[tabKey] ?? 'No items in this section yet.'}
      />
    </ContentRoot>
  );
}
