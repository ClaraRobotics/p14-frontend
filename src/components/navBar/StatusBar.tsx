import React from 'react';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from 'react-i18next';
import { statusState } from '@/store';
import { useRecoilState } from 'recoil';
import { ReadyState } from 'react-use-websocket';

import EmergencyStatus from '@/components/navBar/EmergencyStatus';

import styles from '@/styles/styles';

type RobotStatusValueStyledProps = {
  status?: boolean;
};

const StatusBarContainer = styled.div`
  width: calc(50% - 100px);
  height: 100%;
  display: flex;
  align-items: center;
`;

const StatusBar = ({ t }: WithTranslation) => {
  const [status, setStatus] = useRecoilState(statusState);

  // console.log(
  //   'lastheartbeat message from recoil:',
  //   status.lastHeartBeatMessage
  // );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[status.connectionStatus as unknown as ReadyState];

  return (
    <StatusBarContainer>
      <EmergencyStatus />
    </StatusBarContainer>
  );
};
export default withTranslation()(StatusBar);
