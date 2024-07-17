import React, { TouchEventHandler, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import styles from '@/styles/styles';

const transitionName = 'fade';

interface PropsData {
  show?: boolean;
  onTap?: TouchEventHandler;
}

const BackdropElement = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  background-color: ${styles.colors.gray7};
  opacity: .7;
  backdrop-filter: blur(10px);
  transition: ${styles.transition.animationDuration} ${styles.transition.timingFunction};

  &.${transitionName}-enter { opacity: 0; }
  &.${transitionName}-enter-active { opacity: 0.7; }
  &.${transitionName}-exit { opacity: 0.7; }
  &.${transitionName}-exit-active { opacity: 0; }
`;

const Backdrop = (props: PropsWithChildren<PropsData>) => {
  const { show = false, onTap, children } = props;
  return (
    <div>
      <CSSTransition
        in={show}
        timeout={500}
        classNames={transitionName}
        unmountOnExit
      >
        <BackdropElement onTouchEnd={onTap ? onTap : () => {}} />
      </CSSTransition>
      <div>{children || null}</div>
    </div>
  );
}

export default Backdrop;
