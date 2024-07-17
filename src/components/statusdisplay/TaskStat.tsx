import React from 'react';
import { useHistory } from 'react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import { statusState, statusActions, taskSelectors } from '@/store';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { taskActions, taskState, systemState } from '@/store';
import { NaNDisplay } from '@/util/numberDisplayUtils';
import PatternPreview from '../taskBuilder/PatternPreview';
import { isEmpty } from 'lodash';
import Button from '../common/buttons/Button';
import { statusSelectors } from '@/store/status';
const TaskStatContainer = styled.div`
  font-size: 25pt;
  min-height: 300px;
`;
const TaskStatLabel = styled.div``;
const TaskStatValue = styled.div``;
const PatternPreviewWrapper = styled.div`
  zoom: 0.1;
`;
const TaskStat = ({ t }: WithTranslation) => {
  const history = useHistory();

  const [status, setStatus] = useRecoilState(statusState);
  const [task, setTask] = useRecoilState(taskState);
  const latestStatus = status.lastHeartBeatMessage;

  const isThereCurrenTask = useRecoilValue(statusSelectors.isThereCurrentTask);
  let currentPattern = [];
  try {
    currentPattern = status.currentTask.stackCenter[0];
  } catch (err) {
    currentPattern = [];
  }
  return (
    <>
      {!isThereCurrenTask ? (
        <TaskStatContainer>
          {t('taskstatus.no_task_assigned')}
        </TaskStatContainer>
      ) : (
        <TaskStatContainer>
          {/* Layer: {NaNDisplay(latestStatus?.finishLayerIdx + 1)}
          <br />
          Box: {NaNDisplay(latestStatus?.finishBoxIdx + 1)}
          <br />
          Total boxes:{' '}
          {NaNDisplay(
            latestStatus.finishLayerIdx *
              status.currentTask?.baseBoxes?.length +
              latestStatus.finishBoxIdx
          )}
          /{status?.currentTask?.boxAmount}
          <br /> */}
          <PatternPreviewWrapper>
            <PatternPreview boxes={currentPattern} />
          </PatternPreviewWrapper>
          ขนาด:{status?.currentTask?.widthX}x{status?.currentTask?.heightY}x
          {status?.currentTask?.layerHeight}
          <br/>
          ชื่อออเดอร์: {status?.taskTitle}
        </TaskStatContainer>
      )}
    </>
  );
};
export default withTranslation()(TaskStat);
