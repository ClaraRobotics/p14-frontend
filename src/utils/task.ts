import { SystemState } from '@/store';
import { BoxDimension, BoxItemBackend, BoxPosition, PalletDimension } from '@/types/task'

export const toFrontBoxCoordinates = (boxCenter: BoxItemBackend, boxDimension: BoxDimension, palletDimension: PalletDimension, overHang: number): BoxPosition => {
  const width = parseInt(boxDimension.width);
  const height = parseInt(boxDimension.height);
  const fullHeight = palletDimension.height + 2 * overHang;
  const { widthX, heightY, xCenter, yCenter } = boxCenter;

  return Math.abs(width - widthX) < Math.abs(width - heightY) ?
    {
      x: xCenter - width / 2,
      y: fullHeight - ( yCenter + height / 2 ),
      rotated: false,
    } :
    {
      x: xCenter - height / 2,
      y: fullHeight - ( yCenter + width / 2 ),
      rotated: true,
    }
}

export const toBackBoxCoordinates = (box: BoxPosition, boxDimension: BoxDimension, palletDimension: PalletDimension, overHang: number): BoxItemBackend => {
  const width = parseInt(boxDimension.width);
  const height = parseInt(boxDimension.height);
  const { x, y, rotated } = box;
  const fullHeight = palletDimension.height + 2 * overHang;

  return {
    xCenter: rotated ? x + height / 2 : x + width / 2,
    yCenter: fullHeight - (rotated ? y + width / 2 : y + height / 2),
    widthX:  rotated ? height : width,
    heightY: rotated ? width : height,
  }
}
