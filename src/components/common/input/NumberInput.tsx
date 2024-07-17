import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Popover } from 'react-tiny-popover';
import styled from 'styled-components';

import KeyboardWrapper from '@/components/common/keyboard/KeyboardWrapper';
import styles from '@/styles/styles';


interface InputStyledProps {
  error: boolean;
}
const KeyboardContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  &.top {
    top: -450px;
  }
  &.middle {
    left: -500px;
  }
`;

const NumberInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Input = styled.input.attrs({ type: 'number' })<InputStyledProps>`
  caret-color: transparent;
  width: 120px;
  border-bottom: solid 4px
    ${(props) => (props.error ? styles.colors.danger1 : styles.colors.gray4)};
  background-color: transparent;
  color: ${styles.colors.gray2};
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  transition-duration: ${styles.transition.transitionDuration};
  transition-timing-function: ${styles.transition.timingFunction};

  ::placeholder {
    color: ${styles.colors.gray6};
    font-size: 20px;
  }

  &:focus {
    border-bottom: solid 4px ${styles.colors.primary1};
    color: ${styles.colors.white};
  }

  &.focused {
    border-bottom: solid 4px ${styles.colors.primary1};
    color: ${styles.colors.white};
  }
`;
const Label = styled.div`
  font-size: 18px;
`;

const Label2 = styled.div`
  font-size: 18px;
  color: ${styles.colors.gray4};
`;

interface PropsData {
  value: string | undefined;
  overrideText?: string;
  label: string;
  label2?: string;
  error?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: any;
  onFocus?: any;
  keyboardPosition?: 'top' | 'bottom' | 'middle';
  parentElement?: any;
}

const NumberInput = (props: PropsData) => {
  const {
    value,
    label,
    label2,
    placeholder,
    error,
    onChange,
    onBlur = () => {},
    onFocus = () => {},
    keyboardPosition = '',
  } = props;
  const [inputValue, setInputValue] = useState(value);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const keyboardRef = useRef(null);

  useEffect(() => {
    setInputValue(props.value);
    if (keyboardRef.current !== null) {
      keyboardRef.current.setInput(value);
    }
  }, [value]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onChangeValue = event.target.value;
    if (keyboardRef.current !== null) {
      keyboardRef.current.setInput(value);
    }
    setInputValue(onChangeValue);
    onChange(onChangeValue);
  };

  let valueTodisplay = inputValue === undefined ? '' : inputValue;
  if (props.overrideText !== undefined && props.overrideText !== '') {
    valueTodisplay = props.overrideText;
  }
  if (showKeyboard) {
    if (keyboardRef.current != null) {
      keyboardRef.current.setInput(value);
    }
  }
  return (
    <div>
      <Popover
        isOpen={showKeyboard}
        positions={['bottom', 'top']}
        reposition
        onClickOutside={() => {
          if (setShowKeyboard) {
            setShowKeyboard(false);
          }
        }}
        containerStyle={{ zIndex: '100' }}
        content={
          <KeyboardWrapper
            keyboardRef={keyboardRef}
            layout={{
              default: ['7 8 9', '4 5 6', '1 2 3', '0 {bksp}'],
            }}
            theme={'hg-theme-default hg-layout-default numeric'}
            onChange={(value: string) => {
              setInputValue(value);
              onChange(value);
            }}
          />
        }
      >
        <NumberInputContainer>
          <Input
            className={showKeyboard ? 'focused' : ''}
            inputMode={'none'}
            value={valueTodisplay}
            error={!!error}
            placeholder={placeholder || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onInputChange(e);
            }}
            onBlur={() => {
              onBlur();
            }}
            onFocus={() => {
              onFocus();
              setInputValue(value);
              setShowKeyboard(true);
            }}
          />

          <Label>{label}</Label>
          <Label2>{label2}</Label2>
        </NumberInputContainer>
      </Popover>
    </div>
  );
};

export default NumberInput;
