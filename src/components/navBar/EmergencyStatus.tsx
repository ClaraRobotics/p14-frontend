import React from 'react';
import styled from 'styled-components';
import { statusState } from '@/store';
import { useRecoilState } from 'recoil';
import styles from '@/styles/styles';
import { withTranslation, WithTranslation } from 'react-i18next';

const EmergencyStatusContainer = styled.div`
  background-color: var(--emer-container-background);
  opacity: 0;
  color: ${styles.colors.white};
  font-size: 25px;
  font-weight: 600;
  line-height: 60px;
  margin-left: 400px;
  padding: 2px 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 36px;
  max-width: 60%;
  border-radius: 16px;

  &.stopped {
    --emer-container-background: ${styles.colors.danger1};
    opacity: 1;
  }
`;

const EmergencyText = styled.div`
  font-size: 20px;
`;

//TODO HANDLE UNDEFINED IF WEBSOCKET ISNT LOADED
const EmergencyStatus = ({ t }: WithTranslation) => {
  const [status, setStatus] = useRecoilState(statusState);
  const latestEmergencyStatus = status.lastHeartBeatMessage.emergency;
  const latestEmergencyButton = status.lastHeartBeatMessage.emergencyButton
  // console.log(' >>>>>> ', latestEmergencyStatus);
  return (
    <EmergencyStatusContainer
      // className={'stopped'}
      className={!latestEmergencyStatus?.all ? '' : 'stopped'}
    >
      <EmergencyText>{t('statusbar.emer_stopped')} (ปุ่ม {
        latestEmergencyButton ?
          Object.entries(latestEmergencyButton).filter(btn => btn[1]).map(btn => btn[0].toUpperCase()).join(', ')
          :
          ''
      })</EmergencyText>
    </EmergencyStatusContainer>
  );
};

export default withTranslation()(EmergencyStatus);
