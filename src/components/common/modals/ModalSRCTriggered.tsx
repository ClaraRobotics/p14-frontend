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

const IntrusionDetectedContent = styled.div`
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

interface ModalIntrusionDetectedProps extends WithTranslation {
  callbackAction: () => any;
  callbackSubButton?: () => any;
}
const ModalIntrusionDetected = ({
  t,
  callbackAction,
  callbackSubButton,
}: ModalIntrusionDetectedProps) => {
  const [view, setView] = useRecoilState(viewState);
  return (
    <AlertModal
      title={'PRE COLLISION WARNING!'}
      show={view.showIntrusionDetectedModal}
      actionButtonLabel={'ACKNOWLEDGE'}
      onActionButtonTap={() => {
        callbackAction();
      }}
      actionButtonType="danger"
    >
      <IntrusionDetectedContent>
        <ContentImgWrap>
          <img src={lightcurtain} width={400}></img>
          <IconContext.Provider
            value={{
              style: {
                color: styles.colors.danger1,
                width: '170px',
                height: '170px',
                marginLeft: '50px',
                marginTop: '70px',
              },
            }}
          >
            <AiOutlineWarning />
          </IconContext.Provider>
        </ContentImgWrap>
        <br></br>
      </IntrusionDetectedContent>
    </AlertModal>
  );
};

export default withTranslation()(ModalIntrusionDetected);
