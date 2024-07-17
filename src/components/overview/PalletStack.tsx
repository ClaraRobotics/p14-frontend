import { statusState } from '@/store';
import React, { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import dummyData from '../3Ddisplay/dummyData';
import Stack3DPreview from '../3Ddisplay/Stack3DPreview';

interface PalletStackProps extends WithTranslation {
  // divContainerWidth?: number;
  // divContainerHeight?: number;
  idx: number
}

const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 300;

const PalletStack = ({ t, idx }: PalletStackProps) => {
  const [status, setStatus] = useRecoilState(statusState);
  const currentFullStack = idx == 0 ? status.currentTask.stackCenterLHR : status.currentTask.stackCenter;
  const isDoubleStack = status.currentTask.isDoubleStack
  const layerHeight   = status.currentTask.layerHeight;
  const latestStatus  = status.lastHeartBeatMessage;

  const [currentBoxIndex, setCurrentBoxIndex] = useState(1);


  // TODO: copy code from grilled-work
  // finishLayerIdx, finishBoxIdx
  useEffect(() => {
    const currentHeartbeatIndex =
      latestStatus?.finishLayerIdx?.[idx] * status.currentTask?.baseBoxes?.length +
      latestStatus?.finishBoxIdx?.[idx];
    if (!isNaN(currentHeartbeatIndex)) {
      setCurrentBoxIndex(
        latestStatus.finishLayerIdx?.[idx] * status.currentTask?.baseBoxes?.length +
          latestStatus.finishBoxIdx?.[idx]
      );
    }
  }, [
    status.lastHeartBeatMessage.finishLayerIdx,
    status.lastHeartBeatMessage.finishBoxIdx,
  ]);

  return (
    <Stack3DPreview
      divContainerWidth={CONTAINER_WIDTH}
      divContainerHeight={CONTAINER_HEIGHT}
      dataToDisplay={currentFullStack}
      layerHeight={layerHeight}
      maxBoxes={currentBoxIndex}
      isDoubleStack={isDoubleStack}
    />
  );
};

export default withTranslation()(PalletStack);
