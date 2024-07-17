import React from 'react';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { MdLibraryAdd } from 'react-icons/md';
import { HiOutlineTemplate } from 'react-icons/hi';

import styles from '@/styles/styles';
import { taskState, taskActions, systemState } from '@/store';
import {
  BOX_MAX_HEIGHT,
  BOX_MAX_WIDTH,
  GRID_DISPLAY_WIDTH,
} from '@/const/pattern';
import DraggableBox from '@/components/taskBuilder/DraggableBox';

interface ContainerStyledProps {
  gridWidth: number;
  gridHeight: number;
  scale: number;
}
interface GridStyledProps {
  palletWidth: number;
  palletHeight: number;
  offset: number;
  scale: number;
}

const GridContainer = styled.div<ContainerStyledProps>`
  width: ${(props) => props.gridWidth}px;
  height: ${(props) => props.gridHeight}px;
  border: 8px dashed ${styles.colors.gray6};
  transform: ${(props) => `
    translate(-${(props.gridWidth * props.scale) / 2 + 100}px, -${
    (props.gridHeight * props.scale) / 2 + 180
  }px)
    scale(${props.scale})
  `};
  overflow: hidden;
`;

const Grid = styled.div<GridStyledProps>`
  width: ${(props) => props.palletWidth}px;
  height: ${(props) => props.palletHeight}px;
  background-color: ${styles.colors.gray8};
  border: 8px solid ${styles.colors.gray5};
  margin: ${(props) => props.offset}px;
  box-sizing: border-box;
  position: absolute;
`;

const InfoText = styled.div`
  position: relative;
  top: calc(50% - 84px);
  width: 100%;
  text-align: center;
  font-size: 56px;
  color: ${styles.colors.gray3};
  span {
    color: ${styles.colors.primary1};
  }
`;

const PalletizingGrid = ({ t }: WithTranslation) => {
  const [pattern, setPattern] = useRecoilState(taskState);
  const [system] = useRecoilState(systemState);
  const { boxDimension, palletDimension, layout, activeBox } = pattern;
  const { width, height } = palletDimension;
  const { overHang, boxMargin, boxMinWidth, boxMinHeight } = system;

  const gridWidth = width + 2 * overHang;
  const gridHeight = height + 2 * overHang;

  const scale = GRID_DISPLAY_WIDTH / gridWidth;

  console.log({ gridWidth, gridHeight, palletDimension });

  const onDragStart = () => {
    taskActions.pushUndo(pattern, setPattern, layout);
  };

  const setBoxPosition = (x: number, y: number, index: number) => {
    taskActions.setBoxPosition(pattern, setPattern, { x, y, index });
  };

  const onBoxTap = (index: number) => {
    taskActions.setActiveBox(pattern, setPattern, index);
  };

  const onTapOutside = (e: React.TouchEvent<HTMLElement>) => {
    if (!e.target) return;
    if ((e.target as HTMLElement).className.includes('plt-draggable-box'))
      return;
    taskActions.unsetActiveBox(pattern, setPattern);
  };
  const [task, setTask] = useRecoilState(taskState);

  const isPatternNotEmpty = task.layout.length !== 0;

  return (
    <GridContainer
      gridWidth={gridWidth}
      gridHeight={gridHeight}
      scale={scale}
      onTouchStart={onTapOutside}
    >
      <Grid
        palletWidth={palletDimension.width}
        palletHeight={palletDimension.height}
        offset={overHang}
        scale={scale}
      />
      {!isPatternNotEmpty && (
        <InfoText>
          {t('taskbuilder.pattern.grid.empty.part1')}&nbsp;
          <span>
            <MdLibraryAdd />
          </span>
          &nbsp;{t('taskbuilder.pattern.grid.empty.part2')}
          <br />
          {t('taskbuilder.pattern.grid.empty.part3')}&nbsp;
          <span>
            <HiOutlineTemplate />
          </span>{' '}
          &nbsp;{t('taskbuilder.pattern.grid.empty.part4')}
        </InfoText>
      )}
      {layout.map((position, index) => {
        return (
          <DraggableBox
            key={`grid_draggable_box_${index}`}
            dimension={{
              width: parseInt(boxDimension.width) || 0,
              height: parseInt(boxDimension.height) || 0,
            }}
            position={position}
            index={index}
            scale={scale}
            margin={boxMargin}
            minWidth={boxMinWidth}
            maxWidth={BOX_MAX_WIDTH}
            minHeight={boxMinHeight}
            maxHeight={BOX_MAX_HEIGHT}
            active={index === activeBox}
            setPosition={setBoxPosition}
            onStart={onDragStart}
            onTap={onBoxTap}
          />
        );
      })}
    </GridContainer>
  );
};

export default withTranslation()(PalletizingGrid);
