import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AiOutlineWarning } from 'react-icons/ai';
import styled from 'styled-components';

import { BoxItemBackend } from '@/types/task';
import styles from '@/styles/styles';

interface PatternPreviewProps extends WithTranslation {
  boxes: BoxItemBackend[];
}

interface BoxProps {
  widthX: number;
  heightY: number;
  xCenter: number;
  yCenter: number;
}

// GRID_DISPLAY_WIDTH
const BoxesContainer = styled.div`
  // GRID_DISPLAY_WIDTH
  height: 1700px;
  width:  2000px;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
  background-color: ${styles.colors.gray8};
`;
const Box = styled.div<BoxProps>`
  position: absolute;
  background-color: ${styles.colors.gray4};
  border: 15px solid ${styles.colors.gray5};
  width: ${(props) => props.widthX}px;
  height: ${(props) => props.heightY}px;
  top: ${(props) => props.yCenter - props.heightY / 2}px;
  left: ${(props) => props.xCenter - props.widthX / 2}px;
`;

const PreviewText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4em;
  padding: 8px;
  background-color: ${styles.colors.danger1};
  color: ${styles.colors.gray7};
`;
const PatternPreview = ({ t, boxes }: PatternPreviewProps) => {
  // console.log('pattern preview:', boxes);

  return (
    <div>
      <BoxesContainer>
        {boxes.length !== 0 ? (
          boxes.map((box, index) => {
            return (
              <Box
                key={index}
                widthX={box.widthX}
                heightY={box.heightY}
                xCenter={box.xCenter}
                yCenter={box.yCenter}
              />
            );
          })
        ) : (
          <PreviewText>
            <AiOutlineWarning />
            &nbsp;{t('taskbuilder.pattern.patternlist.error.toolarge')}
          </PreviewText>
        )}
      </BoxesContainer>
    </div>
  );
};

export default withTranslation()(PatternPreview);
