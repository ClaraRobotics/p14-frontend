import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import AlertModal from '../AlertModal';
import emergency_icon from '@/assets/icons/emer_stopped.svg';
import styled from 'styled-components';

interface ModalReleaseEmerProps extends WithTranslation {
  isShow: boolean;
  callbackAction: () => void;
}
const EmergencyStoppedIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const EmergencyStoppedText = styled.div`
  text-align: center;
  font-size: 20pt;
  padding:10px;
`;
const ModalReleaseEmer = ({
  t,
  isShow,
  callbackAction,
}: ModalReleaseEmerProps) => {
  return (
    <AlertModal
      title={t('alert.emergency_stop')}
      show={isShow}
      actionButtonLabel={t('common.ok')}
      onActionButtonTap={callbackAction}
    >
      <EmergencyStoppedIconWrap>
        <img src={emergency_icon} width={200}></img>
      </EmergencyStoppedIconWrap>
      <EmergencyStoppedText>
        {t('alert.please_release_emergency')}
      </EmergencyStoppedText>
    </AlertModal>
  );
};

export default withTranslation()(ModalReleaseEmer);
