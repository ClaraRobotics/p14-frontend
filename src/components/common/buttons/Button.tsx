import React, { TouchEventHandler, ReactElement, useState } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';

import styles from '@/styles/styles';
import { playSound } from '@/sound/playSound';

interface PropsData {
  className?: string;
  label?: string;
  disabled?: boolean;
  vertical?: boolean;
  frontIcon?: ReactElement;
  rearIcon?: ReactElement;
  onTap?: TouchEventHandler<HTMLButtonElement>;
  style?: any;
  doubleLine?: boolean;
}

const defaultProps: PropsData = {
  className: '',
  label: '',
  frontIcon: undefined,
  rearIcon: undefined,
  onTap: () => {},
};

const ButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: auto;
  line-height: 48px;
  font-family: 'pt-prime';
  font-size: 24px;
  font-weight: 600;
  background-color: var(--btn-background);
  color: var(--btn-text);
  border: solid 2px var(--btn-border);
  margin: 8px;
  margin-top: 8px;
  --btn-border: transparent;
  --btn-background: ${styles.colors.primary1};
  --btn-text: ${styles.colors.gray8};
  --btn-background-active: ${styles.colors.primary2};
  --btn-border-active: transparent;

  &.full-width {
    width: 100%;
    margin: 16px 0;
  }

  &.secondary {
    --btn-background: transparent;
    --btn-text: ${styles.colors.gray3};
    --btn-border: ${styles.colors.gray3};
  }

  &.danger {
    --btn-background: ${styles.colors.danger1};
    --btn-background-active: ${styles.colors.danger2};
    --btn-text: ${styles.colors.gray8};
    --btn-border: transparent;
    --btn-border-active: transparent;
  }

  &.success {
    --btn-background: ${styles.colors.success1};
    --btn-background-active: ${styles.colors.success2};
    --btn-text: ${styles.colors.gray8};
    --btn-border: transparent;
    --btn-border-active: transparent;
  }

  &:disabled {
    --btn-background: ${styles.colors.gray5};
    --btn-text: ${styles.colors.gray7};
    --btn-border: transparent;
    selectable: false;
  }

  &:first-child {
  }

  &:last-child {
  }

  &:active {
    background-color: ${styles.colors.primary3};
    border-color: var(--btn-border-active);
    transition: all 0s;
  }
  &:active:after {
    opacity: 1;
  }
  transition: all 0.4s ease-in;
  transition-delay: 0.7s;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
`;

const Button = (props: PropsData) => {
  const {
    className,
    disabled,
    label,
    onTap,
    frontIcon,
    rearIcon,
    style,
    vertical,
    doubleLine
  } = props;

  const marginRight = vertical? { marginBottom: '8px' } : { marginRight: '8px' }
  const marginLeft = vertical? { marginTop: '8px' } : { marginLeft: '8px' }
  return (
    <ButtonContainer
      onTouchEnd={(e: any) => {
        if (!disabled) {
          playSound();
          onTap?.(e);
        }
      }}
      className={className}
      disabled={disabled}
      style={{ minHeight: doubleLine ? 100 : 0, ...style }}
    >
      <Label style={vertical ? { writingMode: 'vertical-rl' } : {}}>
        <IconContext.Provider
          value={{
            style: {
              color: 'var(--btn-text)',
              width: '32px',
              height: '32px',
              ...marginRight,
            },
          }}
        >
          {frontIcon}
        </IconContext.Provider>
        {label.charAt(0).toUpperCase() + label.slice(1)}
          <IconContext.Provider
          value={{
            style: {
              color: 'var(--btn-text)',
              width: '24px',
              height: '24px',
              ...marginLeft
            },
          }}
        >
          {rearIcon}
        </IconContext.Provider>
      </Label>
    </ButtonContainer>
  );
};

Button.defaultProps = defaultProps;

export default Button;
