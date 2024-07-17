import React, { useState } from 'react';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { IconContext } from 'react-icons';
import { AiOutlineWarning } from 'react-icons/ai';

import styles from '@/styles/styles';
import lightcurtain from '@/assets/icons/lightcurtain.svg';
import AlertModal from '@/components/common/AlertModal';
import { statusState, viewState } from '@/store';
import Field from '../Field';

const FieldBody = styled.div`
  display: flex;
  align-items: left;
  font-size: 24px;
`;

const AlarmContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentImgWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-content: left;
`;

const AlarmDetailWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
interface ModalAlarmProps extends WithTranslation {
  callbackAction: () => any;
  callbackSubButton?: () => any;
}
const ModalAlarm = ({
  t,
  callbackAction,
  callbackSubButton,
}: ModalAlarmProps) => {
  const [status, setStatus] = useRecoilState(statusState);
  const [view, setView] = useRecoilState(viewState);

  const latestStatus = status.lastHeartBeatMessage;
  // console.log("heartbeat",status.lastHeartBeatMessage)
  return (
    <AlertModal
      title={`สัญญาณเตือน ${latestStatus?.alarm?.detail.code}`}
      show={view.showAlarmModal}
      actionButtonLabel={'รีเซ็ต'}
      onActionButtonTap={() => {
        callbackAction();
      }}
      actionButtonType="danger"
    >
      <AlarmContent>
        <ContentImgWrap>
          <IconContext.Provider
            value={{
              style: {
                color: styles.colors.danger1,
                width: '170px',
                height: '170px',
              },
            }}
          ><br></br>
            <AiOutlineWarning />
          </IconContext.Provider>
          <AlarmDetailWrap>
            {' '}
            <Field
              label={'รหัส'}
              slot={<FieldBody>{latestStatus?.alarm?.detail.code}</FieldBody>}
              info
              labelCol={4}
            />
            <Field
              label={'สัญญาณ'}
              slot={<FieldBody>{latestStatus?.alarm?.detail.name}</FieldBody>}
              info
              labelCol={4}
            />
            <Field
              label={'เวลา'}
              slot={<FieldBody>{latestStatus?.alarm?.detail.time}</FieldBody>}
              info
              labelCol={4}
            />
            <Field
              label={'ประเภท'}
              slot={<FieldBody>{latestStatus?.alarm?.detail.type}</FieldBody>}
              info
              labelCol={4}
            />
            <Field
              label={'ข้อมูล'}
              slot={<FieldBody>{latestStatus?.alarm?.detail.data}</FieldBody>}
              info
              labelCol={4}
            />
          </AlarmDetailWrap>
        </ContentImgWrap>
      </AlarmContent>
    </AlertModal>
  );
};

export default withTranslation()(ModalAlarm);
