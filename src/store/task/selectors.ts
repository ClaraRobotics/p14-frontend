import { isNumberInRange, isValidNumber } from '@/util/validation';
import { selector } from 'recoil'
import taskState from './state';
import { systemState } from '..';

export const isPatternNotEmpty = selector({
  key: 'isPatternNotEmpty',
  get: ({ get }) => {
    const task = get(taskState)
    return task.layout.length > 0;
  },
});


export const isWidthNotEmpty = selector({
  key: 'isWidthNotEmpty',
  get: ({ get }) => {
    const task = get(taskState);
    return isValidNumber(task.boxDimension.width);
  },
});

export const isWidthInRange = selector({
  key: 'isWidthInRange',
  get: ({ get }) => {
    const task = get(taskState);
    const { boxMinWidth, boxMaxWidth } = get(systemState);
    return isNumberInRange(task.boxDimension.width, boxMinWidth, boxMaxWidth);
  },
});

export const isHeightNotEmpty = selector({
  key: 'isHeightNotEmpty',
  get: ({ get }) => {
    const task = get(taskState);
    return isValidNumber(task.boxDimension.height);
  },
});

export const isHeightInRange = selector({
  key: 'isHeightInRange',
  get: ({ get }) => {
    const task = get(taskState);
    const { boxMinHeight, boxMaxHeight } = get(systemState);
    return isNumberInRange(task.boxDimension.height, boxMinHeight, boxMaxHeight);
  },
});

export const isStackHeightNotEmpty = selector({
  key: 'isStackHeightNotEmpty',
  get: ({ get }) => {
    const task = get(taskState);
    return isValidNumber(task.stackHeight);
  },
});

export const maxPossibleBoxesPerPallet = selector({
  key: 'maxPossibleBoxesPerPallet',
  get: ({ get }) => {
    const task = get(taskState);
    return task.previewBoxes.length * task.layout.length;
  },
});


export const currentLineIndex = selector({
  key: 'currentLineIndex',
  get: ({ get }) => {
    const task = get(taskState);
    return task.line_index;
  },
});
