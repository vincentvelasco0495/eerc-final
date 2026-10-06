import styled from 'styled-components';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { goldAlpha, navyAlpha, brandVars, whiteAlpha } from 'src/theme';

import { SidebarCard } from './SidebarCard';
import { CourseHeader } from './CourseHeader';
import { CourseContent } from './CourseContent';
import { CourseDetailsCard } from './CourseDetailsCard';
import { space, radii, colors } from './course-detail-tokens';

const PageBg = styled.div`
  min-height: ${(props) => (props.$fillViewport ? '100vh' : 'auto')};
  background: ${brandVars.page};
  font-family:
    'Public Sans',
    system-ui,
    -apple-system,
    sans-serif;
`;

const PageInner = styled.div`
  max-width: 1224px;
  margin: 0 auto;
  padding: ${space(3)} ${space(3)} ${space(6)};

  @media (max-width: 900px) {
    padding: ${space(2)};
  }
`;

const PageMain = styled.main`
  width: 100%;
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 316px minmax(0, 1fr);
  gap: 28px;
  align-items: start;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: ${space(3)};
  }
`;

const AsideColumn = styled.aside`
  position: sticky;
  top: ${space(2)};
  display: flex;
  flex-direction: column;
  gap: ${space(2.5)};

  @media (max-width: 900px) {
    position: relative;
    top: auto;
    order: 2;
  }
`;

const MainColumn = styled.section`
  min-width: 0;

  @media (max-width: 900px) {
    order: 1;
  }
`;

/** Pale pill strip — progress row + Details (reference: light panel + filled Details CTA). */
const StatusPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${space(2)};
  width: 100%;
  padding: 10px 14px;
  margin-bottom: ${space(2)};
  box-sizing: border-box;
  border-radius: ${radii.pill};
  background: ${brandVars.elevated};
  border: 1px solid ${colors.border};
  box-shadow: inset 0 1px 0 ${whiteAlpha(0.08)};
`;

const CompletionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const CheckBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: ${colors.accentText};
  background: ${colors.white};
  border: 1px solid ${goldAlpha(0.35)};
  box-shadow: 0 1px 2px ${navyAlpha(0.45)};
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
`;

const CompletionTitles = styled.div`
  strong {
    display: block;
    font-size: 15px;
    font-weight: 700;
    color: ${colors.text};
  }
  span {
    font-size: 13px;
    color: ${colors.muted};
  }
`;

const DetailsBtn = styled.button`
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: ${colors.primary};
  color: ${brandVars.onAccent};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 2px ${navyAlpha(0.5)};
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const ContinueBtn = styled.a`
  display: block;
  width: 100%;
  padding: 15px ${space(2)};
  margin-top: 0;
  margin-bottom: ${space(1.5)};
  border-radius: 10px;
  border: none;
  text-align: center;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: ${brandVars.onAccent};
  background: ${colors.primary};
  cursor: pointer;
  transition:
    filter 0.15s ease,
    transform 0.15s ease;

  &:hover {
    filter: brightness(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

/**
 * Two-column learner course-detail shell styled like `/course-detail`, driven entirely by props.
 */
export function CourseDetailLayout({
  /** Full `{@link CourseHeader}` + `{@link CourseContent}` marketing payload */
  data,
  heroImageUrl,
  completion,
  detailRows,
  curriculumModules,
  /** LMS course slug or `public_id` — links lesson rows to the matching lesson page */
  courseLookup,
  /** Primary CTA (first/next module player) */
  continueHref,
  requiresEnrollment = false,
  canAccessLessons = true,
  allowedTabKeys,
  /** When set with `requiresEnrollment`, ENROLL opens this handler instead of navigating away. */
  onEnrollClick,
  /** Optional CTA below Course details rows — guests only (sign-in redirect). */
  detailsEnrollAction = null,
  /** When false, hides the top sidebar row (completion %, quiz avg, Details). LMS course detail uses false. */
  showSidebarProgressPill = true,
  wrapMinHeightPage = false,
}) {
  return (
    <PageBg $fillViewport={wrapMinHeightPage}>
      <PageInner>
        <PageMain>
          <CourseHeader data={data} />
          <TwoColGrid>
            <AsideColumn aria-label="Course summary sidebar">
              <SidebarCard $variant="completion">
                {showSidebarProgressPill ? (
                  <StatusPill>
                    <CompletionLeft>
                      <CheckBadge aria-hidden>✓</CheckBadge>
                      <CompletionTitles>
                        <strong>{completion.label}</strong>
                        <span>
                          Quiz avg:{' '}
                          {typeof completion.quizScorePercent === 'number'
                            ? `${completion.quizScorePercent}%`
                            : '—'}
                        </span>
                      </CompletionTitles>
                    </CompletionLeft>
                    <DetailsBtn type="button">Details</DetailsBtn>
                  </StatusPill>
                ) : null}
                {canAccessLessons ? (
                  <ContinueBtn href={continueHref ?? '#'}>CONTINUE</ContinueBtn>
                ) : requiresEnrollment && typeof onEnrollClick === 'function' ? (
                  <ContinueBtn as="button" type="button" onClick={onEnrollClick}>
                    ENROLL
                  </ContinueBtn>
                ) : null}
              </SidebarCard>

              <SidebarCard $variant="muted">
                <CourseDetailsCard rows={detailRows} heading="Course details" />
                {detailsEnrollAction?.onClick ? (
                  <Stack spacing={2} sx={{ mt: 3, pt: 0.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="medium"
                      onClick={detailsEnrollAction.onClick}
                    >
                      {detailsEnrollAction.label ?? 'Enroll now'}
                    </Button>
                  </Stack>
                ) : null}
              </SidebarCard>
            </AsideColumn>

            <MainColumn aria-label="Lesson content">
              <CourseContent
                heroImageUrl={heroImageUrl}
                curriculumModules={curriculumModules}
                courseLookup={courseLookup}
                requiresEnrollment={requiresEnrollment}
                canAccessLessons={canAccessLessons}
                allowedTabKeys={allowedTabKeys}
              />
            </MainColumn>
          </TwoColGrid>
        </PageMain>
      </PageInner>
    </PageBg>
  );
}
