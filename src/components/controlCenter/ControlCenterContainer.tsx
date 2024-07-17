import React from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { useRecoilState } from 'recoil';
import { withTranslation, WithTranslation } from 'react-i18next';

import { BsPauseFill, BsFillPlayFill } from 'react-icons/bs';

import Backdrop from '@/components/common/Backdrop';
import IconButton from '@/components/common/buttons/IconButton';

import { viewState, viewActions } from '@/store/view';
import styles from '@/styles/styles';
import TaskStat from '../statusdisplay/TaskStat';
import ManualControlButtons from './ManualControlButtons';
import StartPauseButtons from './StartPauseButtons';
import UndoComponent from './UndoComponent';

const transitionName = 'slide';

const Container = styled.div`
  width: 80%;
  height: 90%;
  box-sizing: border-box;
  background-color: ${styles.colors.gray8};
  position: absolute;
  bottom: 0;
  left: 10%;
  z-index: 99;
  padding: 32px 48px;
  overflow: hidden;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  transition: ${styles.transition.animationDuration}
    ${styles.transition.timingFunction};
  -webkit-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  -moz-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);

  &.${transitionName}-enter {
    transform: translateY(100%);
  }
  &.${transitionName}-enter-active {
    transform: translateY(0);
  }
  &.${transitionName}-exit {
    transform: translateY(0);
  }
  &.${transitionName}-exit-active {
    transform: translateY(100%);
  }
`;

const ControlBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StartPauseWrapper = styled.div``;

const Divider = styled.div`
  margin: 0 8px;
`;

const ControlCenterContainer = ({ t }: WithTranslation) => {
  const [view, setView] = useRecoilState(viewState);
  const { showControlCenter } = view;

  const toggleClose = () => {
    viewActions.toggleControlCenter(view, setView, false);
  };
  return (
    <Backdrop show={showControlCenter} onTap={toggleClose}>
      <CSSTransition
        in={showControlCenter}
        timeout={500}
        classNames={transitionName}
        unmountOnExit
      >
        <Container>
          <ControlBar>
            <StartPauseWrapper>
              <StartPauseButtons />
            </StartPauseWrapper>
            <TaskStat />
            <ManualControlButtons />
            <UndoComponent />
          </ControlBar>
        </Container>
      </CSSTransition>
    </Backdrop>
  );
};

export default withTranslation()(ControlCenterContainer);
