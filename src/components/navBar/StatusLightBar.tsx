import React from 'react';
import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { useRecoilValue } from 'recoil';

import styles from '@/styles/styles';
import { statusState } from '@/store';

const noBlink = keyframes`
  50% {
    opacity: 1;
  }
`;

const blinker = keyframes`
  50% {
    opacity: 0;
  }
`;

interface StatusLightbarProps {
  isAlarm: boolean;
  isEmergency: boolean;
  isServoOn: boolean;
}
const StatusLightbar = styled.div<StatusLightbarProps>`
  width: 100vw;
  height: 12px;
  background-color: ${(props) =>
    props.isAlarm || props.isEmergency
      ? styles.colors.danger1
      : styles.colors.success1};
  animation: ${(props) =>
      props.isAlarm ||
      (!props.isAlarm && !props.isEmergency && !props.isServoOn)
        ? blinker
        : noBlink}
    1.2s cubic-bezier(0.21, 0.79, 0.115, 1.055) infinite;
`;

const StatusLightBar = () => {
  const status = useRecoilValue(statusState);
  return <StatusLightbar
    isAlarm={status.lastHeartBeatMessage.alarm?.all}
    isEmergency={status.lastHeartBeatMessage.emergency?.all === false}
    isServoOn={status.lastHeartBeatMessage.servo_on}
  />
};

export default StatusLightBar;
