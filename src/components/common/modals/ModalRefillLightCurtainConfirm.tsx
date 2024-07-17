import React, { useState } from 'react';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { IconContext } from 'react-icons';
import { AiOutlineWarning } from 'react-icons/ai';

import styles from '@/styles/styles';
import greenlight_ok from '@/assets/icons/greenlight_ok.svg';
import pressyellowbutton from '@/assets/icons/pressyellowbutton.svg';
import AlertModal from '@/components/common/AlertModal';
import { statusState, viewState } from '@/store';

const RefillLightCurtainConfirmContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentImgWrap = styled.div`
display:grid;
place-items:center;
`;

const ContentText = styled.div`
  width:100%;
  text-align:center;
  font-size:30px;`;

interface ModalRefillLightCurtainConfirmProps extends WithTranslation {
  // callbackAction: () => any;
  // callbackSubButton?: () => any;
}
const ModalRefillLightCurtainConfirm = ({
  t,
  // callbackAction,
  // callbackSubButton,
}: ModalRefillLightCurtainConfirmProps) => {
  const [status, setStatus] = useRecoilState(statusState);
  const [view, setView] = useRecoilState(viewState);

  const latestStatus = status.lastHeartBeatMessage;

  return (
    <AlertModal
      title={'เติมพาเล็ต / แผ่นคั่น'}
      show={latestStatus?.refillMode}
    >
      <ContentText>{
        latestStatus?.refillSafe ?
          <div>กดปุ่มเหลืองเมื่อออกมานอกกรงแล้ว<br/>&nbsp;</div>
          :
          <div>โปรดรอสัญญาณไฟเขียวก่อนเข้าไปเติมพาเล็ต / แผ่นคั่น<br/>หรือกดปุ่มสีเหลืองเพื่อยกเลิก</div>
      }
</ContentText>
      <br/><br/>

      {
        latestStatus?.refillSafe ?
          <ContentImgWrap>
            <img src={pressyellowbutton} width={300}></img>
          </ContentImgWrap>
          :
          <ContentImgWrap>
            <img src={greenlight_ok} width={300}></img>
          </ContentImgWrap>
      }
    </AlertModal>
  );
};

export default withTranslation()(ModalRefillLightCurtainConfirm);
