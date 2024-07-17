import React from 'react';
import styled from 'styled-components';

import styles from '@/styles/styles';

interface PropsData {
  disabled?: boolean;
  label_0:   string;
  value_0:   string | number;
  label_1:   string;
  value_1:   string | number;
  label_2:   string;
  value_2:   string | number;
  selected:  string | number;
  onToggle: (value: any) => void;
}

const TriToggleContainer = styled.div`
  min-width: 112px;
`;

const TriToggleButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0px;
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
`;

const TriToggle = (props: PropsData) => {
  const { label_0, label_1, label_2, value_0, value_1, value_2, selected, onToggle } = props;

  const onToggle0 = () => {
    if (selected === value_0) return;
    onToggle(value_0);
  };

  const onToggle1 = () => {
    if (selected === value_1) return;
    onToggle(value_1);
  };

  const onToggle2 = () => {
    if (selected === value_2) return;
    onToggle(value_2);
  };

  return (
    <TriToggleContainer>
      <TriToggleButtonContainer
        className={selected === value_0 ? 'active' : ''}
        onTouchEnd={onToggle0}
      >
        {label_0}
      </TriToggleButtonContainer>
      <TriToggleButtonContainer
        className={selected === value_1 ? 'active' : ''}
        onTouchEnd={onToggle1}
      >
        {label_1}
      </TriToggleButtonContainer>
      <TriToggleButtonContainer
        className={selected === value_2 ? 'active' : ''}
        onTouchEnd={onToggle2}
      >
        {label_2}
      </TriToggleButtonContainer>
    </TriToggleContainer>
  );
};

export default TriToggle;
