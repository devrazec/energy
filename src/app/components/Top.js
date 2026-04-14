'use client';

import { useContext, useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { GlobalContext } from '../context/GlobalContext';
import dayjs from 'dayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';

function RangeDay({ day, startDate, endDate, outsideCurrentMonth, ...pickersDayProps }) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const isStart = day.isSame(start, 'day');
  const isEnd = day.isSame(end, 'day');
  const inRange = !outsideCurrentMonth &&
    (day.isAfter(start, 'day') || isStart) &&
    (day.isBefore(end, 'day') || isEnd);

  return (
    <PickerDay
      {...pickersDayProps}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={[
        inRange && !isStart && !isEnd && {
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
          borderRadius: 0,
          '&:hover': { backgroundColor: 'primary.light' },
        },
        isStart && !isEnd && { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
        isEnd && !isStart && { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
      ]}
    />
  );
}

const SHORTCUTS = [
  { label: 'Tomorrow', getRange: () => { const d = new Date(); d.setDate(d.getDate() + 1); return { startDate: d, endDate: d }; }, route: '/pages/Tomorrow' },
  { label: 'Today', getRange: () => { const d = new Date(); return { startDate: d, endDate: d }; }, route: '/pages/Today' },
  { label: 'Yesterday', getRange: () => { const d = new Date(); d.setDate(d.getDate() - 1); return { startDate: d, endDate: d }; }, route: '/pages/Yesterday' },
  { label: 'Week', getRange: () => { const d = new Date(); const s = new Date(d); s.setDate(d.getDate() - d.getDay()); return { startDate: s, endDate: d }; }, route: '/pages/Week' },
  { label: 'Month', getRange: () => { const d = new Date(); return { startDate: new Date(d.getFullYear(), d.getMonth(), 1), endDate: d }; }, route: '/pages/Month' },
  
  { label: 'Grouped Day', getRange: () => { const e = new Date(); const s = new Date(); s.setDate(e.getDate() - 7); return { startDate: s, endDate: e }; }, route: '/pages/GroupedDay' },
  { label: 'Grouped Month', getRange: () => { const d = new Date(); return { startDate: new Date(d.getFullYear(), 0, 1), endDate: d }; }, route: '/pages/GroupedMonth' },
  { label: 'Grouped Year', getRange: () => { const d = new Date(); return { startDate: new Date(d.getFullYear(), 0, 1), endDate: d }; }, route: '/pages/GroupedYear' },
  
  { label: 'One Day', getRange: () => { const d = new Date(); return { startDate: d, endDate: d }; }, route: '/pages/OneDay' },
  { label: 'One Month', getRange: () => { const e = new Date(); const s = new Date(); s.setDate(e.getDate() - 30); return { startDate: s, endDate: e }; }, route: '/pages/OneMonth' },
  { label: 'One Year', getRange: () => { const y = new Date().getFullYear() - 1; return { startDate: new Date(y, 0, 1), endDate: new Date(y, 11, 31) }; }, route: '/pages/OneYear' },
];

export default function Top() {
  const { darkMode, setDarkMode, mobileDevice, selectedDate,
        setSelectedDate, selectedMonth, setSelectedMonth,
        selectedYear, setSelectedYear, } = useContext(GlobalContext);
  const pathname = usePathname();
  const router = useRouter();
  const anchorRef = useRef(null);

  const isHome = pathname === '/';
  const showBackArrow = !isHome && mobileDevice;

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }]);

  const handleShortcut = (shortcut) => {
    const { startDate, endDate } = shortcut.getRange();
    setRange([{ startDate, endDate, key: 'selection' }]);
    if (shortcut.route === '/pages/OneDay' || shortcut.route === '/pages/Yesterday' || shortcut.route === '/pages/Tomorrow' || shortcut.route === '/pages/Today') {
      setSelectedDate(dayjs(startDate));
    }
    setOpen(false);
    router.push(shortcut.route);
  };

  const isOneDay = pathname === '/pages/OneDay';
  const isSingleDay = isOneDay || pathname === '/pages/Yesterday' || pathname === '/pages/Tomorrow' || pathname === '/pages/Today';
  const isMonthYearPage = pathname === '/pages/OneMonth';
  const isYearPage = pathname === '/pages/OneYear';

  useEffect(() => {
    if (pathname === '/pages/Yesterday') {
      setSelectedDate(dayjs().subtract(1, 'day'));
    } else if (pathname === '/pages/Tomorrow') {
      setSelectedDate(dayjs().add(1, 'day'));
    } else if (pathname === '/pages/Today') {
      setSelectedDate(dayjs());
    } else if (pathname === '/pages/Month') {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      setRange([{ startDate: start, endDate: end, key: 'selection' }]);
    } else if (pathname === '/pages/OneMonth') {
      setSelectedMonth(dayjs());
    } else if (pathname === '/pages/OneYear') {
      setSelectedYear(dayjs());
    } else if (pathname === '/pages/Week') {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      setRange([{ startDate: start, endDate: end, key: 'selection' }]);
    }
  }, [pathname]);

  const displayRanges = isSingleDay && selectedDate?.isValid()
    ? [{ startDate: selectedDate.toDate(), endDate: selectedDate.toDate(), key: 'selection' }]
    : range;

  const label = isSingleDay && selectedDate?.isValid()
    ? dayjs(selectedDate).format('DD MMM YYYY')
    : isMonthYearPage && selectedMonth?.isValid()
    ? dayjs(selectedMonth).format('MMM YYYY')
    : isYearPage && selectedYear?.isValid()
    ? dayjs(selectedYear).format('YYYY')
    : `${dayjs(range[0].startDate).format('DD MMM YYYY')} – ${dayjs(range[0].endDate).format('DD MMM YYYY')}`;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#00a76f1f',
        backdropFilter: 'blur(4px)',
        borderBottom: '1px solid', borderColor: 'divider',
      }}
    >
      <Toolbar>
        {mobileDevice ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Image src="/energy/logo1.png" alt="Logo" width={42} height={42} style={{ objectFit: 'contain' }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Image src="/energy/logo.png" alt="Logo" width={140} height={60} style={{ objectFit: 'contain' }} />
          </Box>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Button
            ref={anchorRef}
            variant="outlined"
            size="small"
            onClick={() => setOpen(true)}
            sx={{ textTransform: 'none', fontSize: 13, borderRadius: 2, whiteSpace: 'nowrap' }}
          >
            {label}
          </Button>

          <Popover
            open={open}
            anchorEl={anchorRef.current}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            PaperProps={{ sx: { maxWidth: mobileDevice ? '100vw' : 'none', width: mobileDevice ? '100vw' : 'auto' } }}
          >
            <Paper sx={{ display: 'flex', flexDirection: mobileDevice ? 'column' : 'row', overflow: 'auto' }}>
              {/* Shortcuts sidebar */}
              <Box sx={{
                display: 'flex',
                flexDirection: mobileDevice ? 'row' : 'column',
                flexWrap: mobileDevice ? 'wrap' : 'nowrap',
                p: 1,
                borderRight: mobileDevice ? 'none' : '1px solid #e0e0e0',
                borderBottom: mobileDevice ? '1px solid #e0e0e0' : 'none',
                minWidth: mobileDevice ? 'unset' : 130,
                gap: mobileDevice ? 0.5 : 0,
              }}>
                {SHORTCUTS.map((s) => {
                  const isActive = pathname === s.route;
                  return (
                    <Button
                      key={s.label}
                      onClick={() => handleShortcut(s)}
                      size="small"
                      variant={isActive ? 'contained' : 'text'}
                      sx={{ justifyContent: 'flex-start', textTransform: 'none', fontSize: 12, py: 0.5 }}
                    >
                      {s.label}
                    </Button>
                  );
                })}
              </Box>
              {/* Single date calendar — OneDay / Yesterday */}
              {isSingleDay && (
                <Box sx={{ p: 1 }}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => {
                      if (!newValue?.isValid()) return;
                      setSelectedDate(newValue);
                      setOpen(false);
                      const isYesterday = newValue.isSame(dayjs().subtract(1, 'day'), 'day');
                      const isTomorrow = newValue.isSame(dayjs().add(1, 'day'), 'day');
                      const isToday = newValue.isSame(dayjs(), 'day');
                      if (pathname === '/pages/Yesterday' && !isYesterday) {
                        router.push('/pages/OneDay');
                      } else if (pathname === '/pages/Tomorrow' && !isTomorrow) {
                        router.push('/pages/OneDay');
                      } else if (pathname === '/pages/Today' && !isToday) {
                        router.push('/pages/OneDay');
                      }
                    }}
                    disableFuture={pathname !== '/pages/Tomorrow'}
                    disablePast={pathname === '/pages/Tomorrow'}
                  />
                </Box>
              )}

              {/* Month/year calendar — Month / OneMonth pages */}
              {isMonthYearPage && (
                <Box sx={{ p: 1 }}>
                  <DateCalendar
                    value={selectedMonth}
                    onChange={(newValue) => {
                      if (!newValue?.isValid()) return;
                      setSelectedMonth(newValue);
                      setOpen(false);
                    }}
                    views={['year', 'month']}
                    openTo="month"
                    minDate={dayjs('2025-03-01')}
                    disableFuture
                  />
                </Box>
              )}

              {/* Year-only calendar — OneYear page */}
              {isYearPage && (
                <Box sx={{ p: 1 }}>
                  <DateCalendar
                    value={selectedYear}
                    onChange={(newValue) => {
                      if (!newValue?.isValid()) return;
                      setSelectedYear(newValue);
                      setOpen(false);
                    }}
                    views={['year']}
                    openTo="year"
                    minDate={dayjs('2025-01-01')}
                    disableFuture
                  />
                </Box>
              )}

              {/* Range date calendars — all other pages */}
              {!isSingleDay && !isMonthYearPage && !isYearPage && (
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: mobileDevice ? 'column' : 'row' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>Start date</Typography>
                      <DateCalendar
                        value={dayjs(range[0].startDate)}
                        onChange={(newValue) => {
                          if (!newValue?.isValid()) return;
                          const startDate = newValue.toDate();
                          const maxEnd = dayjs(startDate).add(3, 'month').toDate();
                          const endDate = range[0].endDate < startDate ? startDate
                            : range[0].endDate > maxEnd ? maxEnd
                            : range[0].endDate;
                          setRange([{ startDate, endDate, key: 'selection' }]);
                        }}
                        slots={{ day: RangeDay }}
                        slotProps={{ day: { startDate: range[0].startDate, endDate: range[0].endDate } }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>End date</Typography>
                      <DateCalendar
                        value={dayjs(range[0].endDate)}
                        onChange={(newValue) => {
                          if (!newValue?.isValid()) return;
                          const endDate = newValue.toDate();
                          const maxEnd = dayjs(range[0].startDate).add(3, 'month').toDate();
                          setRange([{ ...range[0], endDate: endDate > maxEnd ? maxEnd : endDate }]);
                        }}
                        minDate={dayjs(range[0].startDate)}
                        maxDate={dayjs(range[0].startDate).add(3, 'month')}
                        slots={{ day: RangeDay }}
                        slotProps={{ day: { startDate: range[0].startDate, endDate: range[0].endDate } }}
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setOpen(false)}
                    sx={{ alignSelf: 'flex-end', mx: 2, mb: 1 }}
                  >
                    Apply
                  </Button>
                </Box>
              )}
            </Paper>
          </Popover>
        </Box>

        <IconButton color="primary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}