import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';

import styles from '@/styles/styles';

interface PropsData {
  disabled?: boolean;
  icon?: ReactElement;
  label?: string;
  large?: boolean;
  noMargin?: boolean;
  width?: number;
  height?: number;
  highlighted?: boolean;
  onTap?: React.TouchEventHandler;
  className?: string;
}

const defaultProps: PropsData = {
  disabled: false,
  icon: undefined,
  highlighted: false,
  label: '',
  large: false,
  onTap: () => {},
  className: '',
};
interface IconButtonContainerProps {
  width: number;
  height: number;
}
const IconButtonContainer = styled.div<IconButtonContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.large {
    width: 64px;
    height: 64px;
  }

  width: ${(props: IconButtonContainerProps) => {
    return props.width === undefined ? '56px' : props.width - 16 + 'px';
  }}!important;
  height: ${(props: IconButtonContainerProps) => {
    return props.height === undefined ? '56px' : props.height - 16 + 'px';
  }}!important;
  padding: 8px;
  background-color: ${styles.colors.gray6};
  color: ${styles.colors.gray2};
  margin-left: 8px;
  margin-bottom: 4px;

  &.disabled {
    color: ${styles.colors.gray5};
    opacity: 0.8;
  }

  &:not(.disabled):active {
    background-color: ${styles.colors.gray5};
  }

  &.highlighted {
    color: ${styles.colors.primary1};
  }
  &.noMargin {
    margin: 0px;
  }
`;

const IconButtonLabel = styled.div`
  font-size: 12px;
`;

const IconButton = (props: PropsData) => {
  const {
    disabled,
    highlighted,
    icon,
    label,
    large,
    onTap,
    className,
    noMargin,
    width,
    height,
  } = props;

  const containerClassName =
    (className ? className + ' ' : '') +
    (large ? 'large ' : '') +
    (disabled ? 'disabled ' : '') +
    (noMargin ? 'noMargin ' : '') +
    (highlighted ? 'highlighted ' : '');

  return (
    <IconButtonContainer
      className={containerClassName}
      onTouchEnd={onTap}
      height={height}
      width={width}
    >
      <IconContext.Provider
        value={{
          style: {
            width: (width !== undefined) ? width/2 : (large ? '48px' :'32px'),
            height: (height !== undefined )? height/2:(large ? '48px' :'32px')
          },
        }}
      >
        {icon}
      </IconContext.Provider>
      <IconButtonLabel>{label}</IconButtonLabel>
    </IconButtonContainer>
  );
};

IconButton.defaultProps = defaultProps;

export default IconButton;
