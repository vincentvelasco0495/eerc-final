import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, useSearchParams } from 'react-router';

import { paths } from 'src/routes/paths';

import { navyAlpha, brandVars } from 'src/theme';

import { useAuthContext } from 'src/auth/hooks';
import { normalizeUserRole } from 'src/auth/utils/role';

import { space, colors } from './course-detail-tokens';
import { CourseDetailBackArrowSvg } from './course-detail-back-arrow';

const Outer = styled.header`
  width: 100%;
  margin-bottom: ${space(4)};
`;

const HeaderTopNav = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${space(2)};
  margin-bottom: ${space(2)};
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 8px;
  color: ${colors.headingNavy};
  background: transparent;
  cursor: pointer;

  &:hover {
    background: ${brandVars.hoverWash};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const BadgeChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${brandVars.onAccent};
  background: ${colors.primary};
  box-shadow: 0 1px 2px ${navyAlpha(0.45)};
`;

const Title = styled.h1`
  margin: 0 0 ${space(2)};
  font-size: clamp(1.75rem, 3.25vw, 2.125rem);
  font-weight: 700;
  line-height: 1.22;
  color: ${colors.headingNavy};
  letter-spacing: -0.02em;
`;

const DescRow = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: ${colors.muted};
`;

const DescToggle = styled.button`
  display: inline;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: inherit;
  line-height: inherit;
  font-weight: 600;
  color: ${colors.accentText};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const DESCRIPTION_PREVIEW = 148;

/** Course marketing header — back control, title, and description preview. */
export function CourseHeader({ data }) {
  const [expanded, setExpanded] = useState(false);
  const { badge, title, shortDescription } = data;
  const { authenticated, user } = useAuthContext();
  const [searchParams] = useSearchParams();

  const needsToggle = shortDescription.length > DESCRIPTION_PREVIEW;
  const collapsedText = needsToggle
    ? `${shortDescription.slice(0, DESCRIPTION_PREVIEW).trimEnd()}…`
    : shortDescription;

  const navigate = useNavigate();
  const location = useLocation();

  const resolveProgramSlug = () => {
    const byData = typeof data?.programSlug === 'string' ? data.programSlug.trim() : '';
    const byQuery = String(searchParams.get('program') ?? '').trim();
    return byData || byQuery;
  };

  const handleBack = () => {
    const programSlug = resolveProgramSlug();
    if (programSlug) {
      navigate(`${paths.programCourseDetail}?program=${encodeURIComponent(programSlug)}`, {
        replace: true,
      });
      return;
    }

    const returnTo = location.state?.from;
    if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
      navigate(returnTo);
      return;
    }

    if (!authenticated) {
      navigate(paths.programCourseDetail, { replace: true });
      return;
    }

    const role = normalizeUserRole(user?.role);
    if (role === 'admin') {
      navigate(paths.dashboard.home);
      return;
    }
    if (role === 'instructor') {
      navigate(paths.dashboard.instructorHome);
      return;
    }
    navigate(paths.dashboard.availablePrograms);
  };

  return (
    <Outer>
      <HeaderTopNav>
        <BackButton type="button" aria-label="Go back" onClick={handleBack}>
          <CourseDetailBackArrowSvg />
        </BackButton>
        {badge ? <BadgeChip>{badge}</BadgeChip> : null}
      </HeaderTopNav>

      <Title>{title}</Title>

      <DescRow>
        {expanded ? shortDescription : collapsedText}
        {needsToggle ? (
          <>
            {' '}
            <DescToggle type="button" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Show less' : 'Show more'}
            </DescToggle>
          </>
        ) : null}
      </DescRow>
    </Outer>
  );
}
