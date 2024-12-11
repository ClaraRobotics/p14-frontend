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
  margin-left: 380px;
  padding: 2px 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 36px;
  width: 335px;
  border-radius: 16px;

  &.stopped {
    --emer-container-background: ${styles.colors.danger1};
    opacity: 1;
  }
`;

const EmergencyText = styled.div`
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

//TODO HANDLE UNDEFINED IF WEBSOCKET ISNT LOADED
const EmergencyStatus = ({ t }: WithTranslation) => {
  const [status, setStatus] = useRecoilState(statusState);
  const emergencyStatus = status.lastHeartBeatMessage.emergency;
  const emergencyButton = status.lastHeartBeatMessage.emergencyButton
  // console.log(' >>>>>> ', latestEmergencyStatus);
  return (
    <EmergencyStatusContainer
      // className={'stopped'}
      className={emergencyStatus?.all ? '' : 'stopped'}
    >
      <EmergencyText>{t('statusbar.emer_stopped')} (ปุ่ม {
        emergencyStatus && emergencyButton ?
        [
          ...(emergencyStatus.pendant === false ? ['A'] : []),
          ...(emergencyStatus.door    === false ? ['B'] : []),
          ...Object.entries(emergencyButton).filter(btn => btn[1] === false).map(btn => btn[0].toUpperCase())
        ].join(', ')
        :
        ''
      })</EmergencyText>
    </EmergencyStatusContainer>
  );
};

export default withTranslation()(EmergencyStatus);
