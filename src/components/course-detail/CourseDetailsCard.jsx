import styled from 'styled-components';

import { space, colors } from './course-detail-tokens';

const Title = styled.h2`
  margin: 0 0 ${space(2)};
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${space(2)};
  padding: 10px 0;
  border-bottom: 1px solid ${colors.border};
  font-size: 14px;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${colors.muted};
`;

const IconBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const ValueText = styled.span`
  font-weight: 700;
  color: ${colors.text};
`;

/** Tiny inline SVGs — no external icon pack. */
function RowIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };

  switch (name) {
    case 'clock':
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={colors.muted} strokeWidth="1.5" />
          <path d="M12 7v6l4 2" stroke={colors.muted} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'book':
      return (
        <svg {...common} aria-hidden>
          <path
            d="M6 19V5a2 2 0 0 1 2-2h9v16H8a2 2 0 0 0-2 2zM6 19a2 2 0 0 0 2 2h9"
            stroke={colors.muted}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'play':
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={colors.muted} strokeWidth="1.5" />
          <path d="M10 9l6 3-6 3V9z" fill={colors.muted} />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...common} aria-hidden>
          <path
            d="M9 2h6v2H9V2zM8 6h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
            stroke={colors.muted}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M9 11h6M9 14h6M9 17h4" stroke={colors.muted} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common} aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="3" stroke={colors.muted} strokeWidth="1.5" />
          <path d="M8 12l2.5 2.5L16 9" stroke={colors.muted} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'level':
      return (
        <svg {...common} aria-hidden>
          <rect x="5" y="5" width="14" height="14" rx="2" stroke={colors.muted} strokeWidth="1.5" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill={colors.muted}
            fontSize="10"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            A
          </text>
        </svg>
      );
    case 'signal':
      return (
        <svg {...common} aria-hidden>
          <path d="M4 17h3v6H4v-6zm6-4h3v10h-3V13zm6-8h3v18h-3V5z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export function CourseDetailsCard({ heading = 'Course details', rows }) {
  return (
    <section aria-labelledby="course-details-heading">
      <Title id="course-details-heading">{heading}</Title>
      {rows.map((row) => (
        <Row key={row.key}>
          <RowLeft>
            <IconBox aria-hidden>
              <RowIcon name={row.icon} />
            </IconBox>
            {row.label}
          </RowLeft>
          <ValueText>{row.value}</ValueText>
        </Row>
      ))}
    </section>
  );
}
