import React, { PropsWithChildren, TouchEventHandler } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import Backdrop from '@/components/common/Backdrop';
import Button from '@/components/common/buttons/Button';
import styles from '@/styles/styles';
import { ButtonType } from '@/types/common';

const transitionName = 'slide-and-fade';

interface PropsData {
  title?: string;
  show?: boolean;
  actionButtonLabel?: string;
  onActionButtonTap?: TouchEventHandler;
  subButtonLabel?: string;
  onSubButtonTap?: TouchEventHandler;
  actionButtonType?: ButtonType;
}

const Container = styled.div`
  width: 50%;
  max-height: 80%;
  box-sizing: border-box;
  background-color: ${styles.colors.gray8};
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 15%;
  left: 25%;
  z-index: 10;
  padding: 48px 64px;
  font-size: 20px;
  font-weight: 600;
  color: ${styles.colors.gray3};
  transition: ${styles.transition.animationDuration}
    ${styles.transition.timingFunction};
  -webkit-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  -moz-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);

  &.${transitionName}-enter {
    opacity: 0;
    transform: translateY(-10%);
  }
  &.${transitionName}-enter-active {
    opacity: 1;
    transform: translateY(0);
  }
  &.${transitionName}-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.${transitionName}-exit-active {
    opacity: 0;
    transform: translateY(-10%);
  }
`;

const Title = styled.h1`
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  margin-top: 32px;
`;

const ButtonDivider = styled.div`
  margin: 0 16px;
`;

const AlertModal = (props: PropsWithChildren<PropsData>) => {
  const {
    title,
    show,
    actionButtonLabel,
    onActionButtonTap = () => {},
    subButtonLabel,
    onSubButtonTap = () => {},
    actionButtonType,
    children,
  } = props;

  return (
    <Backdrop show={show}>
      <CSSTransition
        in={show}
        timeout={500}
        classNames={transitionName}
        unmountOnExit
      >
           <Container>
            <Title>{title}</Title>
            <div>{children}</div>
            <ButtonGroup>
              {subButtonLabel ? (
                <Button
                  label={subButtonLabel}
                  onTap={onSubButtonTap}
                  className="secondary"
                />
              ) : null}
              {actionButtonLabel && subButtonLabel ? <ButtonDivider /> : null}
              {actionButtonLabel ? (
                <Button
                  className={actionButtonType}
                  label={actionButtonLabel}
                  onTap={onActionButtonTap}
                />
              ) : null}
            </ButtonGroup>
          </Container>
     </CSSTransition>
    </Backdrop>
  );
};

export default AlertModal;
