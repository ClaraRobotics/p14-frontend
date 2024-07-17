import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import styled from 'styled-components';

interface TemplateProps extends WithTranslation {}
interface TemplateContainerProps {
  //width: number;
}
//width:${(props) => props.width};
const TemplateContainer = styled.div<TemplateContainerProps>`

  height:100px;
  background-color:purple
  position:fixed;
  bottom:100mm;
  left:calc(vw - 250px);
`;
const Template = ({ t }: TemplateProps) => {
  return <TemplateContainer>Template</TemplateContainer>;
};

export default withTranslation()(Template);
