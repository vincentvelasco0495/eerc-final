import styled from 'styled-components';

import { radii, space, colors } from './course-detail-tokens';
import { DEFAULT_COURSE_TAB_LABELS } from './course-detail-data';

const TabsRoot = styled.nav`
  margin: 0 0 ${space(2.5)};
  padding-inline: 2px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
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

  @media (max-width: 600px) {
    padding: 10px 14px;
    font-size: 13px;
  }

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

function normalizeTabOption(item) {
  if (item && typeof item === 'object') {
    return {
      key: String(item.key ?? ''),
      label: String(item.label ?? item.title ?? item.key ?? ''),
    };
  }
  const key = String(item ?? '');
  return { key, label: DEFAULT_COURSE_TAB_LABELS[key] ?? key };
}

/**
 * Accessible tabstrip for Quiz / Handouts / Lecture video / Group study panels.
 *
 * `activeKey`: one of `tabKeys`; `options` defaults to the canonical four tabs.
 */
export function CourseTabs({ activeKey, onChange, options }) {
  const items = (options ?? Object.keys(DEFAULT_COURSE_TAB_LABELS)).map(normalizeTabOption);

  return (
    <TabsRoot aria-label="Course sections">
      <TabsList role="tablist">
        {items.map((item) => (
          <TabBtn
            key={item.key}
            type="button"
            role="tab"
            aria-selected={activeKey === item.key}
            $active={activeKey === item.key}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </TabBtn>
        ))}
      </TabsList>
    </TabsRoot>
  );
}
