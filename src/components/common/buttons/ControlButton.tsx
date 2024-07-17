import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';

import styles from '@/styles/styles';

interface PropsData {
  disabled?: boolean;
  icon?: ReactElement;
  label?: string;
  onTap?: React.TouchEventHandler;
  className?: string;
  style?: any;
  color?:string;
}

const defaultProps: PropsData = {
  disabled: false,
  icon: undefined,
  label: '',
  onTap: () => {},
  className: '',
};

const ControlButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
interface IconContainerProps{
  color:string;
}
const IconContainer = styled.button<IconContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  height: 72px;
  padding: 8px;
  background-color: var(--control-btn-background);
  color: var(--control-btn-icon);
  border: 2px solid var(--control-btn-border);
  outline: none;
  --control-btn-background: 'tranparent';
  --control-btn-icon: ${(props) => props.color};
  --control-btn-border: ${(props) => props.color};

  &:disabled {
    --control-btn-icon: ${styles.colors.gray5};
    --control-btn-border: ${styles.colors.gray5};
    opacity: 0.8;
  }

  &:not(:disabled):active {
    --control-btn-icon: ${styles.colors.gray2};
    --control-btn-border: ${styles.colors.gray2};
  }
`;

const Label = styled.div`
  font-size: 18px;
  margin-top: 4px;
  color: ${styles.colors.gray4};
`;

const ControlButton = (props: PropsData) => {
  const { disabled, icon, label, onTap, className, style,color} = props;

  return (
    <ControlButtonContainer>
      <IconContainer
      color={color=== undefined? styles.colors.white :color}
        style={style}
        className={className}
        onTouchEnd={onTap}
        disabled={disabled}
      >
        <IconContext.Provider
          value={{
            style: {
              width: '48px',
              height: '48px',
            },
          }}
        >
          {icon}
        </IconContext.Provider>
      </IconContainer>
      <Label>{label.charAt(0).toUpperCase() + label.slice(1)}</Label>
    </ControlButtonContainer>
  );
};

ControlButton.defaultProps = defaultProps;

export default ControlButton;
