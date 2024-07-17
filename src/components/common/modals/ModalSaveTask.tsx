import TextInput from '@/components/common/input/TextInput';
import React, { PropsWithChildren, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import AlertModal from '../AlertModal';
import Field from '../Field';

interface ModalSaveTaskProps extends WithTranslation {
  isShow: boolean;
  callbackAction: (taskTitle: string) => void;
  callbackSubButton: () => void;

}
const ModalSaveTask = ({
  t,
  isShow,
  callbackAction,
  callbackSubButton,
  children,
}: PropsWithChildren<ModalSaveTaskProps>) => {
  const [taskTitle, setTaskTitle] = useState('');
  return (
    <AlertModal
      title={'บันทึกออเดอร์'}
      show={isShow}
      actionButtonLabel={'บันทึก'}
      onActionButtonTap={() => callbackAction(taskTitle)}
      subButtonLabel={'ยกเลิก'}
      onSubButtonTap={callbackSubButton}
    >
      <Field
        label="ชื่อออเดอร์"
        slot={
          <TextInput
            value={undefined}
            label={''}
            onChange={setTaskTitle}
            keyboardPosition="middle"
          ></TextInput>
        }
      />
      {children}
    </AlertModal>
  );
};

export default withTranslation()(ModalSaveTask);
