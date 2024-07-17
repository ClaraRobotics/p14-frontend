import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import styles from '@/styles/styles';
import { Popover } from 'react-tiny-popover';
import KeyboardWrapper from '../keyboard/KeyboardWrapper';

interface InputStyledProps {
  error: boolean;
  capslockOnly: boolean;
}

const KeyboardContainer = styled.div`
  position: absolute;
  left: -200px;
  top: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 99;
  &.top {
    top: -450px;
  }
  &.middle{
    left:-500px;
  }
`;
const TextInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input.attrs({ type: 'text' })<InputStyledProps>`
  min-width: 300px;
  border-bottom: solid 4px
    ${(props) => (props.error ? styles.colors.danger1 : styles.colors.gray4)};
  background-color: transparent;
  color: ${styles.colors.gray2};
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  transition-duration: ${styles.transition.transitionDuration};
  transition-timing-function: ${styles.transition.timingFunction};
  caret-color: transparent;
  ::placeholder {
    color: ${styles.colors.gray6};
    font-size: 24px;
  }

  &:focus {
    border-bottom: solid 4px ${styles.colors.primary1};
    color: ${styles.colors.white};
  }
`;

const Label = styled.div`
  font-size: 20px;
`;
const Label2 = styled.div`
  font-size: 20px;
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
}

const TextInput = (props: PropsData) => {
  const {
    value,
    label,
    label2,
    placeholder,
    error,
    onChange,
    onBlur = () => {},
    onFocus = () => {},
    keyboardPosition,
  } = props;
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(props.value);
  }, [value]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onChangeValue = event.target.value;

    setInputValue(onChangeValue);
    onChange(onChangeValue);
  };
  const keyboardRef = useRef(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  let valueTodisplay = inputValue === undefined ? '' : inputValue;
  if (props.overrideText !== undefined && props.overrideText !== '') {
    valueTodisplay = props.overrideText;
  }
  return (
    <div>
      <Popover
        isOpen={showKeyboard}
        onClickOutside={() => {
          if (setShowKeyboard) {
            setShowKeyboard(false);
          }
        }}
        containerStyle={{ zIndex: '100' }}
        content={
          <KeyboardContainer className={keyboardPosition}>
            <KeyboardWrapper
              syncInstanceInputs={true}
              keyboardRef={keyboardRef}
              debug={true}
              layout={{
                default: [
                  '- / , ( )',
                  'Q W E R T Y U I O P',
                  'A S D F G H J K L',
                  ' Z X C V B N M {bksp}',
                  '{space}',
                ],
              }}
              theme={'hg-theme-default hg-layout-default large'}
              onChange={(value: string) => {
                setInputValue(value);
                onChange(value);
              }}
            />
            <KeyboardWrapper
              keyboardRef={keyboardRef}
              syncInstanceInputs={true}
              layout={{
                default: ['7 8 9', '4 5 6', '1 2 3', '0 {bksp}'],
              }}
              theme={'hg-theme-default hg-layout-default numericOnRight'}
              onChange={(value: string) => {
                setInputValue(value);
                onChange(value);
              }}
            />
          </KeyboardContainer>
        }
      >
        <TextInputContainer>
          <Input
            value={valueTodisplay}
            error={!!error}
            placeholder={placeholder || ''}
            onChange={onInputChange}
            onBlur={onBlur}
            onFocus={() => {
              onFocus();
              setShowKeyboard(true);
            }}
          />
          <Label>{label}</Label>
          <Label2>{label2}</Label2>
        </TextInputContainer>
      </Popover>
    </div>
  );
};

export default TextInput;
