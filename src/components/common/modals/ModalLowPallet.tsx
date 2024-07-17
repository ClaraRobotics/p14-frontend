
import React, { useState } from 'react';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { IconContext } from 'react-icons';
import { AiOutlineWarning } from 'react-icons/ai';

import styles from '@/styles/styles';
import lightcurtain from '@/assets/icons/lightcurtain.svg';
import AlertModal from '@/components/common/AlertModal';
import { viewState } from '@/store';

const LowPalletContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentImgWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
`;

interface ModalLowPalletProps extends WithTranslation {
  callbackAction: () => any;
  callbackSubButton?: () => any;
}
const ModalLowPallet = ({
  t,
  callbackAction,
  callbackSubButton,
}: ModalLowPalletProps) => {
  const [view, setView] = useRecoilState(viewState);
  return (
    <AlertModal
      title={'พาเล็ตใกล้หมด'}
      show={view.showLowPalletModal}
      actionButtonLabel={'ตกลง'}
      onActionButtonTap={() => {
        callbackAction();
      }}
      actionButtonType="primary"
    >
      <LowPalletContent></LowPalletContent>
    </AlertModal>
  );
};

export default withTranslation()(ModalLowPallet);
