import {
  BoxDimension,
  BoxItemBackend,
  BoxPosition,
  LayerProps,
  PalletDimension,
  Step
} from '@/types/task';
import internal from 'stream';

export interface State {
  // general
  currentStep: Step;
  isPatternListShow: boolean;
  selectedPattern: any; /* TODO: strict type */
  // pattern-related
  boxDimension: BoxDimension;
  palletDimension: PalletDimension;
  layout: BoxPosition[];
  payloadPattern: any;
  payloadLayers: any;
  robotSimulation: any;
  undoStack: BoxPosition[][];
  redoStack: BoxPosition[][];
  stackHeight: string;
  stackHeightLimit: number;
  activeBox: number | null;
  patternList: any[];//TODO
  // layer-related
  layers: LayerProps[];
  boxAmount:number|undefined;
  previewBoxes:BoxItemBackend[][];
  isPickSpecial:boolean;
  isRotate:boolean;
  isNoTying:boolean;
  isDoubleStack:boolean;
  robotSpeed: number;
  isSlipSheet:boolean;
  slipSheetEvery:number;
  rotateFlipEvery:number;
}
