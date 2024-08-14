import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import Button from '../common/buttons/Button';

import Clock from '@/components/navBar/Clock';
import LangOptions from '@/components/navBar/LangOptions';
import StatusBar from '@/components/navBar/StatusBar';
import StatusLightBar from '@/components/navBar/StatusLightBar';
import StartPauseButtons from '@/components/controlCenter/StartPauseButtons';
import claralogo from '@/assets/icons/claralogo.svg';

import styles from '@/styles/styles';

interface NavBarContainerProps {
  noMargin: boolean;
}

const NavBarContainer = styled.div<NavBarContainerProps>`
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 1 72px;
  padding: 0 16px;
  margin-bottom: ${(props) => (props.noMargin ? '0px' : '40px')};
  border-bottom: 1px solid ${styles.colors.gray6};
  background-color: ${styles.colors.gray8};
`;

const NavBar = ({noMargin}) => {
  const history = useHistory();
  
  return (
    <div>
      <StatusLightBar />
      <NavBarContainer noMargin={noMargin}>
        <img src={claralogo} height={80}></img>

        {noMargin ? <Button label="back to main" onTap={() => history.push('/')}/> : null}

        <StatusBar />
        <Clock />
        <LangOptions />
      </NavBarContainer>
    </div>
  );
};

export default NavBar;
