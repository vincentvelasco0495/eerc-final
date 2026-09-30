import styled from 'styled-components';

import { RouterLink } from 'src/routes/components';

import { goldAlpha } from 'src/theme';

import { colors } from './course-detail-tokens';

const Heading = styled.h2`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.text};
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ItemWrap = styled.li`
  border-bottom: 1px solid ${colors.border};
  padding: 12px 0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const LinkRow = styled(RouterLink)`
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  margin: 0 -6px;
  padding: 6px;

  &:hover {
    background: ${goldAlpha(0.08)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const Thumb = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 72px;
  height: 52px;
  border-radius: 8px;
  overflow: hidden;
  background: ${colors.bg};
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const RowTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  color: ${colors.text};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Strike = styled.span`
  font-size: 12px;
  color: ${colors.muted};
  text-decoration: line-through;
`;

const Price = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${colors.accentText};
`;

const Stars = styled.span`
  font-size: 12px;
  letter-spacing: 1px;
  color: ${colors.star};
`;

function StarLine({ value }) {
  const full = Math.round(value);
  const empty = Math.max(0, 5 - full);
  return (
    <Stars aria-hidden>
      {'★'.repeat(full)}
      <span style={{ color: colors.starEmpty }}>{'★'.repeat(empty)}</span>
    </Stars>
  );
}

/** Horizontal mini cards for sidebar */
export function PopularCourses({ title = 'Popular courses', items }) {
  return (
    <section aria-labelledby="popular-courses-heading">
      <Heading id="popular-courses-heading">{title}</Heading>
      <List>
        {items.map((item) => (
          <ItemWrap key={item.id}>
            <LinkRow
              href={item.href ?? '#'}
              onClick={(e) => {
                if (!item.href || item.href === '#') {
                  e.preventDefault();
                }
              }}
            >
              <Thumb>
                <ThumbImg src={item.imageUrl} alt="" loading="lazy" />
              </Thumb>
              <Body>
                <RowTitle>{item.title}</RowTitle>
                <PriceRow>
                  {item.priceStrike ? <Strike>{item.priceStrike}</Strike> : null}
                  <Price>{item.priceLabel}</Price>
                </PriceRow>
                <StarLine value={item.rating} />
              </Body>
            </LinkRow>
          </ItemWrap>
        ))}
      </List>
    </section>
  );
}
