import React, { FunctionComponent, MutableRefObject } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import styled from 'styled-components';

import styles from '@/styles/styles';

interface IProps {
  onChange: (input: string) => void;
  onFocus: any;
  keyboardRef: MutableRefObject<typeof Keyboard>;
}
const KeyboardContainer = styled.div`
  z-index: 99;
  div, button {
    border: none !important;
    border-radius: 0 !important;
  }
  .hg-theme-default {
    background-color: ${styles.colors.gray7};
    border-radius: 5px;
    box-sizing: border-box;
    overflow: hidden;
    padding: 5px;
    touch-action: manipulation;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 100%;
  }

  .numeric {
    position: absolute;
    top: 8px;
    width: 300px;
    left: -150px;
  }
  .numericOnRight {
    width: 400px;
    left: -200px;
  }
  .large {
    left: 0px;
    width: 1000px;
  }

  .hg-theme-default .hg-button span {
    pointer-events: none;
  }
  .hg-theme-default button.hg-button {
    border-width: 0;
    font-size: 20px;
    outline: 0;
  }
  .hg-theme-default .hg-button {
    display: inline-block;
    flex-grow: 1;
  }
  .hg-theme-default .hg-row {
    display: flex;
  }
  .hg-theme-default .hg-row:not(:last-child) {
    margin-bottom: 4px;
  }
  .hg-theme-default .hg-row .hg-button:not(:last-child) {
    margin-right: 4px;
  }
  .hg-theme-default .hg-row .hg-button-container {
    margin-right: 4px;
  }
  .hg-theme-default .hg-row > div:last-child {
    margin-right: 0;
  }
  .hg-theme-default .hg-row .hg-button-container {
    display: flex;
  }
  .hg-theme-default .hg-button {
    -webkit-tap-highlight-color: ${styles.colors.gray5};
    align-items: center;
    background: ${styles.colors.gray6};
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    height: 60px;
    justify-content: center;
    padding: 4px;
    font-size: 20px;
    font-weight: 600;
    color: ${styles.colors.gray2};
  }
  .hg-theme-default .hg-button.hg-standardBtn {
    width: 20px;
  }
  .hg-theme-default .hg-button.hg-activeButton {
    background: #efefef;
  }
  .hg-theme-default.numeric .hg-button {
    align-items: center;
    display: flex;
    height: 60px;
    justify-content: center;
    width: 33.3%;
  }
  .hg-theme-default.numeric .hg-button.hg-standardBtn[data-skbtn='0'] {
    width: 66.6%;
  }
  .hg-theme-default .hg-button.hg-button-numpadadd,
  .hg-theme-default .hg-button.hg-button-numpadenter {
    height: 85px;
  }
  .hg-theme-default .hg-button.hg-button-numpad0 {
    width: 105px;
  }
  .hg-theme-default .hg-button.hg-button-com {
    max-width: 85px;
  }
  .hg-theme-default .hg-button.hg-standardBtn.hg-button-at {
    max-width: 45px;
  }
  .hg-theme-default .hg-button.hg-selectedButton {
    background: rgba(5, 25, 70, 0.53);
    color: #fff;
  }
  .hg-theme-default .hg-button.hg-standardBtn[data-skbtn='.com'] {
    max-width: 82px;
  }
  .hg-theme-default .hg-button.hg-standardBtn[data-skbtn='@'] {
    max-width: 60px;
  }
  .hg-candidate-box {
    background: #ececec;
    border-bottom: 2px solid #b5b5b5;
    border-radius: 5px;
    display: inline-flex;
    margin-top: -10px;
    max-width: 272px;
    position: absolute;
    transform: translateY(-100%);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  ul.hg-candidate-box-list {
    display: flex;
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li.hg-candidate-box-list-item {
    align-items: center;
    display: flex;
    height: 40px;
    justify-content: center;
    width: 40px;
  }
  li.hg-candidate-box-list-item:hover {
    background: rgba(0, 0, 0, 0.03);
    cursor: pointer;
  }
  li.hg-candidate-box-list-item:active {
    background: rgba(0, 0, 0, 0.1);
  }
  .hg-candidate-box-prev:before {
    content: '◄';
  }
  .hg-candidate-box-next:before {
    content: '►';
  }
  .hg-candidate-box-next,
  .hg-candidate-box-prev {
    align-items: center;
    background: #d0d0d0;
    color: #969696;
    cursor: pointer;
    display: flex;
    padding: 0 10px;
  }
  .hg-candidate-box-next {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }
  .hg-candidate-box-prev {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  .hg-candidate-box-btn-active {
    color: #444;
  }
`;

const KeyboardWrapper: FunctionComponent<IProps> = ({
  onChange,
  onFocus,
  keyboardRef,
  ...rest
}) => {
  return (
    <KeyboardContainer>
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        {...rest}
        onChange={onChange}
        onFocus={onFocus}
        display={{ '{bksp}': '⌫',
          '{space}': ' ' }
        }
      />
    </KeyboardContainer>
  );
};

export default KeyboardWrapper;
