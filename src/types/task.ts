export interface BoxDimension {
  width: string;
  height: string;
};

export interface BoxPosition {
  x: number;
  y: number;
  rotated: boolean;
};
export interface PalletDimension {
  width: number;
  height: number;
};

export type Step = 'pattern' | 'layer' | 'summary';
export interface LayerProps {
  flipH?: boolean;
  rotation?: 0 | 90;
  flipV?: boolean;
  slipSheet?: boolean;
};

export type BoxItemBackend = {
  xCenter: number;
  yCenter: number;
  widthX: number;
  heightY: number;
  id?:number;
};

export interface PatternTemplate {
  heightY?: number;
  widthX?: number;
  boxesCenter?: BoxItemBackend[];
  patternId?: string;
  patternTitle?: string
};

enum PickTypeEnum{
  "PICK_TYPE_NORMAL",
  "PICK_TYPE_SPECIAL"
}
enum RotateTypeEnum {
  "NO_ROTATE",
  "ALTERNATE",
}

export interface Task {
  taskId: string;
  taskTitle: string;
  widthX: number;
  heightY: number;
  layerHeight: number;
  boxes: Array<BoxItemBackend>;
  layers: Array<any>;
  boxAmount: number;
  pickType: PickTypeEnum;
  rotateType: RotateTypeEnum;
  actions?: any
};
