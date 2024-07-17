import styles from '@/styles/styles';
import React from 'react';
import { WithTranslation,withTranslation} from 'react-i18next';
import styled from 'styled-components'


interface NumberDisplayProps extends WithTranslation {
  value: string;
  label: string;
  plus?: boolean;
}
interface NumberDisplayContainerProps{

}
 //width:${props=>props.width};
const NumberDisplayContainer = styled.div<NumberDisplayContainerProps>`

  height:100px;
  background-color:purple
  position:fixed;
  bottom:100mm;
  left:calc(vw - 250px);
`;
const NumberContainer = styled.div`
  font-weight:700;
  font-size:35px;
  line-height:35px;
  color:${styles.colors.gray2};
`;
const LabelContainer = styled.div`
  font-size:20px;

`;
const NumberDisplay = ({ t, value, label, plus }: NumberDisplayProps) => {
  return (
    <NumberDisplayContainer>
      <LabelContainer>{label}</LabelContainer>
      <NumberContainer>{plus && parseInt(value) > 0 ? '+' : ''}{value}</NumberContainer>
    </NumberDisplayContainer>
  );
};

export default withTranslation()(NumberDisplay);
