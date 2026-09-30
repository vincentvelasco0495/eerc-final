import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { htmlToPlainText } from 'src/utils/html-content';
import { resolveProgramBannerSrc } from 'src/utils/program-banner';

import { Iconify } from 'src/components/iconify';

import { styles, cardArtSx, cardBannerFrameSx } from './styles';

function CourseCardBanner({ course }) {
  const courseBanner =
    typeof course.bannerImageUrl === 'string' && course.bannerImageUrl.trim()
      ? course.bannerImageUrl.trim()
      : '';

  if (courseBanner) {
    return (
      <Box sx={cardBannerFrameSx}>
        <Box
          component="img"
          src={courseBanner}
          alt=""
          sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
        />
      </Box>
    );
  }

  const usesProgramBanner =
    Object.prototype.hasOwnProperty.call(course, 'bannerPath') ||
    Object.prototype.hasOwnProperty.call(course, 'bannerUrl');
  const bannerSrc = usesProgramBanner
    ? resolveProgramBannerSrc(course.bannerUrl || course.bannerPath)
    : '';

  if (usesProgramBanner) {
    if (bannerSrc) {
      return (
        <Box sx={cardBannerFrameSx}>
          <Box
            component="img"
            src={bannerSrc}
            alt=""
            sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
          />
        </Box>
      );
    }

    return <Skeleton variant="rounded" animation="wave" sx={styles.bannerSkeleton} />;
  }

  return <Box sx={{ ...cardArtSx(course.variant) }} />;
}

function CourseMetaPill({ icon, children }) {
  return (
    <Stack direction="row" spacing={0.8} alignItems="center" sx={styles.courseMetaPill}>
      <Iconify icon={icon} width={16} />
      <Typography variant="body2">{children}</Typography>
    </Stack>
  );
}

export function StudentProfileCourseCard({ course }) {
  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Stack spacing={2}>
          <CourseCardBanner course={course} />

          <Stack spacing={1}>
            <Typography variant="caption" sx={styles.categoryCaption}>
              {course.category}
            </Typography>
            <Typography variant="h6" sx={styles.title}>
              {course.title}
            </Typography>
            {course.description ? (
              <Typography variant="body2" sx={styles.description}>
                {htmlToPlainText(course.description)}
              </Typography>
            ) : null}
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <CourseMetaPill icon="solar:notebook-bookmark-bold-duotone">
              {course.lessons} {course.lessonsMetaLabel ?? 'Lectures'}
            </CourseMetaPill>
            {typeof course.lectureCount === 'number' && course.lectureCount > 0 ? (
              <CourseMetaPill icon="solar:book-bookmark-bold-duotone">
                {course.lectureCount} Lectures
              </CourseMetaPill>
            ) : null}
            <CourseMetaPill icon="solar:clock-circle-bold-duotone">
              {course.durationHours} Hours
            </CourseMetaPill>
          </Stack>

          {typeof course.rating === 'number' && Number.isFinite(course.rating) ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating readOnly precision={0.1} value={course.rating} size="small" />
              <Typography variant="body2" sx={styles.ratingCaption}>
                {course.rating.toFixed(1)}
              </Typography>
            </Stack>
          ) : null}

          <Button
            component={RouterLink}
            href={
              course.programSlug
                ? `${paths.programCourseDetail}?program=${encodeURIComponent(course.programSlug)}`
                : course.courseSlug
                  ? paths.dashboard.courseDetails(course.courseSlug)
                  : course.courseId
                    ? paths.dashboard.courses.details(course.courseId)
                    : paths.dashboard.courses.root
            }
            variant="contained"
            sx={styles.startCourseBtn}
          >
            {course.actionLabel ?? 'Start Course'}
          </Button>

          <Typography variant="caption" sx={styles.startedCaption}>
            {course.enrollmentCaption ??
              (course.startedAt ? `Started ${course.startedAt}` : 'Available to enroll')}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
