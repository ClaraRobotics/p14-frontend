import { SetterOrUpdater } from 'recoil'
import { cloneDeep, toInteger } from 'lodash';

import { defaultTask } from './state'
import { State } from './types'

import { roundUpToMultipleOf, roundDownToMultipleOf } from '@/util/math';
import { SNAP_GRID } from '@/const/pattern';
import { BoxItemBackend, BoxPosition, LayerProps, Step } from '@/types/task';

export const addNewBox = (state: State, setter: SetterOrUpdater<State>, payload: { offset: number }) => {
  const { layout, undoStack } = state;
  const { offset } = payload;
  const newLayout = [...layout, { x: offset, y: offset, rotated: false }];
  const newUndoStack = [...undoStack, layout];
  const index = layout.length;

  setter({...state, layout: newLayout, activeBox: index, undoStack: newUndoStack, redoStack: []});
};

export const clearAllBox = (state: State, setter: SetterOrUpdater<State>) => {
  const { layout, undoStack } = state;
  const newUndoStack = [...undoStack, layout];

  setter({...state, layout: [], activeBox: null, undoStack: newUndoStack, redoStack: []});
};

export const deleteBox = (state: State, setter: SetterOrUpdater<State>, payload: number | null) => {
  const { layout, undoStack } = state;

  if (payload === null || payload < 0 || payload >= layout.length) return;

  const newLayout = [...layout]
  const newUndoStack = [...undoStack, layout];
  newLayout.splice(payload, 1);

  setter({...state, layout: newLayout, activeBox: null, undoStack: newUndoStack, redoStack: []});
};

export const goToStep = (state: State, setter: SetterOrUpdater<State>, payload: Step) => {
  setter({...state, currentStep: payload});
};

export const initialize = (setter: SetterOrUpdater<State>) => {
  setter(cloneDeep(defaultTask));
};

export const popRedo = (state: State, setter: SetterOrUpdater<State>) => {
  const { layout, redoStack, undoStack } = state;
  const newRedoStack = [...redoStack];
  const redoLayout = newRedoStack.pop();

  if (!redoLayout) return;

  const newUndoStack = [...undoStack, layout];

  setter({...state, layout: redoLayout, redoStack: newRedoStack, undoStack: newUndoStack, activeBox: null});
};

export const popUndo = (state: State, setter: SetterOrUpdater<State>) => {
  const { layout, undoStack, redoStack } = state;
  const newUndoStack = [...undoStack];
  const undoLayout = newUndoStack.pop();

  if (!undoLayout) return;

  const newRedoStack = [...redoStack, layout]

  setter({...state, layout: undoLayout, redoStack: newRedoStack, undoStack: newUndoStack, activeBox: null});
};

export const pushRedo = (state: State, setter: SetterOrUpdater<State>, payload: BoxPosition[]) => {
  const { redoStack } = state;
  const newRedoStack = [...redoStack, payload];

  setter({...state, redoStack: newRedoStack});
};

export const pushUndo = (state: State, setter: SetterOrUpdater<State>, payload: BoxPosition[]) => {
  const { undoStack } = state;
  const newUndoStack = [...undoStack, payload];

  setter({...state, undoStack: newUndoStack});
};

export const toggleRotate = (state: State, setter: SetterOrUpdater<State>, payload: number | null) => {
  const { layout, boxDimension, undoStack } = state;

  if (payload === null || payload < 0 || payload >= layout.length) return;

  const { width, height } = boxDimension;
  const newUndoStack = [...undoStack, layout];
  const newLayout = [...layout]
  const { x, y, rotated } = layout[payload];

  let newX, newY;
  const intWidth = toInteger(width);
  const intHeight = toInteger(height);

  if (rotated) {
    newX = roundDownToMultipleOf(toInteger(x + (intHeight - intWidth) / 2), SNAP_GRID);
    newY = roundDownToMultipleOf(toInteger(y + (intWidth - intHeight) / 2), SNAP_GRID);
  } else {
    newX = roundUpToMultipleOf(toInteger(x + (intWidth - intHeight) / 2), SNAP_GRID);
    newY = roundUpToMultipleOf(toInteger(y + (intHeight - intWidth) / 2), SNAP_GRID);
  }

  newLayout[payload] = { x: newX, y: newY, rotated: !rotated};

  setter({... state, layout: newLayout, undoStack: newUndoStack, redoStack: []});
};

export const togglePatternList = (state: State, setter: SetterOrUpdater<State>, payload?: boolean) => {
  const { isPatternListShow } = state;
  const show = (payload !== undefined) ? payload : !isPatternListShow;

  setter({... state, isPatternListShow: show, selectedPattern: null });
}

export const setActiveBox = (state: State, setter: SetterOrUpdater<State>, payload: number) => {
  const { activeBox } = state;
  if (payload === activeBox) return;

  setter({...state, activeBox: payload});
};

export const unsetActiveBox = (state: State, setter: SetterOrUpdater<State>) => {
  setter({...state, activeBox: null});
};

export const setBoxHeight = (state: State, setter: SetterOrUpdater<State>, payload: string) => {
  const { boxDimension } = state;
  setter({...state, boxDimension: {...boxDimension, height: payload}})
};

export const setBoxPosition = (state: State, setter: SetterOrUpdater<State>, payload: { x: number, y: number, index: number }) => {
  const { x, y, index } = payload;
  const { layout } = state;

  if (index >= layout.length) return;

  const newLayout = [...layout];
  const { rotated } = newLayout[index];
  newLayout[index] = { x, y, rotated };

  setter({...state, layout: newLayout});
};

export const setBoxWidth = (state: State, setter: SetterOrUpdater<State>, payload: string) => {
  const { boxDimension } = state;

  setter({...state, boxDimension: {...boxDimension, width: payload}})
};

export const setLayout = (state: State, setter: SetterOrUpdater<State>, layout: BoxPosition[]) => {
  setter({...state, layout});
};
export const setLayoutAndClosePatternList= (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: BoxPosition[]
) => {
  setter({ ...state, layout: payload, isPatternListShow:false});
};


export const setLayer = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload
) => {
  setter({ ...state, layers: payload });
};


// TODO: strict type
export const setSelectedPattern = (state: State, setter: SetterOrUpdater<State>, payload: any) => {
  setter({...state, selectedPattern: payload});
};

export const setStackHeight = (state: State, setter: SetterOrUpdater<State>, payload: string) => {
  setter({...state, stackHeight: payload});
}

export const setPayloadPattern = (state: State, setter: SetterOrUpdater<State>, payload: any, stackHeightLimit: number) => {
  setter({...state, payloadPattern: payload, currentStep: 'layer', stackHeightLimit});
}

export const setPayloadLayers = (state: State, setter: SetterOrUpdater<State>, payload: any, robotSimulation: any) => {
  setter({...state, payloadLayers: payload, robotSimulation});
}



export const setPatternList = (state: State, setter: SetterOrUpdater<State>, payload:any /* need to be full pattern list before picking*/ ) => {
  setter({...state, patternList: payload});
};

export const setRobotSimulation = (state:State, setter: SetterOrUpdater<State>,payload:any ) =>{
  setter({...state, robotSimulation: payload});
}

export const setBoxAmount = (state:State, setter: SetterOrUpdater<State>,payload:number|undefined ) =>{
  setter({...state, boxAmount: payload});
}

export const setPreviewBoxes = (state:State, setter: SetterOrUpdater<State>,payload:BoxItemBackend[][] ) =>{
  setter({...state, previewBoxes: payload});
}

export const setIsPickSpecial = (
  state: State,
  setter: SetterOrUpdater<State>,
  isPickSpecial: boolean,
  isNoTying: boolean
) => {
  setter({ ...state, isPickSpecial, isNoTying });
};
export const setIsRotate = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, isRotate: payload });
};


export const setIsDoubleStack = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, isDoubleStack: payload });
};

export const setRobotSpeed = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: number
) => {
  setter({ ...state, robotSpeed: payload });
};

export const setIsSlipSheet = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, isSlipSheet: payload });
};

export const setSlipSheetEvery = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: number
) => {

  setter({ ...state, slipSheetEvery: payload });
};

export const setRotateFlipEvery = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: number
) => {
  setter({ ...state, rotateFlipEvery: payload });
};
