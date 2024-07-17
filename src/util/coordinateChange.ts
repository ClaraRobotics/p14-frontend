export const toFrontEndBoxes = (system: any, task: any, boxes: any) => {
  let pallet_width  = task.palletDimension.width
  let pallet_height = task.palletDimension.height
  let box_width     = parseInt(task.boxDimension.width)
  let box_height    = parseInt(task.boxDimension.height)
  let layout        = task.layout
  let overHang      = system.overHang
  let full_width    = pallet_width  + 2*overHang
  let full_height   = pallet_height + 2*overHang

  boxes = boxes.map((box: any) => (
    Math.abs(box_width - box.widthX) < Math.abs(box_width - box.heightY) ?
    {
      "x": box.xCenter - box_width / 2,
      "y": full_height - ( box.yCenter + box_height / 2 ),
      "rotated": false
    } :
    {
      "x": box.xCenter - box_height / 2,
      "y": full_height - ( box.yCenter + box_width / 2 ),
      "rotated": true
    }
  ))

  return boxes
}
