import { State as TaskState } from "@/store/task/types"
import { State as SystemState } from "@/store/system/types"
import { toInteger, cloneDeep } from "lodash"
import { LayerProps } from "@/types/task";

const generatePayloadLayers = (task:TaskState,system:SystemState,maxPossibleBoxesPerPallet:number)=>{

  //let robotSimulation = task.robotSimulation
  const layers             = task.layers;
  const box_width          = toInteger(task.boxDimension.width);
  const box_height         = toInteger(task.boxDimension.height);
  const boxes              = task.payloadPattern.boxes;
  const layer_height       = toInteger(task.stackHeight);
  const stack_height_limit = task.stackHeightLimit;
  const rotate_flip_every  = task.rotateFlipEvery;
  const slip_sheet_every   = task.slipSheetEvery;
  const is_slip_sheet      = task.isSlipSheet;
  const isDoubleStack      = task.isDoubleStack;
  const robotSpeed         = task.robotSpeed;

  // const stack_height_condition = system.stackHeightCondition;

  const boxAmount =
    toInteger(task.boxAmount) === 0
      ? maxPossibleBoxesPerPallet
      : toInteger(task.boxAmount);
  const isPickSpecial = task.isPickSpecial === true;
  const isRotate      = task.isRotate      === true;
  const isNoTying     = task.isNoTying     === true;

  // Calculate maximum stack height
  // const stack_height = stack_height_condition.reduce((prev, cur) => (
  //   (
  //     prev == 0
  //     && box_width  <= cur.zone_width
  //     && box_height <= cur.zone_height
  //    ) ? cur.stac_height : prev
  // ), 0)


  let layers_full: LayerProps[]  = [];

  // if

  [...Array(Math.floor(stack_height_limit/layer_height)).keys()].map(iLayer => {
    let layer = cloneDeep(
      layers[ Math.floor((iLayer % (rotate_flip_every*2)) / rotate_flip_every) ]
    )

    console.log({is_slip_sheet})
    layer.slipSheet = is_slip_sheet && (iLayer % slip_sheet_every == 0)

    layers_full.push(layer)
  })


  let payloadLayers = {
    "widthX": box_width,
    "heightY": box_height,
    "boxes": boxes,
    "layerHeight": layer_height,
    "layers": layers_full,
    "boxAmount":boxAmount,
    "pickType":"NORMAL",
    "rotateType":"NORMAL",
    "tieType":"NORMAL",
    "isDoubleStack": isDoubleStack,
    "robotSpeed": robotSpeed
  }
  return payloadLayers;
}

export default generatePayloadLayers;
