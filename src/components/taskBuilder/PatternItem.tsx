import React, { TouchEventHandler } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { withTranslation, WithTranslation } from 'react-i18next';

import styles from '@/styles/styles';
import { systemState } from '@/store';
import { BoxItemBackend, PalletDimension, PatternTemplate } from '@/types/task';
import PatternPreview from '@/components/taskBuilder/PatternPreview';
import OnTapWrapper from '../common/buttons/OnTapWrapper';

const PREVIEW_IMAGE_SIZE = 120;

interface PropsData extends WithTranslation {
  pattern: PatternTemplate;
  palletDimension: PalletDimension;
  onTap: TouchEventHandler;
  active?: boolean;
}

interface InfoStyledProps {
  active?: boolean;
}

interface ContainerStyledProps {
  active?: boolean;
}
const Container = styled.div<ContainerStyledProps>`
  display: grid;
  width: 100%;
  height: ${PREVIEW_IMAGE_SIZE}px;
  grid-template-columns: 2fr 8fr;
  grid-gap: 24px;
  margin: 32px 0;
  border-left: 6px solid;
  padding-left: 16px;
  border-color: ${(props) =>
    props.active ? styles.colors.primary1 : 'transparent'};
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h2<InfoStyledProps>`
  color: ${(props) =>
    props.active ? styles.colors.primary1 : styles.colors.gray3};
  margin: 0;
  transition: ${styles.transition.animationDuration}
    ${styles.transition.timingFunction};
`;

const Detail = styled.div<InfoStyledProps>`
  color: ${(props) =>
    props.active ? styles.colors.gray3 : styles.colors.gray5};
  margin-top: 8px;
  font-size: 18px;
  transition: ${styles.transition.animationDuration}
    ${styles.transition.timingFunction};
`;
interface PreviewContainerStyledProp {
  scale: number;
}

const PreviewContainer = styled.div<PreviewContainerStyledProp>`
  zoom: ${(props) => props.scale};
`;

const PatternItem = (props: PropsData) => {
  const system = useRecoilValue(systemState);
  const { t, pattern, palletDimension, onTap, active } = props;
  const { patternId = '', boxesCenter = [] } = pattern;
  const listPreviewScale =
    PREVIEW_IMAGE_SIZE / (palletDimension.height + system.overHang * 2);
  let boxesToPreview: BoxItemBackend[] = [];
  if (pattern.boxesCenter !== undefined) {
    boxesToPreview = pattern.boxesCenter;
  }
  return (
    <OnTapWrapper onTap={onTap}>
      <Container active={active}>
        <PreviewContainer scale={listPreviewScale}>
          <PatternPreview boxes={boxesToPreview} />
        </PreviewContainer>

        <InfoContainer>
          <Name active={active}>{
            patternId.replace('Pattern', t('taskbuilder.pattern.patternlist.item.pattern'))
          }</Name>
          <Detail active={active}>
            {t('taskbuilder.pattern.patternlist.item.boxnumber').replace(
              '{number}',
              JSON.stringify(boxesCenter.length)
            )}
          </Detail>
        </InfoContainer>
      </Container>
    </OnTapWrapper>
  );
};

export default withTranslation()(PatternItem);
