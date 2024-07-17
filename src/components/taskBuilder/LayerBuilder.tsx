import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';

import CancelButton from '@/components/common/buttons/CancelButton';
import Column from '@/components/common/Column';
import Page from '@/components/common/Page';
import Row from '@/components/common/Row';

import LayerAdjustment from '@/components/taskBuilder/LayerAdjustment';

import styles from '@/styles/styles';
import Stack3DPreview from '../3Ddisplay/Stack3DPreview';
import Button from '../common/buttons/Button';
import generatePayloadLayers from '@/util/generatePayloadLayers';

import { useRecoilState, useRecoilValue } from 'recoil';
import { taskState, taskActions } from '@/store/task';
import { systemState } from '@/store/system';
import api from '@/api';
import { debounce } from 'lodash';
import { maxPossibleBoxesPerPallet } from '@/store/task/selectors';
import { BoxItemBackend } from '@/types/task';

const StepperPlaceholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  height: 64px;
  width: 80%;
  background-color: black;
  margin: 0 auto 48px auto;
`;

const PageDivider = styled.div`
  position: absolute;
  height: 60%;
  top: 52%;
  left: 53%; /* magic number */
  transform: translateY(-50%) translateX(-50%) translateX(80px);
  border: 2px solid ${styles.colors.gray6};
`;

const LayerBuilder = () => {
  const history = useHistory();
  const onCancel = () => history.push('/');
  const [task, setTask] = useRecoilState(taskState);
  const [layersPreview, setLayersPreview] = useState([]);
  const system = useRecoilValue(systemState);
  const valMaxPossibleBoxesPerPallet = useRecoilValue(
    maxPossibleBoxesPerPallet
  );
  const getPreviewBoxes = () => {
    try {
      const payloadLayers = generatePayloadLayers(
        task,
        system,
        valMaxPossibleBoxesPerPallet
      );

      api.post('/preview/all-layers', payloadLayers).then((res: any) => {
        setLayersPreview(res.data)
      });
    } catch (err) {
      console.log('error:', err);
    }
  };

  useEffect(() => {
    getPreviewBoxes();
  }, [ task.layers, task.isSlipSheet, task.slipSheetEvery, task.rotateFlipEvery ]);

  useEffect(() => {
    taskActions.setPreviewBoxes(task, setTask, layersPreview);
  }, [ layersPreview ]);

  return (
    <Page>
      <Row>
        <Column className="col-7">
          <CancelButton onTap={onCancel} />
          <Row style={{ marginTop: 64 }}>
            <Stack3DPreview
              dataToDisplay={task.previewBoxes}
              layerHeight={parseInt(task.stackHeight)}
              maxBoxes={task.boxAmount}
              divContainerWidth={800}
              divContainerHeight={600}
            />
          </Row>
        </Column>
        <Column className="col-5">
          {/* <StepperPlaceholder />*/}
          <LayerAdjustment />
        </Column>
      </Row>
      <Row>
        <PageDivider />
      </Row>
    </Page>
  );
};

export default LayerBuilder;
