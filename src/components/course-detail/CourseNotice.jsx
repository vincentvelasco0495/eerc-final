import styled from 'styled-components';

import { space, colors } from './course-detail-tokens';

const NoticeRoot = styled.section`
  margin: 0;
`;

const NoticeHeading = styled.h2`
  margin: 0 0 ${space(3)};
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
  color: ${colors.headingNavy};
`;

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  gap: ${space(1)};
  align-items: flex-start;
  margin: 0 0 ${space(3)};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Index = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${colors.text};
  line-height: 1.65;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 14px;
  line-height: 1.65;
  color: ${colors.muted};
`;

const TitleStrong = styled.strong`
  font-weight: 700;
  color: ${colors.text};
`;

const LinkParen = styled.a`
  color: ${colors.accentText};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

/**
 * Notice tab — heading + numbered list (bold title, parenthetical link, body copy).
 */
export function CourseNotice({ heading, items }) {
  return (
    <NoticeRoot aria-labelledby="course-notice-heading">
      <NoticeHeading id="course-notice-heading">{heading}</NoticeHeading>
      <List>
        {items.map((row, i) => {
          const title = typeof row.titleBold === 'string' ? row.titleBold.trim() : '';
          const hasTitle = Boolean(title);

          return (
          <Item key={row.id}>
            <Index>{i + 1}.</Index>
            <Body>
              {hasTitle ? (
                <>
                  <TitleStrong>{title}</TitleStrong>{' '}
                  {row.linkLabel ? (
                    <LinkParen href={row.href || '#'}>({row.linkLabel})</LinkParen>
                  ) : null}
                </>
              ) : null}
              {row.body}
            </Body>
          </Item>
        );
        })}
      </List>
    </NoticeRoot>
  );
}
