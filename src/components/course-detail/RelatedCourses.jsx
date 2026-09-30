import styled from 'styled-components';

import { CourseCard } from './CourseCard';
import { space, colors } from './course-detail-tokens';

const Section = styled.section`
  margin-top: ${(props) => (props.$omitOuterTopMargin ? '0' : space(4))};
`;

const Title = styled.h2`
  margin: 0 0 ${space(2)};
  font-size: 20px;
  font-weight: 700;
  color: ${colors.headingNavy};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${space(2)};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export function RelatedCourses({ title = 'Related courses', items, omitOuterTopMargin = false }) {
  return (
    <Section aria-labelledby="related-courses-heading" $omitOuterTopMargin={omitOuterTopMargin}>
      <Title id="related-courses-heading">{title}</Title>
      <Grid>
        {items.map((c) => (
          <CourseCard
            key={c.id}
            imageUrl={c.imageUrl}
            title={c.title}
            priceLabel={c.priceLabel}
            priceStrike={c.priceStrike}
            ratingValue={c.rating}
            href={c.href}
          />
        ))}
      </Grid>
    </Section>
  );
}
