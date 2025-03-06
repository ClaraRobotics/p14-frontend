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
  wh?: string;
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

// Box styled component for displaying each box with edge lines to show direction
const Box = styled.div<BoxProps>`
  position: absolute;
  background-color: ${styles.colors.gray4};
  border: 15px solid ${styles.colors.gray5};
  width: ${(props) => props.widthX}px;
  height: ${(props) => props.heightY}px;
  top: ${(props) => props.yCenter - props.heightY / 2}px;
  left: ${(props) => props.xCenter - props.widthX / 2}px;

  :before {
    ${(props) => props.wh == 'yx' ?
      'width: 100%;height: 12px;top: 20%;left: 50%;' :
      'height: 100%;width: 12px;top: 50%;left: 20%;'
    }
    content: '';
    background: ${styles.colors.gray3};
    position: absolute;
    transform: translate(-50%,-50%);
    transform-origin: 50% 50%;
  }

  :after {
    ${(props) => props.wh == 'yx' ?
      'width: 100%;height: 12px;bottom: 20%;left: 50%;' :
      'height: 100%;width: 12px;top: 50%;right: 20%;'
    }
    content: '';
    background: ${styles.colors.gray3};
    position: absolute;
    transform: translate(-50%,-50%);
    transform-origin: 50% 50%;
  }
`;

// Alert container for error messages, centered and responsive
const AlertContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 3rem;
  background: ${styles.colors.danger1}15;
  border-left: 8px solid ${styles.colors.danger1};
  min-width: 80%;
  min-height: 200px;
  touch-action: none;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// Warning icon with large size for touch screens
const AlertIcon = styled(AiOutlineWarning)`
  color: ${styles.colors.danger1};
  font-size: 10rem;
  flex-shrink: 0;
`;

// Large text for error messages on touch screens
const AlertText = styled.div`
  color: ${styles.colors.danger1};
  font-size: 8rem;
  line-height: 1.4;
  font-weight: 600;
  text-align: center;
`;

// Main component for pattern preview with boxes or error message
const PatternPreview = ({ t, boxes }: PatternPreviewProps) => {
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
                wh={box.wh}
              />
            );
          })
        ) : (
          // Show error message when no boxes are present
          <AlertContainer>
            <AlertIcon />
            <AlertText>
              {t('taskbuilder.pattern.patternlist.error.toolarge')}
            </AlertText>
          </AlertContainer>
        )}
      </BoxesContainer>
    </div>
  );
};

export default withTranslation()(PatternPreview);