import styles from '@/styles/styles';
import { NaNDisplay } from '@/util/numberDisplayUtils';
import { cloneDeep } from 'lodash';
import React, { PropsWithChildren } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import styled from 'styled-components';

String.prototype.replaceBr = function(f){
  return this.split('{br}').flatMap((e, i) => [e, <br key={i}/>]).slice(0, -1)
}

interface VerticalPercentBarProps extends WithTranslation {
  percent: number;
  color?: string;
  label?:string;
}
interface VerticalPercentBarContainerProps {
  //width: number;
}
//width:${(props) => props.width};
const VerticalPercentBarContainer = styled.div<VerticalPercentBarContainerProps>`
  height: 200px;
  position: relative;
  z-index: 8;
  right: 0px;
`;
interface PercentFillProps {
  percent: number; //0-1
  color: string;
}
const PercentFill = styled.div<PercentFillProps>`
  width: 100px;
  height: ${(props) => props.percent * 200}px;
  background-color: ${(props) => props.color};
  position: absolute;
  bottom: 0px;
  z-index: 9;
`;
interface PercentTextProps {
  color: string;
}
const PercentText = styled.div<PercentTextProps>`
  width: 100px;
  font-size: 50px;
  text-align: right;
  color: ${(props) => props.color};
  mix-blend-mode: difference;
  line-height: 50px;
  z-index: 10;
  height: 200px;
  position: absolute;
  bottom: 0px;
`;

const PercentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  z-index: 0;
  width: 150px;
  margin: 10px 10px 10px 0px;
`;
const PercentLabel = styled.div`
  font-size: 20px;
  width: 135px;
  text-align: left;
`;
const VerticalPercentBar = ({
  t,
  color = styles.colors.gray2,
  percent,
  label,
  children,
}: PropsWithChildren<VerticalPercentBarProps>) => {
  return (
    <PercentContainer>
      <PercentLabel>{label.replaceBr()}</PercentLabel>
      <VerticalPercentBarContainer>
        <PercentFill percent={percent} color={color}>
          <PercentText color={color}>
            {children}
            {children === undefined && (
              <>
                {' '}
                {NaNDisplay(Math.floor(percent * 100))}
                <br />%
              </>
            )}
          </PercentText>
        </PercentFill>
      </VerticalPercentBarContainer>
    </PercentContainer>
  );
};

export default withTranslation()(VerticalPercentBar);
