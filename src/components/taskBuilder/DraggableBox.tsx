import React from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';

import { BoxPosition } from '@/types/task';
import { roundDownToMultipleOf } from '@/util/math';
import { SNAP_GRID } from '@/const/pattern';

import styles from '@/styles/styles';

interface PropsData extends WithTranslation {
  dimension: { width: number; height: number };
  position: BoxPosition;
  index: number;
  scale: number;
  margin: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  active?: boolean;
  setPosition: (x: number, y: number, index: number) => void;
  onStart: () => void;
  onTap: (index: number) => void;
}

interface StyledProps {
  width: number;
  height: number;
  margin: number;
  active?: boolean;
}

const BoxModel = styled.div<StyledProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: ${styles.colors.gray4};
  box-sizing: border-box;
  outline: ${(props) => `${props.margin}px`} solid
    ${(props) => (props.active ? styles.colors.white : styles.colors.gray5)};
  color: ${(props) => (props.active ? styles.colors.white : 'transparent')};
  font-weight: 600;
  z-index: ${(props) => (props.active ? 99 : 0)};
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  overflow: hidden;
`;

const DraggableBox = (propsData: PropsData) => {
  const {
    t,
    dimension,
    position,
    index,
    scale,
    margin,
    minHeight,
    maxHeight,
    minWidth,
    maxWidth,
    active,
    setPosition,
    onStart,
    onTap,
  } = propsData;

  const { x, y, rotated } = position;
  let { width, height } = dimension;

  if (width < minWidth) width = minWidth;
  if (width > maxWidth) width = maxWidth;
  if (height < minHeight) height = minHeight;
  if (height > maxHeight) height = maxHeight;

  const displayWidth = rotated ? height : width;
  const displayHeight = rotated ? width : height;

  const onBoxDrag = (_: any, ui: any) => {
    setPosition(x + ui.deltaX, y + ui.deltaY, index);
  };

  const onBoxDragStop = (_: any, ui: any) => {
    const newX = roundDownToMultipleOf(
      x,
      SNAP_GRID
    ); /* prevent shift in grid snap */
    const newY = roundDownToMultipleOf(
      y,
      SNAP_GRID
    ); /* prevent shift in grid snap */

    setPosition(newX, newY, index);
  };

  const onBoxTap = () => {
    onTap(index);
  };

  return (
    <Draggable
      grid={[SNAP_GRID*scale, SNAP_GRID *scale]}
      bounds="parent"
      onDrag={onBoxDrag}
      onStart={onStart}
      onStop={onBoxDragStop}
      onMouseDown={onBoxTap}
      scale={scale}
      position={{ x, y }}
    >
      <BoxModel
        className="plt-draggable-box"
        width={displayWidth}
        height={displayHeight}
        margin={margin}
        active={active}
      >
        {t('taskbuilder.pattern.grid.dragtomove')}
      </BoxModel>
    </Draggable>
  );
};

export default withTranslation()(DraggableBox);
