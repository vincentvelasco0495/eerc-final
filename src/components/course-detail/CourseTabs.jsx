import styled from 'styled-components';

import { radii, space, colors } from './course-detail-tokens';

const TabsRoot = styled.nav`
  margin: 0 0 ${space(2.5)};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const TabsList = styled.div`
  display: inline-flex;
  gap: 0;
  border-bottom: 1px solid ${colors.border};
  min-width: min-content;
`;

const TabBtn = styled.button`
  appearance: none;
  position: relative;
  margin: 0;
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.$active ? colors.accentText : colors.muted)};
  white-space: nowrap;
  transition: color 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    border-radius: ${radii.pill};
    background: ${(props) => (props.$active ? colors.primary : 'transparent')};
    transition: background 0.15s ease;
  }

  &:hover {
    color: ${(props) => (props.$active ? colors.accentText : colors.text)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 4px;
  }
`;

const TAB_LABELS = {
  quiz: 'Quiz',
  handouts: 'Handouts',
  'lecture-video': 'Lecture video',
  'group-study': 'Group study',
};

/**
 * Accessible tabstrip for Quiz / Handouts / Lecture video / Group study panels.
 *
 * `activeKey`: one of `tabKeys`; `options` defaults to the canonical four tabs.
 */
export function CourseTabs({ activeKey, onChange, options }) {
  const keys = options ?? Object.keys(TAB_LABELS);

  return (
    <TabsRoot aria-label="Course sections">
      <TabsList role="tablist">
        {keys.map((key) => (
          <TabBtn
            key={key}
            type="button"
            role="tab"
            aria-selected={activeKey === key}
            $active={activeKey === key}
            onClick={() => onChange(key)}
          >
            {TAB_LABELS[key]}
          </TabBtn>
        ))}
      </TabsList>
    </TabsRoot>
  );
}
