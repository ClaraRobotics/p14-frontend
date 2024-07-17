import React, { TouchEventHandler } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { useHistory } from 'react-router';

import PatternPreview from './PatternPreview';

import styles from '@/styles/styles';
import api from '@/api';
import { systemState } from '@/store';
import { Task } from '@/types/task';
import { WithTranslation, withTranslation } from 'react-i18next';
import OnTapWrapper from '../common/buttons/OnTapWrapper';
import Button from '@/components/common/buttons/Button';
import { IoIosTrash } from 'react-icons/io';

interface PropsData extends WithTranslation {
  task: Task;
  onTap?: React.TouchEventHandler;
}

const Container = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  padding: 24px 0;
  border-bottom: 1px solid ${styles.colors.gray5};
`;

const Name = styled.h2`
  color: ${styles.colors.gray3};
  margin: 0;
`;

const Id = styled.div`
  color: ${styles.colors.gray5};
  margin-bottom: 12px;
`;

const GeneralInfo = styled.div`
  color: ${styles.colors.gray4};
  font-size: 18px;
`;

const TaskItem = (props: PropsData) => {
  const { t, task, onTap } = props;
  const { taskId, taskTitle, widthX, heightY, layerHeight, boxes, boxAmount } =
    task;
  const history = useHistory();
  const onCancel = () => history.push('/');

  return (
    <OnTapWrapper onTap={onTap}>
      <Container>
        <Button
          style={{ position: 'absolute', top: 30, right: 50 }}
          disabled={false}
          frontIcon={<IoIosTrash />}
          label={'Delete'}
          onTap={() => {
            api
              .post('/delete/task', { taskId })
              .then((res: any) => { onCancel() });
          }}
        />
        <Name>{taskTitle}</Name>
        <Id>id: {taskId}</Id>
        <GeneralInfo>
          {`${t('tasklist.info.boxdimension')}: ${widthX} x ${heightY} ${t(
            'common.mm'
          )}`}
          &nbsp;|&nbsp;
          {`${t('tasklist.info.layerheight')}: ${layerHeight}`}
        </GeneralInfo>
        <GeneralInfo>
          {t('tasklist.info.boxperlayer').replace(
            '{number}',
            String(boxes.length)
          )}
        </GeneralInfo>
        <GeneralInfo>Total:{String(boxAmount)}</GeneralInfo>
      </Container>
    </OnTapWrapper>
  );
};

export default withTranslation()(TaskItem);
