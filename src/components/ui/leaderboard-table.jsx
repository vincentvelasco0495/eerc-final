import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { getBadgeTone } from 'src/utils/lms';

export function LeaderboardTable({ rows }) {
  return (
    <Card
      sx={{
        width: 1,
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Learner</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Badge</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" color={index === 0 ? 'warning.main' : 'text.primary'}>
                    #{index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.lighter', color: 'brand.accentText' }}>
                      {row.name.slice(0, 1)}
                    </Avatar>
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.program}</TableCell>
                <TableCell>{row.score}</TableCell>
                <TableCell>
                  <Chip color={getBadgeTone(row.badge)} label={row.badge} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
