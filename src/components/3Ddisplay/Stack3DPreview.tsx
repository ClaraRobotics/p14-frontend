import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import Box from './Box';
import styles from '@/styles/styles';
import { BoxItemBackend } from '@/types/task';

interface Stack3DPreviewContainerProps {
  height: number;
  width: number;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
`;

const Stack3DPreviewContainer = styled.div<Stack3DPreviewContainerProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  // border: 4px solid ${styles.colors.gray5};
`;

const deg2rad = (degrees: number) => degrees * (Math.PI / 180);

function Plane() {
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshLambertMaterial attach="material" color={styles.colors.gray5} />
    </mesh>
  );
}

interface PropsData {
  dataToDisplay: Array<BoxItemBackend[]>;
  maxBoxes?: number;
  isDoubleStack: boolean;
  layerHeight: number;
  divContainerHeight?: number;
  divContainerWidth?: number;
  areaSizeX?: number;
  areaSizeY?: number;
}

const Stack3DPreview = ({
  dataToDisplay,
  layerHeight,
  maxBoxes,
  isDoubleStack,
  divContainerHeight = 500,
  divContainerWidth = 500,
  areaSizeX=2000,
  areaSizeY=1700
}: PropsData) => {
  let boxesToRender: ReactNode[] = [];
  // console.log("datatodisplay:",dataToDisplay,"layerheight",layerHeight);
  const displayUntil =
    maxBoxes === undefined || maxBoxes === null ? undefined : maxBoxes;
  const boxesPerLayer  = dataToDisplay?.[0]?.length
  const completedLayer = Math.floor(displayUntil / boxesPerLayer)

  dataToDisplay?.forEach((layer: BoxItemBackend[], index: number) => {
    const thisLayerHeight = index * layerHeight;
    let indexLayer = index;
    let boxesInlayer = layer.length;
    layer.forEach((box: BoxItemBackend, index: number) => {
      boxesToRender.push(
        <Box
          positionXmm={box.xCenter - areaSizeX / 2}
          positionYmm={box.yCenter - areaSizeY / 2}
          positionZmm={thisLayerHeight - 900}
          widthXmm={box.widthX}
          heightYmm={box.heightY}
          stackHeightZmm={layerHeight - 2}
          key={indexLayer * boxesInlayer + index}
        />
      );
    });
  });

  return (
    <Container>
      <Stack3DPreviewContainer
        width={divContainerWidth}
        height={divContainerHeight}
      >
        <Canvas camera={{ position: [1, -0.5, 1.5], up: [0, 0, 1] }}>
          <OrbitControls
            args={undefined}
            addEventListener={undefined}
            hasEventListener={undefined}
            removeEventListener={undefined}
            dispatchEvent={undefined}
            enableDamping={true}
            dampingFactor={0.1}
          />
          {/*<Plane />*/}
          <ambientLight intensity={0.4} color={'#aaaaaa'} />
          <spotLight position={[2, 5, 10]} angle={0.3} />
          <spotLight position={[-1, -1, 10]} angle={0.3} />

          {isDoubleStack ?
            [
              ...boxesToRender.slice(0, displayUntil),
              ...boxesToRender.slice(
                completedLayer * boxesPerLayer + boxesPerLayer,
                displayUntil + boxesPerLayer
              )
            ]
            :
            boxesToRender.slice(0, displayUntil)
          }

          {/* robot position */}
          <Box
            positionXmm={800  - areaSizeX / 2}
            positionYmm={2300 - areaSizeY / 2}
            positionZmm={1200 - 900}
            widthXmm={300}
            heightYmm={300}
            stackHeightZmm={300}
            key={9999}
            color={styles.colors.green}
          />

          {/* pallet position */}
          <Box
            positionXmm={300 + 700 - areaSizeX / 2}
            positionYmm={300 + 550 - areaSizeY / 2}
            positionZmm={-100 - 900}
            widthXmm={1400}
            heightYmm={1100}
            stackHeightZmm={100}
            key={9998}
            color={styles.colors.green}
          />
        </Canvas>
      </Stack3DPreviewContainer>
    </Container>
  );
};

export default Stack3DPreview;
