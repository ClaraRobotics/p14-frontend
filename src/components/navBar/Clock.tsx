import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { enUS, th } from 'date-fns/locale';

import styles from '@/styles/styles';
import i18n from '@/i18n';

const LOCALE_MAPPER: Record<string, Locale> = {
  th: th,
  en: enUS,
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
      {format(date, 'EEEE, do MMM y', { locale })}
      <Divider>|</Divider>
      {format(date, 'h:mm a')}
    </Text>
  );
};

export default Clock;
