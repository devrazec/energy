'use client';

import { createContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

import tomorrowJson from '../data/tomorrow.json';
import todayJson from '../data/today.json';
import yesterdayJson from '../data/yesterday.json';
import weekJson from '../data/week.json';
import monthJson from '../data/month.json';
import yearJson from '../data/year.json';

import groupedDayJson from '../data/groupedday.json';
import groupedMonthJson from '../data/groupedmonth.json';
import groupedYearJson from '../data/groupedyear.json';

import oneDayJson from '../data/oneday.json';
import oneMonthJson from '../data/onemonth.json';
import oneYearJson from '../data/oneyear.json';

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('/');

  const [dbTomorrow, setDbTomorrow] = useState(tomorrowJson);
  const [dbToday, setDbToday] = useState(todayJson);
  const [dbYesterday, setDbYesterday] = useState(yesterdayJson);

  const [dbWeek, setDbWeek] = useState(weekJson);
  const [dbMonth, setDbMonth] = useState(monthJson);
  const [dbYear, setDbYear] = useState(yearJson);

  const [dbOneDay, setDbOneDay] = useState(oneDayJson);
  const [dbOneMonth, setDbOneMonth] = useState(oneMonthJson);
  const [dbOneYear, setDbOneYear] = useState(oneYearJson);

  const [dbGroupedDay, setDbGroupedDay] = useState(groupedDayJson);
  const [dbGroupedMonth, setDbGroupedMonth] = useState(groupedMonthJson);
  const [dbGroupedYear, setDbGroupedYear] = useState(groupedYearJson);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedYear, setSelectedYear] = useState(dayjs());

  return (
    <GlobalContext.Provider
      value={{
        darkMode,
        setDarkMode,
        mobileDevice,
        setMobileDevice,
        isLoading,
        setIsLoading,
        currentUrl,
        setCurrentUrl,

        dbToday,
        setDbToday,
        dbYesterday,
        setDbYesterday,
        dbTomorrow,
        setDbTomorrow,

        dbWeek,
        setDbWeek,
        dbMonth,
        setDbMonth,
        dbYear,
        setDbYear,

        dbOneDay,
        setDbOneDay,
        dbOneMonth,
        setDbOneMonth,
        dbOneYear,
        setDbOneYear,

        selectedDate,
        setSelectedDate,

        dbGroupedDay,
        setDbGroupedDay,
        dbGroupedMonth,
        setDbGroupedMonth,
        dbGroupedYear,
        setDbGroupedYear,

        selectedDate,
        setSelectedDate,

        selectedMonth,
        setSelectedMonth,

        selectedYear,
        setSelectedYear,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}