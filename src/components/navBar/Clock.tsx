import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format, Locale } from 'date-fns';
import { enUS, th } from 'date-fns/locale';

import styles from '@/styles/styles';
import i18n from '@/i18n';

const mmLocale: Locale = {
  code: 'mm',
  formatLong: {
    date: {
      full: 'EEEE, MMMM do, y',
      long: 'MMMM do, y',
      medium: 'MMM d, y',
      short: 'MM/dd/yyyy'
    },
    time: {
      full: 'h:mm:ss a zzzz',
      long: 'h:mm:ss a z',
      medium: 'h:mm:ss a',
      short: 'h:mm a'
    },
    dateTime: {
      full: "{{date}} 'at' {{time}}",
      long: "{{date}} 'at' {{time}}",
      medium: '{{date}}, {{time}}',
      short: '{{date}}, {{time}}'
    }
  },
  formatRelative: () => '',
  localize: {
    ordinalNumber: (n) => n.toString(),
    era: (n) => [''][n],
    quarter: (n) => [''][n],
    month: (n) => [
      'ဇန်နဝါရီ',
      'ဖေဖော်ဝါရီ',
      'မတ်',
      'ဧပြီ',
      'မေ',
      'ဇွန်',
      'ဇူလိုင်',
      'သြဂုတ်',
      'စက်တင်ဘာ',
      'အောက်တိုဘာ',
      'နိုဝင်ဘာ',
      'ဒီဇင်ဘာ'
    ][n],
    day: (n) => [
      'တနင်္ဂနွေ',
      'တနင်္လာ',
      'အင်္ဂါ',
      'ဗုဒ္ဓဟူး',
      'ကြာသပတေး',
      'သောကြာ',
      'စနေ'
    ][n],
    dayPeriod: (n) => ['နံနက်', 'ညနေ'][n]
  },
  match: {
    era: () => ({ match: () => false, parse: () => null }),
    quarter: () => ({ match: () => false, parse: () => null }),
    month: () => ({ match: () => false, parse: () => null }),
    day: () => ({ match: () => false, parse: () => null }),
    dayPeriod: () => ({ match: () => false, parse: () => null })
  },
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};

const LOCALE_MAPPER: Record<string, Locale> = {
  th: th,
  en: enUS,
  mm: mmLocale
};

const DEFAULT_LOCALE = th;

const Text = styled.div`
  color: ${styles.colors.gray4};
  font-weight: 600;
  font-size: 20px;
  margin-right: 16px;
  margin-left: auto;
`;

const Divider = styled.span`
  font-weight: 600;
  font-size: 20px;
  margin: 0 12px;
`;

const Clock = () => {
  const [date, setDate] = useState(new Date());
  const lang = i18n.language;
  const locale = Object.keys(LOCALE_MAPPER).includes(lang)
    ? LOCALE_MAPPER[i18n.language]
    : DEFAULT_LOCALE;

  const formatDate = (date: Date, formatStr: string) => {
    if (lang === 'mm') {
      const formattedDate = format(date, formatStr, { locale: LOCALE_MAPPER[lang] });
      // แปลงตัวเลขเป็นเลขพม่า
      return formattedDate.replace(/[0-9]/g, (d) => '၀၁၂၃၄၅၆၇၈၉'[d]);
    }
    return format(date, formatStr, { locale });
  };

  const refresh = () => {
    setDate(new Date());
  };

  useEffect(() => {
    const timerId = setInterval(refresh, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <Text>
      {formatDate(date, 'EEEE, do MMM y')}
      <Divider>|</Divider>
      {formatDate(date, 'h:mm a')}
    </Text>
  );
};

export default Clock;