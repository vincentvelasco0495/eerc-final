import { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';

import { brandVars } from 'src/theme';

import { radii, space, colors } from './course-detail-tokens';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FaqItem = styled.article`
  border-radius: ${radii.card};
  border: 1px solid ${colors.border};
  overflow: hidden;

  ${(props) =>
    props.$expanded
      ? css`
          background: ${brandVars.elevated};
        `
      : css`
          background: ${colors.bg};
        `}
`;

const Toggle = styled.button`
  appearance: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${space(2)};
  width: 100%;
  padding: ${space(2)} ${space(2)} ${space(2)} ${space(2.25)};
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }
`;

const QuestionText = styled.span`
  flex: 1;
  padding-top: 2px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  ${(props) =>
    props.$expanded
      ? css`
          color: ${colors.accentText};
        `
      : css`
          color: ${colors.text};
        `}
`;

const ChevCirc = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.muted};
  font-size: 9px;
  line-height: 1;
  transition: transform 0.18s ease;

  ${(props) =>
    props.$expanded &&
    css`
      transform: rotate(180deg);
    `}
`;

const Answer = styled.div`
  padding: 0 ${space(2.25)} ${space(2.25)};
  padding-top: 0;

  & p {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: ${colors.muted};
  }
`;

/** FAQ accordion (expanded item lifts to elevated navy with a gold question; chevron in circle). */
export function CourseFaq({ items }) {
  const [expandedIds, setExpandedIds] = useState(() => {
    const ids = items.filter((i) => i.defaultExpanded).map((i) => i.id);
    return new Set(ids);
  });

  const toggle = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <List role="region" aria-label="Frequently asked questions">
      {items.map((item) => {
        const isOpen = expandedIds.has(item.id);

        return (
          <FaqItem key={item.id} $expanded={isOpen}>
            <Toggle
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              id={`faq-trigger-${item.id}`}
              onClick={() => toggle(item.id)}
            >
              <QuestionText $expanded={isOpen}>{item.question}</QuestionText>
              <ChevCirc $expanded={isOpen} aria-hidden>
                ▼
              </ChevCirc>
            </Toggle>
            {isOpen ? (
              <Answer id={`faq-panel-${item.id}`} role="region" aria-labelledby={`faq-trigger-${item.id}`}>
                <p>{item.answer}</p>
              </Answer>
            ) : null}
          </FaqItem>
        );
      })}
    </List>
  );
}
