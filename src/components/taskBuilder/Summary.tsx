import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { useRecoilValue } from 'recoil';

import CancelButton from '@/components/common/buttons/CancelButton';
import Column from '@/components/common/Column';
import Page from '@/components/common/Page';
import Row from '@/components/common/Row';
import SummaryContent from '@/components/taskBuilder/SummaryContent';
import Stack3DPreview from '@/components/3Ddisplay/Stack3DPreview';

import styles from '@/styles/styles';
import { taskState } from '@/store';

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

const Summary = () => {
  const history = useHistory();
  const onCancel = () => history.push('/');
  const task = useRecoilValue(taskState);

  return (
    <Page>
      <Row>
        <Column className="col-7">
          <CancelButton onTap={onCancel} />
          <Row>
            <Stack3DPreview
              dataToDisplay={task.previewBoxes}
              layerHeight={parseInt(task.stackHeight)}
              maxBoxes={task.boxAmount}
              divContainerWidth={800}
              divContainerHeight={600}
            />
            <Column />
          </Row>
        </Column>
        <Column className="col-5">
          {/* <StepperPlaceholder>Stepper Placeholder</StepperPlaceholder>*/}
          <SummaryContent />
        </Column>
      </Row>

      <Row>
        <PageDivider />
      </Row>
    </Page>
  );
};

export default Summary;
