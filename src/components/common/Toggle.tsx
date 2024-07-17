import React from 'react';
import styled from 'styled-components';

import styles from '@/styles/styles';

interface PropsData {
  disabled?: boolean;
  onLabel: string;
  onValue: string | number | boolean;
  offLabel: string;
  offValue: string | number | boolean;
  selected: string | number | boolean;
  onToggle: (value: any) => void;
  hilighted?: boolean;
}

const ToggleContainer = styled.div`
  min-width: 112px;
`;

const ToggleButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 36px;
  padding: 0 8px;
  font-family: 'pt-prime';
  font-size: 20px;
  font-weight: bold;
  border: none;
  background-color: var(--btn-background);
  color: var(--btn-text);
  margin: 8px 0;
  --btn-background: ${styles.colors.gray6};
  --btn-text: ${styles.colors.gray2};

  &.active {
    --btn-background: ${styles.colors.white};
    --btn-text: ${styles.colors.gray8};
  }

  &.active-on {
    --btn-background: ${styles.colors.success1};
    --btn-text: ${styles.colors.gray8};
  }

  &.active-off {
    --btn-background: ${styles.colors.danger2};
    --btn-text: ${styles.colors.gray8};
  }
`;

const Toggle = (props: PropsData) => {
  const { onLabel, onValue, offLabel, offValue, selected, onToggle, hilighted } = props;

  const onToggleOff = () => {
    if (selected === offValue) return;
    onToggle(offValue);
  };

  const onToggleOn = () => {
    if (selected === onValue) return;
    onToggle(onValue);
  };

  return (
    <ToggleContainer>
      <ToggleButtonContainer
        className={selected !== offValue ? '' : hilighted ? 'active-off' : 'active'}
        onTouchEnd={onToggleOff}
      >
        {offLabel}
      </ToggleButtonContainer>
      <ToggleButtonContainer
        className={selected !== onValue ? '' : hilighted ? 'active-on' : 'active'}
        onTouchEnd={onToggleOn}
      >
        {onLabel}
      </ToggleButtonContainer>
    </ToggleContainer>
  );
};

export default Toggle;
