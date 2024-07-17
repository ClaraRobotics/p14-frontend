import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';

import CancelButton from '@/components/common/buttons/CancelButton';
import Column from '@/components/common/Column';
import Page from '@/components/common/Page';
import Row from '@/components/common/Row';
import ToolBox from '@/components/taskBuilder/ToolBox';

import AddBoxButton from '@/components/taskBuilder/AddBoxButton';
import BoxDetailSection from '@/components/taskBuilder/BoxDetailSection';
import PalletizingGrid from '@/components/taskBuilder/PalletizingGrid';
import PatternList from '@/components/taskBuilder/PatternList';
import styles from '@/styles/styles';

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

const PatternBuilder = () => {
  const history = useHistory();

  const onCancel = () => history.push('/');

  return (
    <Page>
      <Row>
        <Column className="col-7">
          <CancelButton onTap={onCancel} />
          <Row>
            <Column>
              <ToolBox />
            </Column>
            <Column>
              <PalletizingGrid />
            </Column>
            <Column />
          </Row>
        </Column>
        <Column className="col-5">
          <BoxDetailSection />
          <PatternList />
        </Column>
      </Row>
      <Row>
        <PageDivider />
        <AddBoxButton />
      </Row>
    </Page>
  );
};

export default PatternBuilder;
