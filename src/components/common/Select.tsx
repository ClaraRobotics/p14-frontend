import React from 'react';
import styled from 'styled-components';

import styles from '@/styles/styles';

interface Option {
  label: string;
  value: string;
}

interface PropsData {
  selected: string;
  options: Option[];
  onSelect: (value: string) => void;
}

const SelectItemContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 36px;
  font-family: 'pt-prime';
  font-size: 20px;
  padding: 0 12px;
  font-weight: bold;
  background-color: var(--btn-background);
  color: var(--btn-text);
  border: none;
  border-left: solid 2px var(--btn-border);
  margin: 8px 0;
  --btn-border: ${styles.colors.gray5};
  --btn-background: ${styles.colors.gray6};
  --btn-text: ${styles.colors.gray2};

  &.active {
    --btn-border: transparent;
    --btn-background: ${styles.colors.white};
    --btn-text: ${styles.colors.gray8};
  }

  &:first-child {
    --btn-border: transparent;
  }
`;

const Select = (props: PropsData) => {
  const { selected, options, onSelect } = props;

  return (
    <div>
      {options.map(({ label, value }) => (
        <SelectItemContainer
          className={selected === value ? 'active' : ''}
          onTouchEnd={() => onSelect(value)}
        >
          {label}
        </SelectItemContainer>
      ))}
    </div>
  );
};

export default Select;
