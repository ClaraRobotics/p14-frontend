import React, { PropsWithChildren, TouchEventHandler } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import Backdrop from '@/components/common/Backdrop';
import styles from '@/styles/styles';

const transitionName = 'slide-and-fade';

interface PropsData {
  show?: boolean;
  onBackdropTap?: TouchEventHandler;
  width?: string;
  height?: string;
  top?: string;
  left?: string;
};

interface ContainerStyledProps {
  width?: string;
  height?: string;
  top?: string;
  left?: string;
}


const Container = styled.div<ContainerStyledProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height}
  max-height: 50%;
  box-sizing: border-box;
  background-color: ${styles.colors.gray8};
  position: absolute;
  display: flex;
  flex-direction: column;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 99;
  padding: 48px 64px;
  font-size: 20px;
  font-weight: 600;
  color: ${styles.colors.gray3};
  transition: ${styles.transition.animationDuration} ${styles.transition.timingFunction};
  -webkit-box-shadow: 0px 0px 18px 0px rgba(31,31,31,0.5);
  -moz-box-shadow: 0px 0px 18px 0px rgba(31,31,31,0.5);
  box-shadow: 0px 0px 18px 0px rgba(31,31,31,0.5);

  &.${transitionName}-enter { opacity: 0; transform: translateY(-10%); }
  &.${transitionName}-enter-active { opacity: 1; transform: translateY(0); }
  &.${transitionName}-exit { opacity: 1; transform: translateY(0); }
  &.${transitionName}-exit-active { opacity: 0; transform: translateY(-10%); }
`;

const BasicModal = (props: PropsWithChildren<PropsData>) => {
  const {
    show,
    children,
    width = '50%',
    height = 'auto',
    top = '25%',
    left = '25%',
    onBackdropTap = () => {},
  } = props;

  return(
    <Backdrop show={show} onTap={onBackdropTap}>
      <CSSTransition
        in={show}
        timeout={500}
        classNames={transitionName}
        unmountOnExit
      >
        <Container width={width} height={height} top={top} left={left}>
          <div>{children}</div>
        </Container>
      </CSSTransition>
    </Backdrop>
  )
}

export default BasicModal;
