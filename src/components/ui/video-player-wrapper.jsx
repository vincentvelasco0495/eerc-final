import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { WatermarkOverlay } from 'src/components/common/watermark-overlay';
import {
  StreamingOnlyNotice,
  SingleSessionWarning,
  DisabledDownloadPanel,
} from 'src/components/common/security-placeholders';

export function VideoPlayerWrapper({
  moduleItem,
  username,
  dateLabel,
  sessionWarning,
  activeTab,
  onTabChange,
}) {
  return (
    <Stack spacing={2.5}>
      <SingleSessionWarning open={sessionWarning} />
      <Card sx={{ width: 1, p: 2 }}>
        <Stack spacing={2}>
          <Stack
            sx={{
              p: 3,
              borderRadius: 3,
              position: 'relative',
              minHeight: 340,
              overflow: 'hidden',
              bgcolor: 'brand.neutralFill',
              justifyContent: 'space-between',
            }}
          >
            <WatermarkOverlay username={username} dateLabel={dateLabel} />

            <Stack spacing={1} sx={{ position: 'relative', zIndex: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={moduleItem.type} color="success" size="small" />
                <Chip label={`${moduleItem.progress}% complete`} color="default" size="small" />
              </Stack>
              <Typography variant="h5" sx={{ color: 'brand.onNeutralFill' }}>
                {moduleItem.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', maxWidth: 520 }}>
                Continue from {moduleItem.lastPosition}. Streaming protection and session watermark
                are active on this view.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ position: 'relative', zIndex: 2 }}
            >
              <Button variant="contained">Resume from {moduleItem.lastPosition}</Button>
              <Button variant="outlined" color="inherit">
                Restart lesson
              </Button>
            </Stack>
          </Stack>

          <StreamingOnlyNotice />

          <Box>
            <Tabs value={activeTab} onChange={onTabChange}>
              <Tab value="video" label="Video" />
              <Tab value="pdf" label="PDF" />
              <Tab value="ebook" label="eBook" />
            </Tabs>
            <Divider />
            <Box
              sx={{
                py: 3,
                px: 2,
                borderRadius: 2,
                mt: 2,
                bgcolor: 'background.neutral',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                {activeTab === 'video' && 'Embedded stream placeholder for secure lecture playback.'}
                {activeTab === 'pdf' && 'PDF viewer placeholder for guided notes and solved examples.'}
                {activeTab === 'ebook' &&
                  'eBook reader placeholder with structured notes, bookmarks, and chapter review.'}
              </Typography>

              <DisabledDownloadPanel />
            </Box>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}
