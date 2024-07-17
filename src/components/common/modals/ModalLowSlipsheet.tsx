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

const LowSlipSheetContent = styled.div`
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

interface ModalLowSlipSheetProps extends WithTranslation {
  callbackAction: () => any;
  callbackSubButton?: () => any;
}
const ModalLowSlipSheet = ({
  t,
  callbackAction,
  callbackSubButton,
}: ModalLowSlipSheetProps) => {
  const [view, setView] = useRecoilState(viewState);
  return (
    <AlertModal
      title={'LOW SLIP SHEET'}
      show={view.showLowSlipSheetModal}
      actionButtonLabel={'ACKNOWLEDGE'}
      onActionButtonTap={() => {
        callbackAction();
      }}
      actionButtonType="primary"
    >
      <LowSlipSheetContent></LowSlipSheetContent>
    </AlertModal>
  );
};

export default withTranslation()(ModalLowSlipSheet);
