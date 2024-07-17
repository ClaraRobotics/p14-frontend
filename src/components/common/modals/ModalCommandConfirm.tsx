import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import AlertModal from '../AlertModal';

interface ModalCommandConfirmProps extends WithTranslation {
  isShow: boolean;
  callbackAction: () => {};
}
const ModalCommandConfirm = ({
  t,
  isShow,
  callbackAction,
}: ModalCommandConfirmProps) => {
  return (
    <AlertModal
      title={"command confirm"}
      show={isShow}
      actionButtonLabel={t('common.ok')}
      onActionButtonTap={callbackAction}
    >
      {"command confirm content"}
    </AlertModal>
  );
};

export default withTranslation()(ModalCommandConfirm);
