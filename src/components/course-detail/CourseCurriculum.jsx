import { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { goldAlpha, whiteAlpha } from 'src/theme';

import { useAuthContext } from 'src/auth/hooks';
import { normalizeUserRole } from 'src/auth/utils/role';

import { radii, space, colors } from './course-detail-tokens';

const MODULE_ICON = {
  document: { bg: 'rgb(34 197 94 / 0.16)', fg: '#22C55E' },
  video: { bg: 'rgb(255 193 7 / 0.16)', fg: '#FFC107' },
  quiz: { bg: 'rgb(255 193 7 / 0.16)', fg: '#FFC107' },
  assignment: { bg: 'rgb(45 212 191 / 0.16)', fg: '#2DD4BF' },
  stream: { bg: 'rgb(167 139 250 / 0.18)', fg: '#A78BFA' },
  live: { bg: 'rgb(167 139 250 / 0.18)', fg: '#A78BFA' },
  zoom: { bg: 'rgb(56 189 248 / 0.16)', fg: '#38BDF8' },
};

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(2)};
`;

const ModuleOuter = styled.section`
  overflow: hidden;
  border-radius: ${radii.card};
  border: 1px solid ${colors.border};
  background: ${colors.white};
`;

const ModuleToggle = styled.button.attrs({ type: 'button' })`
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${space(2)};
  margin: 0;
  padding: ${space(2)} ${space(2.75)};
  border: none;
  background: ${colors.white};
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  color: ${colors.text};
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }
`;

const ChevronCirc = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.muted};
  transition: transform 0.2s ease;

  ${(props) =>
    props.$open &&
    css`
      transform: rotate(180deg);
    `}
`;

const SmallChevron = styled.span`
  display: block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid currentColor;
  margin-top: 2px;
`;

const LessonList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid ${colors.border};
`;

const LessonItem = styled.li`
  margin: 0;
  padding: 0;
`;

const LessonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${space(2)};
  min-height: 52px;
  padding: 14px ${space(2.75)};
  background: ${colors.bg};
  border-bottom: 2px solid ${colors.white};
`;

const LessonRowOuter = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 52px;
  background: ${colors.bg};
  border-bottom: 2px solid ${colors.white};
`;

const LessonRowLink = styled(RouterLink)`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${space(2)};
  padding: 14px ${space(2.75)};
  padding-right: 10px;
  margin: 0;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: none;
  font: inherit;
  text-align: left;

  &:hover {
    background: ${goldAlpha(0.06)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }
`;

const LessonChevronCell = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  padding-right: 10px;
`;

const OrderNum = styled.span`
  flex-shrink: 0;
  width: 18px;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.muted};
  text-align: right;
`;

const IconShell = styled.span`
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: ${(props) => (props.$circle ? '50%' : '8px')};
  background: ${(props) => props.$bg};
  color: ${(props) => props.$fg};

  svg {
    display: block;
  }
`;

const LessonMid = styled.div`
  flex: 1;
  min-width: 0;
`;

const LessonTitleText = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.42;
  color: ${colors.text};
`;

const MetaText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.muted};
  text-align: right;
  white-space: nowrap;
`;

const DoneBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #22c55e;
  background: rgb(34 197 94 / 0.16);
  border: 1px solid rgb(34 197 94 / 0.4);
  border-radius: 999px;
  padding: 4px 8px;
  line-height: 1;
`;

const LockedBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #ffc107;
  background: rgb(255 193 7 / 0.16);
  border: 1px solid rgb(255 193 7 / 0.4);
  border-radius: 999px;
  padding: 4px 8px;
  line-height: 1;
`;

const RightMetaRail = styled.div`
  flex-shrink: 0;
  width: 168px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const DoneSlot = styled.div`
  min-width: 52px;
  display: flex;
  justify-content: flex-end;
`;

const RowChevronBtn = styled.button.attrs({ type: 'button' })`
  appearance: none;
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  margin-right: -2px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: ${colors.muted};
  cursor: pointer;

  &:hover {
    color: ${colors.text};
    background: ${whiteAlpha(0.08)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const RowChevronIcon = styled.span`
  font-size: 9px;
  line-height: 1;
  display: inline-block;
  transition: transform 0.18s ease;

  ${(props) =>
    props.$open &&
    css`
      transform: rotate(180deg);
    `}
`;

const GateNotice = styled.div`
  padding: ${space(3)};
  border: 1px dashed ${colors.border};
  border-radius: ${radii.card};
  color: ${colors.muted};
  font-size: 14px;
  line-height: 1.6;
  background: ${colors.white};
`;

const SubPeek = styled.div`
  padding: 12px ${space(2.75)} 14px calc(${space(2.75)} + 78px);
  margin-top: -2px;
  border-bottom: 2px solid ${colors.white};
  font-size: 13px;
  line-height: 1.55;
  color: ${colors.muted};
  background: ${colors.white};
`;

function lessonGlyphForType(type) {
  switch (type) {
    case 'document':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 21h10a3 3 0 003-3V8l-6-6H8a3 3 0 00-3 3v13a3 3 0 003 3z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M14 6v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case 'video':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      );
    case 'quiz':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
      );
    case 'assignment':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 2h6v2H9V2zM8 6h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'stream':
    case 'live':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 17c1.67-4 14.67-6 17-17M18 21c-.5-9.5 6-15 13-21M8 21c1-9 13-13 21-21"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'zoom':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
        </svg>
      );
    default:
      return null;
  }
}

function LessonTypeIcon({ type }) {
  const cfg = MODULE_ICON[type] ?? MODULE_ICON.document;

  const circle = ['video', 'quiz', 'stream', 'live', 'zoom'].includes(type);

  return (
    <IconShell $circle={circle} $bg={cfg.bg} $fg={cfg.fg} aria-hidden>
      {lessonGlyphForType(type)}
    </IconShell>
  );
}

/** Collapsible modules + typed lesson rows (Quiz / Handouts / Lecture video / Group study tabs). */
export function CourseCurriculum({
  modules = [],
  courseLookup,
  requiresEnrollment = false,
  canAccessLessons = true,
  emptyMessage = 'No items in this section yet.',
}) {
  const { authenticated, user } = useAuthContext();
  const isGuest = !authenticated;
  const role = normalizeUserRole(user?.role);
  const staffCurriculumBypass = role === 'admin';
  const listAllowed = staffCurriculumBypass || (Boolean(canAccessLessons) && role !== 'instructor');
  const enrollmentBlocked = authenticated && requiresEnrollment && !staffCurriculumBypass;

  const [moduleOpen, setModuleOpen] = useState(() => {
    const init = {};
    modules.forEach((m) => {
      init[m.id] = m.defaultOpen !== false;
    });
    return init;
  });

  const [lessonOpen, setLessonOpen] = useState(() => ({}));

  const toggleModule = useCallback((id) => {
    setModuleOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleLesson = useCallback((id) => {
    setLessonOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  if (!listAllowed) {
    return (
      <GateNotice role="status">
        Quiz, handouts, and group study are available to Pure online class. Blended learning can
        replay lecture videos only. Face to face enrollments cannot access these tabs.
      </GateNotice>
    );
  }

  if (!Array.isArray(modules) || modules.length === 0) {
    return <GateNotice role="status">{emptyMessage}</GateNotice>;
  }

  return (
    <Wrapper>
      {modules.map((module) => {
        const listOpen = !!moduleOpen[module.id];

        return (
          <ModuleOuter key={module.id}>
            <ModuleToggle onClick={() => toggleModule(module.id)} aria-expanded={listOpen}>
              {module.title}
              <ChevronCirc $open={listOpen}>
                <SmallChevron />
              </ChevronCirc>
            </ModuleToggle>

            {listOpen ? (
              <LessonList>
                {module.lessons.map((lesson, idx) => {
                  const expandable = !!lesson.expandable;
                  const isOpen = !!lessonOpen[lesson.id];
                  const lessonHref =
                    courseLookup && lesson.type === 'document'
                      ? paths.dashboard.courseTextLesson(courseLookup, lesson.id)
                      : courseLookup &&
                          (lesson.type === 'video' ||
                            lesson.type === 'stream' ||
                            lesson.type === 'zoom' ||
                            lesson.type === 'live')
                        ? paths.dashboard.courseVideoLesson(courseLookup, lesson.id)
                        : courseLookup && lesson.type === 'quiz'
                          ? paths.dashboard.courseQuiz(courseLookup, lesson.id)
                          : courseLookup && lesson.type === 'assignment'
                            ? paths.dashboard.courseAssignment(courseLookup, lesson.id)
                            : null;
                  const isLocked = Boolean(lesson.locked);
                  const isQuiz = lesson.type === 'quiz';
                  const allowsGuestPreview = Boolean(lesson.lessonPreview) && !isQuiz;
                  const canNavigate = isGuest
                    ? Boolean(lessonHref && allowsGuestPreview)
                    : Boolean(lessonHref && !isLocked && !enrollmentBlocked);
                  const effectiveHref = canNavigate ? lessonHref : null;
                  const guestPreviewBlocked = isGuest && lessonHref && !allowsGuestPreview;

                  return (
                    <LessonItem key={lesson.id}>
                      {effectiveHref ? (
                        <LessonRowOuter>
                          <LessonRowLink href={effectiveHref} aria-label={`Open lesson: ${lesson.title}`}>
                            <OrderNum>{lesson.order ?? idx + 1}</OrderNum>
                            <LessonTypeIcon type={lesson.type} />
                            <LessonMid>
                              <LessonTitleText>{lesson.title}</LessonTitleText>
                            </LessonMid>
                            <RightMetaRail>
                              <DoneSlot>
                                {lesson.completed ? <DoneBadge>Done</DoneBadge> : null}
                              </DoneSlot>
                              <MetaText>{lesson.meta}</MetaText>
                            </RightMetaRail>
                          </LessonRowLink>
                          <LessonChevronCell>
                            {expandable ? (
                              <RowChevronBtn
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleLesson(lesson.id);
                                }}
                                aria-expanded={isOpen}
                                aria-controls={`lesson-peek-${lesson.id}`}
                                id={`lesson-toggle-${lesson.id}`}
                              >
                                <SrOnly>Expand lesson preview</SrOnly>
                                <RowChevronIcon $open={isOpen} aria-hidden>
                                  ▼
                                </RowChevronIcon>
                              </RowChevronBtn>
                            ) : (
                              <span style={{ width: 28 }} aria-hidden />
                            )}
                          </LessonChevronCell>
                        </LessonRowOuter>
                      ) : (lessonHref && (isLocked || enrollmentBlocked)) || guestPreviewBlocked ? (
                        <LessonRowOuter
                          title={
                            enrollmentBlocked
                              ? 'Lessons are available only after your enrollment is approved'
                              : guestPreviewBlocked
                                ? 'Sign in or enable lesson preview to open this lesson'
                                : 'Complete previous lessons to unlock'
                          }
                        >
                          <LessonRow style={{ flex: 1, cursor: 'not-allowed', opacity: 0.72 }}>
                            <OrderNum>{lesson.order ?? idx + 1}</OrderNum>
                            <LessonTypeIcon type={lesson.type} />
                            <LessonMid>
                              <LessonTitleText>{lesson.title}</LessonTitleText>
                            </LessonMid>
                            <RightMetaRail>
                              <DoneSlot>
                                {guestPreviewBlocked ? null : (
                                  <LockedBadge>{enrollmentBlocked ? 'Unavailable' : 'Locked'}</LockedBadge>
                                )}
                              </DoneSlot>
                              <MetaText>{lesson.meta}</MetaText>
                            </RightMetaRail>
                          </LessonRow>
                          <LessonChevronCell>
                            {expandable ? (
                              <RowChevronBtn
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleLesson(lesson.id);
                                }}
                                aria-expanded={isOpen}
                                aria-controls={`lesson-peek-${lesson.id}`}
                                id={`lesson-toggle-${lesson.id}`}
                              >
                                <SrOnly>Expand lesson preview</SrOnly>
                                <RowChevronIcon $open={isOpen} aria-hidden>
                                  ▼
                                </RowChevronIcon>
                              </RowChevronBtn>
                            ) : (
                              <span style={{ width: 28 }} aria-hidden />
                            )}
                          </LessonChevronCell>
                        </LessonRowOuter>
                      ) : (
                        <LessonRow>
                          <OrderNum>{lesson.order ?? idx + 1}</OrderNum>
                          <LessonTypeIcon type={lesson.type} />
                          <LessonMid>
                            <LessonTitleText>{lesson.title}</LessonTitleText>
                          </LessonMid>
                          <RightMetaRail>
                            <DoneSlot>
                              {lesson.completed ? <DoneBadge>Done</DoneBadge> : null}
                            </DoneSlot>
                            <MetaText>{lesson.meta}</MetaText>
                          </RightMetaRail>

                          {expandable ? (
                            <RowChevronBtn
                              onClick={() => toggleLesson(lesson.id)}
                              aria-expanded={isOpen}
                              aria-controls={`lesson-peek-${lesson.id}`}
                              id={`lesson-toggle-${lesson.id}`}
                            >
                              <SrOnly>Expand lesson preview</SrOnly>
                              <RowChevronIcon $open={isOpen} aria-hidden>
                                ▼
                              </RowChevronIcon>
                            </RowChevronBtn>
                          ) : (
                            <span style={{ flexShrink: 0, width: 28 }} aria-hidden />
                          )}
                        </LessonRow>
                      )}

                      {expandable && isOpen ? (
                        <SubPeek id={`lesson-peek-${lesson.id}`} role="region" aria-labelledby={`lesson-toggle-${lesson.id}`}>
                          {lesson.peekBody ??
                            `Quick outline and resources for “${lesson.title}” — swap with CMS lesson body when wired.`}
                        </SubPeek>
                      ) : null}
                    </LessonItem>
                  );
                })}
              </LessonList>
            ) : null}
          </ModuleOuter>
        );
      })}
    </Wrapper>
  );
}
