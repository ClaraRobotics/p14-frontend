import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pick } from 'lodash';

import Backdrop from '@/components/common/Backdrop';
import Button from '@/components/common/buttons/Button';
import PatternItem from '@/components/taskBuilder/PatternItem';
import PatternPreview from '@/components/taskBuilder/PatternPreview';

import api from '@/api';
import styles from '@/styles/styles';
import { taskState, taskActions, taskSelectors, systemState } from '@/store';
import { PatternTemplate } from '@/types/task';
import { toFrontEndBoxes } from '@/util/coordinateChange';

const transitionName = 'slide';
const patternItemPropKey = ['patternId', 'widthX', 'heightY', 'boxesCenter'];

const PatternPreviewScaling = styled.div`
  zoom: 0.33;
`;
const ListContainer = styled.div`
  width: 36%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  top: 0;
  right: 0;
  background-color: ${styles.colors.gray8};
  z-index: 99;
  padding: 32px 48px;
  overflow-y: scroll;
  transition: ${styles.transition.animationDuration}
    ${styles.transition.timingFunction};
  -webkit-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  -moz-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  -webkit-overflow-scrolling: touch;

  &.${transitionName}-enter {
    transform: translateX(100%);
  }
  &.${transitionName}-enter-active {
    transform: translateX(0);
  }
  &.${transitionName}-exit {
    transform: translateX(0);
  }
  &.${transitionName}-exit-active {
    transform: translateX(100%);
  }
`;

const Title = styled.h1`
  margin-bottom: 48px;
`;

const PreviewWrap = styled.div`
  position: absolute;
  top: calc(50% - 250px);
  left: calc(32% - 250px);
  z-index: 99;
  text-align: center;
  -webkit-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  -moz-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
`;

const PreviewText = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  background-color: ${styles.colors.gray8};
  color: ${styles.colors.primary1};
  font-size: 32px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
`;

const PatternListWarnText = styled.div`
  font-size: 20px;
  color: ${styles.colors.primary1};
`;

const PatternList = ({ t }: WithTranslation) => {
  const [task, setTask] = useRecoilState(taskState);
  const system = useRecoilValue(systemState);
  const isWidthNotEmpty = useRecoilValue(taskSelectors.isWidthNotEmpty);
  const isHeightNotEmpty = useRecoilValue(taskSelectors.isHeightNotEmpty);
  const valueEmpty = !(isWidthNotEmpty && isHeightNotEmpty);

  const { isPatternListShow, selectedPattern, palletDimension } = task;
  const [previewBoxes, setPreviewBoxes] = useState([]);
  const { boxMinWidth, boxMinHeight } = system;
  const patternList = task.patternList;

  const toggleClose = () => {
    taskActions.togglePatternList(task, setTask, false);
  };
  useEffect(() => {
    if (selectedPattern) {
      loadPattern();
    }
  }, [selectedPattern]);
  const { boxDimension } = task;

  const loadPattern = () => {
    let payloadPattern = {
      patternId: selectedPattern.patternId,
      boxSize: {
        widthX: boxDimension.width || boxMinWidth,
        heightY: boxDimension.height || boxMinHeight,
      },
    };

    api
      .post('/load/pattern', payloadPattern)
      .then((res) => {
        console.log('/load/pattern SUCCESS');
        console.log(res.data);

        let resData = res.data;
        setPreviewBoxes(resData.patternBox);
      })
      .catch((err) => {
        if (err.response) {
          // alert(err.response.data.message);
          setPreviewBoxes([]);
          console.log(err.response.status);
          console.log(err.response.headers);
          console.log(err.response.message);
        }
        console.log(err);
      });
  };

  const loadPatternToBuilder = () => {
    let boxes = toFrontEndBoxes(system, task, previewBoxes);

    taskActions.setLayoutAndClosePatternList(task, setTask, boxes);
  };

  return (
    <Backdrop show={isPatternListShow} onTap={toggleClose}>
      <CSSTransition
        in={isPatternListShow}
        timeout={500}
        classNames={transitionName}
        unmountOnExit
      >
        <ListContainer>
          <Title>{t('taskbuilder.pattern.patternlist.title')}</Title>
          {valueEmpty && (
            <PatternListWarnText>
              {t('taskbuilder.pattern.patternlist.error.emptysize')}
            </PatternListWarnText>
          )}
          {patternList.slice(0).map((pattern, index) => {
            const patternProp: PatternTemplate = pick(
              pattern,
              patternItemPropKey
            );
            return (
              <PatternItem
                key={`pattern_${index}`}
                pattern={patternProp}
                palletDimension={palletDimension}
                active={
                  selectedPattern &&
                  pattern.patternId === selectedPattern.patternId
                }
                onTap={() =>
                  taskActions.setSelectedPattern(task, setTask, pattern)
                }
              />
            );
          })}
        </ListContainer>
      </CSSTransition>
      {isPatternListShow && selectedPattern ? (
        <PreviewWrap>
          {valueEmpty ? (
            <PreviewText>
              {t('taskbuilder.pattern.patternlist.error.emptysize.short')}
            </PreviewText>
          ) : (
            <PatternPreviewScaling>
              <PatternPreview boxes={previewBoxes} />
            </PatternPreviewScaling>
          )}
          <Button
            label={t('taskbuilder.pattern.patternlist.button.load')}
            className="full-width mt-48"
            onTap={loadPatternToBuilder}
            disabled={valueEmpty}
          />
        </PreviewWrap>
      ) : null}
    </Backdrop>
  );
};

export default withTranslation()(PatternList);
