import styles from '@/styles/styles';
import React from 'react';

interface BoxProps {
  positionXmm: number;
  positionYmm: number;
  positionZmm:number;
  widthXmm:number;
  heightYmm:number;
  stackHeightZmm:number;
  color?:string;
}

const Box = ({positionXmm,positionYmm,positionZmm,widthXmm,heightYmm,stackHeightZmm,color}:BoxProps) => {
  return (
    <mesh position={[positionXmm/1000,positionYmm/1000,positionZmm/1000]}>
      <boxBufferGeometry args={[widthXmm/1000, heightYmm/1000, stackHeightZmm/1000]}
      />
      <meshLambertMaterial color={color ?? styles.colors.gray4} />
    </mesh>
  );
};
export default Box;
