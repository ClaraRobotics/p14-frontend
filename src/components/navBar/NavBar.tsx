import React from 'react';
import styled from 'styled-components';

import Clock from '@/components/navBar/Clock';
import LangOptions from '@/components/navBar/LangOptions';
import StatusBar from '@/components/navBar/StatusBar';
import StatusLightBar from '@/components/navBar/StatusLightBar';
import StartPauseButtons from '@/components/controlCenter/StartPauseButtons';
import claralogo from '@/assets/icons/claralogo.svg';

import styles from '@/styles/styles';

const NavBarContainer = styled.div`
  width: 100%;
  height: 72px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 1 72px;
  padding: 0 16px;
  margin-bottom: 40px;
  border-bottom: 1px solid ${styles.colors.gray6};
  background-color: ${styles.colors.gray8};
`;

const NavBar = () => {
  return (
    <div>
      <StatusLightBar />
      <NavBarContainer>
        <img src={claralogo} height={80}></img>
        <StatusBar />
        <Clock />
        <LangOptions />
      </NavBarContainer>
    </div>
  );
};

export default NavBar;
