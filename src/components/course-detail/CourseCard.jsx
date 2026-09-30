import styled from 'styled-components';

import { RouterLink } from 'src/routes/components';

import { goldAlpha } from 'src/theme';

import { colors, shadow } from './course-detail-tokens';

const Media = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background: ${colors.bg};
  overflow: hidden;
`;

const MediaImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Lower = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.38;
  color: ${colors.text};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const Strike = styled.span`
  font-size: 13px;
  color: ${colors.muted};
  text-decoration: line-through;
`;

const Price = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.accentText};
`;

const StarsRow = styled.div`
  font-size: 13px;
  letter-spacing: 1px;
  color: ${colors.star};
`;

const Root = styled.article`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${colors.white};
  height: 100%;
  box-shadow: ${shadow.card};
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: ${shadow.cardHover};
  }

  &:focus-within {
    outline: none;
    box-shadow: 0 0 0 2px ${goldAlpha(0.45)};
  }
`;

const CardLink = styled(RouterLink)`
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
`;

/** Grid card — related courses strip */
export function CourseCard({
  imageUrl,
  title,
  priceLabel,
  priceStrike,
  ratingValue,
  href,
}) {
  const full = Math.round(ratingValue);
  const empty = Math.max(0, 5 - full);

  const inner = (
    <Root style={href ? { height: '100%' } : undefined}>
      <Media>
        <MediaImg src={imageUrl} alt="" loading="lazy" />
      </Media>
      <Lower>
        <Title>{title}</Title>
        <PriceRow>
          {priceStrike ? <Strike>{priceStrike}</Strike> : null}
          <Price>{priceLabel}</Price>
        </PriceRow>
        <StarsRow aria-hidden>
          {'★'.repeat(full)}
          <span style={{ color: colors.starEmpty }}>{'★'.repeat(empty)}</span>
        </StarsRow>
      </Lower>
    </Root>
  );

  return href ? <CardLink href={href}>{inner}</CardLink> : inner;
}
