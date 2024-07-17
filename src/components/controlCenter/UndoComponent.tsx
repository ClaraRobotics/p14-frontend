import React, { useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';

import { statusState, statusActions } from '@/store';
import { taskActions, taskState, systemState } from '@/store';
import Button from '../common/buttons/Button';
import Field from '../common/Field';
import { toInteger } from 'lodash';
import styles from '@/styles/styles';
import Stack3DPreview from '../3Ddisplay/Stack3DPreview';
import NumberInput from '../common/input/NumberInput';
import { NaNDisplay } from '@/util/numberDisplayUtils';
import api from '@/api';
import { viewActions, viewState } from '@/store/view';

const UndoComponentContainer = styled.div`
  border: 5px solid ${styles.colors.gray5};inputmode="none"
  width: 600px;
  font-size: 17pt;
`;

const UndoComponent = ({ t }: WithTranslation) => {
  const [status, setStatus] = useRecoilState(statusState);
  const [task, setTask] = useRecoilcurrentTaskState(taskState);
  const [view, setView] = useRecoilState(viewState);
  const latestStatus = status.lastHeartBeatMessage;

  const [currentBoxIndex, setCurrentBoxIndex] = useState(1);
  const itemPerLayer = status.currentTask?.baseBoxes?.length;
  const layerIdx = Math.floor(currentBoxIndex / itemPerLayer);
  const boxIdx = currentBoxIndex % itemPerLayer;
  const startAtBox = () => {
    try {
      api
        .post('/robot/select-job-and-play', { //deprecated
          job: 'RUN_STACK',
          restart: false,
          option: {
            layerIdx: layerIdx,
            boxIdx: boxIdx,
          },
        })
        .then((res: any) => {})
        .catch((err: any) => {
          alert(err);
        });
    } catch (err) {
      /* TODO: ERROR HANDLING*/
    }
  };

  const onBoxIndexInputChange = (input: string) => {
    if (toInteger(input) > 0) {
      setCurrentBoxIndex(toInteger(input));
    } else {
      setCurrentBoxIndex(0);
    }
  };
  useEffect(() => {
    const currentHeartbeatIndex =
      latestStatus?.finishLayerIdx * status.currentTask?.baseBoxes?.length +
      latestStatus?.finishBoxIdx;
    if (!isNaN(currentHeartbeatIndex)) {
      setCurrentBoxIndex(
        latestStatus.finishLayerIdx * status.currentTask?.baseBoxes?.length +
          latestStatus.finishBoxIdx
      );
    }
  }, [
    status.lastHeartBeatMessage.finishLayerIdx,
    status.lastHeartBeatMessage.finishBoxIdx,
  ]);

  return (
    <UndoComponentContainer>
      <Stack3DPreview
        divContainerWidth={400}
        divContainerHeight={400}
        dataToDisplay={status.currentTask.stackCenter}
        layerHeight={status.currentTask.layerHeight}
        maxBoxes={currentBoxIndex}
      />
      <Field
        label="Current boxes in stack:"
        slot={
          <NumberInput
            value={NaNDisplay(currentBoxIndex)}
            onChange={onBoxIndexInputChange}
            label={''}
          />
        }
      ></Field>
      <Button
        label="+"
        style={{width: 100}}
        onTap={() => setCurrentBoxIndex(currentBoxIndex + 1)}
      />
      <Button
        label="-"
        style={{width: 100}}
        onTap={() => {
          if (currentBoxIndex > 1) {
            setCurrentBoxIndex(currentBoxIndex - 1);
          }
        }}
      />
      {/* <Button
        label={`START AT BOX ${NaNDisplay(currentBoxIndex)}`}
        divContainerWidth={250}
        onTap={() =>
          viewActions.checkEmerThencall(view, setView, status, startAtBox)
        }
      /> */}
      Layer:{NaNDisplay(layerIdx)}
      Box:{NaNDisplay(boxIdx)}
    </UndoComponentContainer>
  );
};
export default withTranslation()(UndoComponent);
