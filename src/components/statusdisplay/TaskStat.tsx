import React, { useEffect } from 'react';
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


interface TaskStatContainerProps {
  line_index: number
}
const TaskStatContainer = styled.div<TaskStatContainerProps>`
  font-size: 14pt;
  width: 300px;
  height: 300px;
  margin-left:  ${(props) => props.line_index == 1 ? "0px" : "0px"};
  display: inline-block;
`;

const TaskStatLabel = styled.div``;
const TaskStatValue = styled.div``;
const PatternPreviewWrapper = styled.div`
  zoom: 0.12;
`;

interface TaskStatProps extends WithTranslation {
  line_index: number;
  onDataStatusChange?: (hasData: boolean) => void;
}
const TaskStat = ({ t, line_index, onDataStatusChange }: TaskStatProps) => {
  const history = useHistory();

  const [status, setStatus] = useRecoilState(statusState);
  const [task, setTask] = useRecoilState(taskState);
  const latestStatus = status.lastHeartBeatMessage;

  const isThereCurrenTask = useRecoilValue(
    line_index === 0
      ? statusSelectors.isThereCurrentTaskA
      : statusSelectors.isThereCurrentTaskB
  );

  useEffect(() => {
    if (onDataStatusChange) {
      onDataStatusChange(isThereCurrenTask);
    }
  }, [isThereCurrenTask, onDataStatusChange]);
  
  let currentPattern = [];
  try {
    currentPattern = status.currentTask[line_index].stackCenter[0];
  } catch (err) {
    currentPattern = [];
  }

  return (
    <>
      { // !isThereCurrenTask ? (
        false ? (
          <TaskStatContainer line_index={line_index}>
            {t('taskstatus.no_task_assigned')}
          </TaskStatContainer>
        ) : (
          <TaskStatContainer line_index={line_index}>
            <PatternPreviewWrapper>
              <PatternPreview boxes={currentPattern} line_index={line_index} />
            </PatternPreviewWrapper>
            {t('Task.Preview.Size')}: {status?.currentTask[line_index]?.widthX}x{status?.currentTask[line_index]?.heightY}x
            {status?.currentTask[line_index]?.layerHeight}
            <br />
            {t('Task.Preview.OrderName')}: {status?.taskTitle[line_index]}
          </TaskStatContainer>
        )}
    </>
  );
};
export default withTranslation()(TaskStat);