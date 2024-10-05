import { atom } from 'recoil';
import { cloneDeep } from 'lodash';
import { State } from './types';

export const defaultTask: State = {
  line_index:0,
  currentStep: 'pattern',
  isPatternListShow: false,
  selectedPattern: null,
  boxDimension: {
    width: '',
    height: '',
  },
  //GRID_DISPLAY_WIDTH
  palletDimension: {
    width: 1400,
    height: 1100,
  },
  layout: [],
  payloadPattern: {},
  payloadLayers: {},
  robotSimulation: {},
  undoStack: [],
  redoStack: [],
  stackHeight: '',
  stackHeightLimit: 2300,
  activeBox: null,
  layers: [{}, {}],
  patternList:[],
  boxAmount:undefined,
  previewBoxes:[[]],
  isPickSpecial:true,
  isRotate:true,
  isNoTying:true,
  isDoubleStack:false,
  robotSpeed: 0,
  isSlipSheet:false,
  rotateFlipEvery:2,
  slipSheetEvery:1,
};

const taskState = atom({
  key: 'task',
  default: cloneDeep(defaultTask),
})

export default taskState;
