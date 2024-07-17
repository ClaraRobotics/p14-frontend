import { statusState, viewState } from '@/store';
import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import AlertModal from '../AlertModal';
import empty_pallet_load from '@/assets/icons/empty_pallet_load.svg';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { AiOutlineWarning } from 'react-icons/ai';
import styles from '@/styles/styles';
import Row from '../Row';

const PalletConfirmContent = styled.div`
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
interface ModalPalletNotEmptyProps extends WithTranslation {
  callbackAction: () => any;
  callbackSubButton: () => any;
}
const ModalPalletNotEmpty = ({
  t,
  callbackAction,
  callbackSubButton,
}: ModalPalletNotEmptyProps) => {
  const [view, setView] = useRecoilState(viewState);
  return (
    <AlertModal
      title={'WARNING! COLLISION POSSIBILITIES'}
      show={view.showPalletNotEmptyModal}
      actionButtonLabel={'Eject pallet'}
      onActionButtonTap={() => {
        callbackAction();
      }}
      subButtonLabel={'Cancel'}
      onSubButtonTap={() => callbackSubButton()}
    >
      <PalletConfirmContent>
        <ContentImgWrap>
          <img src={empty_pallet_load} width={200}></img>
          <IconContext.Provider
            value={{
              style: {
                color: styles.colors.danger1,
                width: '170px',
                height: '170px',
                marginLeft: '50px',
                marginTop: '45px',
              },
            }}
          >
            <AiOutlineWarning />
          </IconContext.Provider>
        </ContentImgWrap>
        <br></br>
        THE PALLET IS NOT EMPTY. PLEASE EJECT BEFORE PROCEEDING.
      </PalletConfirmContent>
    </AlertModal>
  );
};

export default withTranslation()(ModalPalletNotEmpty);
