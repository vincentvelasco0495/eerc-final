import styled, { css } from 'styled-components';

import { radii, colors } from './course-detail-tokens';

const variants = {
  default: css`
    background: ${colors.white};
    border: none;
  `,
  completion: css`
    background: ${colors.white};
    border: none;
  `,
  muted: css`
    background: ${colors.bg};
    border: none;
  `,
};

/** Shared sidebar surface: rounded card, subtle shadow (~12px radius). */
export const SidebarCard = styled.section`
  border-radius: ${radii.card};
  box-shadow: none;
  padding: 18px;
  ${(props) => variants[props.$variant] ?? variants.default};
`;
