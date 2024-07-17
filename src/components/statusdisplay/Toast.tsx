import React, { PropsWithChildren } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import styled from 'styled-components';
import styles from '@/styles/styles';
import CancelButton from '../common/buttons/CancelButton';
import IconButton from '../common/buttons/IconButton';
import { MdClose } from 'react-icons/md';

interface ToastProps extends WithTranslation{
}
interface ToastContainerProps {
  width: number;
}
const color1 = styles.colors.gray7;
const color2 = styles.colors.gray6;
const ToastContainer = styled.div<ToastContainerProps>`
  width: ${(props) => props.width}px;
  height: 100px;
  color: ${styles.colors.primary2};
  font-size: 20pt;
  font-weight: 600;

  position: fixed;
  bottom: 100px;
  left: 50%;
  margin-left: -${(props) => props.width / 2}px;
  background-color: ${styles.colors.gray7};
  display: flex;
  flex-direction: row;
    border: 1px solid ${styles.colors.gray4};
`;
const ToastContent = styled.div`
  flex: 1;
  display:flex;
  flex-direction: column;

  background-image: linear-gradient(
    45deg,
    ${color1} 25%,
    ${color2} 25%,
    ${color2} 50%,
    ${color1} 50%,
    ${color1} 75%,
    ${color2} 75%,
    ${color2} 100%
  );
  background-size: 56.57px 56.57px;
`;
const ToastText = styled.div`
  padding: 20px;
  flex: 1;
  justify-content:center;
`;
const ToastBar = styled.div`
  height: 10px;
  background-color: ${styles.colors.primary2};
  justify-content: center;
  width: 100%;
`;
const ToastControl= styled.div`
    width:100px;
    height:100px;
`

const Toast = ({ t, children }:PropsWithChildren<ToastProps>) => {
  return (
    <ToastContainer width={500}>
      <ToastContent>
        <ToastText>{children}</ToastText>
        <ToastBar></ToastBar>
      </ToastContent>
      <ToastControl>
        <IconButton
          width={100}
          height={100}
          noMargin
          large
          icon={<MdClose />}
        />
      </ToastControl>
    </ToastContainer>
  );
};

export default withTranslation()(Toast);
