import React from 'react';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IconContext } from 'react-icons';
import { BsFillPlayFill, BsPauseFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';

import api from '@/api';
import styles from '@/styles/styles';
import { statusState, viewActions, viewState } from '@/store';
import {playSound} from '@/sound/playSound';

const StartPauseButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CircularButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 156px;
  height: 56px;
  border-radius: 56px;
  background-color: ${styles.colors.gray6};
  color: ${styles.colors.gray2};
  border: none;

  &:not(:first-child) {
    margin-left: 16px;
  }

  &.disabled {
    color: ${styles.colors.gray5};
    opacity: 0.8;
  }
  &.green {
    color: ${styles.colors.gray7};
    background-color: ${styles.colors.success1};
  }

  &.pressed &:not(.disabled):active {
    background-color: ${styles.colors.gray5};
  }
  &:active {
    filter: brightness(3.0);
    transition: all 0s;
  }
  &:active:after {
    opacity: 1;
  }
  transition: all 0.4s ease-in;
  transition-delay: 1.0s;
`;

const StartPauseButtons = ({ t }: WithTranslation) => {
  const startRobot = () => {
    console.log('start robot!');
    api
      .get('/robot/start')
      .then((res) => {})
      .catch((err) => {});
  };

  const holdRobot = () => {
    api
      .get('/robot/hold')
      .then((res) => {})
      .catch((err) => {});
  };
  /* cases are
  1) EMER
  2) NO TASK */

  const status = useRecoilValue(statusState);
  const [view, setView] = useRecoilState(viewState);
  const latestEmergencyStatus = status.lastHeartBeatMessage.emergency;

  const isStartDisabled = latestEmergencyStatus?.all !== false;

  const onRobotResume = () =>
    viewActions.checkEmerThencall(view, setView, status, startRobot);

  return (
    <StartPauseButtonsContainer>
      <CircularButtonContainer
        onTouchStart={() => playSound()}
        onTouchEnd={onRobotResume}
        className={'green'}
      >
        <IconContext.Provider
          value={{
            style: {
              width: '36px',
              height: '36px',
            },
          }}
        >
          <BsFillPlayFill />
        </IconContext.Provider>
      </CircularButtonContainer>
      <CircularButtonContainer onTouchEnd={holdRobot}>
        <IconContext.Provider
          value={{
            style: {
              width: '36px',
              height: '36px',
            },
          }}
        >
          <BsPauseFill />
        </IconContext.Provider>
      </CircularButtonContainer>
    </StartPauseButtonsContainer>
  );
};

export default withTranslation()(StartPauseButtons);
