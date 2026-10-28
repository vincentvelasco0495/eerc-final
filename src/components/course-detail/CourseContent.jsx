import styled from 'styled-components';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

import { goldAlpha, brandVars } from 'src/theme';
import { fetchCourseLibraryTabs } from 'src/redux/api/lmsApi';

import { Iconify } from 'src/components/iconify';

import { CourseTabs } from './CourseTabs';
import { CourseCurriculum } from './CourseCurriculum';
import { CourseLibraryPanel } from './CourseLibraryPanel';
import { CourseTabsManageDialog } from './CourseTabsManageDialog';
import { radii, space, colors, shadow } from './course-detail-tokens';
import {
  tabEmptyMessages,
  courseTabContentType,
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
  courseId,
  requiresEnrollment = false,
  canAccessLessons = true,
  allowedTabKeys,
  libraryTabs: libraryTabsProp,
  canManageLibrary = false,
  programCourses,
  programCoursesHeading,
}) {
  const [libraryTabs, setLibraryTabs] = useState(() =>
    Array.isArray(libraryTabsProp) ? libraryTabsProp : []
  );
  const [manageOpen, setManageOpen] = useState(false);

  useEffect(() => {
    setLibraryTabs(Array.isArray(libraryTabsProp) ? libraryTabsProp : []);
  }, [libraryTabsProp]);

  const refreshLibraryTabs = useCallback(async () => {
    if (!courseId) {
      return;
    }
    const payload = await fetchCourseLibraryTabs(courseId);
    setLibraryTabs(Array.isArray(payload?.data) ? payload.data : []);
  }, [courseId]);

  const visibleTabs = useMemo(() => {
    const tabs = Array.isArray(libraryTabs) ? libraryTabs : [];
    if (canManageLibrary || !Array.isArray(allowedTabKeys)) {
      return tabs;
    }
    return tabs.filter((tab) => allowedTabKeys.includes(tab.key));
  }, [allowedTabKeys, canManageLibrary, libraryTabs]);

  const tabOptions = useMemo(
    () => visibleTabs.map((tab) => ({ key: tab.key, label: tab.title || tab.key })),
    [visibleTabs]
  );
  const tabOptionKeys = useMemo(() => tabOptions.map((item) => item.key), [tabOptions]);
  const defaultTab = tabOptionKeys[0] ?? 'quiz';
  const [tabKey, setTabKey] = useState(defaultTab);
  const activeTab = visibleTabs.find((item) => item.key === tabKey) ?? null;
  const activeContentType = courseTabContentType(activeTab);
  const filteredModules = useMemo(
    () => filterCurriculumModulesForTab(curriculumModules, activeContentType ?? tabKey),
    [activeContentType, curriculumModules, tabKey]
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
      if (resolved && tabOptionKeys.includes(resolved)) {
        setTabKey(resolved);
        return;
      }
      if (tabOptionKeys.length > 0) {
        selectTab(tabOptionKeys[0]);
      }
    };
    applyHashTab();
    window.addEventListener('hashchange', applyHashTab);
    return () => window.removeEventListener('hashchange', applyHashTab);
  }, [selectTab, tabOptionKeys]);

  useEffect(() => {
    if (tabOptionKeys.length > 0 && !tabOptionKeys.includes(tabKey)) {
      selectTab(tabOptionKeys[0]);
    }
  }, [selectTab, tabKey, tabOptionKeys]);

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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
          sx={{ mb: 0 }}
        >
          <CourseTabs activeKey={tabKey} onChange={selectTab} options={tabOptions} />
          {canManageLibrary ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon="solar:settings-bold" />}
              onClick={() => setManageOpen(true)}
              sx={{ mb: 2.5 }}
            >
              Manage tabs
            </Button>
          ) : null}
        </Stack>
      ) : null}

      {activeContentType ? (
        <CourseCurriculum
          key={canAccessLessons ? tabKey : 'locked'}
          modules={canAccessLessons && tabOptionKeys.includes(tabKey) ? filteredModules : []}
          courseLookup={courseLookup}
          requiresEnrollment={requiresEnrollment}
          canAccessLessons={canAccessLessons}
          emptyMessage={tabEmptyMessages[activeContentType] ?? 'No items in this section yet.'}
        />
      ) : activeTab ? (
        <CourseLibraryPanel
          tab={activeTab}
          canManage={canManageLibrary}
          onChanged={refreshLibraryTabs}
        />
      ) : null}

      {canManageLibrary ? (
        <CourseTabsManageDialog
          open={manageOpen}
          onClose={() => setManageOpen(false)}
          courseId={courseId}
          tabs={libraryTabs}
          onChanged={refreshLibraryTabs}
        />
      ) : null}
    </ContentRoot>
  );
}
