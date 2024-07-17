import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import { viewState, viewActions } from '@/store';

import styles from '@/styles/styles';
const ButtonContainer = styled.div`
  min-width: 120px;
  height: 48px;
  box-sizing: border-box;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  display: flex;
  justify-content: center;
  padding: 10px;
  align-items: center;
  position: absolute;
  background-color: ${styles.colors.primary1};
  color: ${styles.colors.gray8};
  font-size: 18px;
  font-weight: 600;
  bottom: 0;
  left: calc(50% - 60px);
`;

const ControlCenterButton = ({ t }: WithTranslation) => {
  const [view, setView] = useRecoilState(viewState);
  const location = useLocation();

  const onTap = () => {
    viewActions.toggleControlCenter(view, setView, true);
  };
  return location.pathname === '/' ? null : (
    <ButtonContainer onTouchEnd={onTap}>
      {t('controlcenter.control.title')}
    </ButtonContainer>
  );
};

export default withTranslation()(ControlCenterButton);
