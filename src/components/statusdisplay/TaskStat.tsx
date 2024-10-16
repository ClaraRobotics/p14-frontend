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


interface TaskStatContainerProps{
  line_index:number
}
const TaskStatContainer= styled.div<TaskStatContainerProps>`
  font-size: 15pt;
  min-height: 200px;
  margin-left:  ${(props) => props.line_index==1?"50px":"0px"};
`;
const TaskStatLabel = styled.div``;
const TaskStatValue = styled.div``;
const PatternPreviewWrapper = styled.div`
  zoom: 0.1;
`;


interface TaskStatProps extends WithTranslation {
  line_index: number;
}
const TaskStat = ({ t ,line_index}: TaskStatProps) => {
  const history = useHistory();

  const [status, setStatus] = useRecoilState(statusState);
  const [task, setTask] = useRecoilState(taskState);
  const latestStatus = status.lastHeartBeatMessage;

  const isThereCurrenTask = useRecoilValue(line_index==0?statusSelectors.isThereCurrentTaskA:statusSelectors.isThereCurrentTaskB);
  
  let currentPattern = [];
  try {
    currentPattern = status.currentTask[line_index].stackCenter[0];
  } catch (err) {
    currentPattern = [];
  }
  return (
    <>
      {!isThereCurrenTask ? (
        <TaskStatContainer line_index={line_index}>
          {t('taskstatus.no_task_assigned')}
        </TaskStatContainer>
      ) : (
        <TaskStatContainer line_index={line_index}>
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
          ขนาด:{status?.currentTask[line_index]?.widthX}x{status?.currentTask[line_index]?.heightY}x
          {status?.currentTask[line_index]?.layerHeight}
          <br/>
          ชื่อออเดอร์: {status[line_index]?.taskTitle}
        </TaskStatContainer>
      )}
    </>
  );
};
export default withTranslation()(TaskStat);
