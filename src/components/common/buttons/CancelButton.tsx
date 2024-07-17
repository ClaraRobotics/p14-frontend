import React, { TouchEventHandler, useState } from 'react';
import styled from 'styled-components';

import { MdClose } from 'react-icons/md';
import IconButton from '@/components/common/buttons/IconButton';

import styles from '@/styles/styles';
import { WithTranslation, withTranslation } from 'react-i18next';

interface PropsData extends WithTranslation {
  onTap?: TouchEventHandler<HTMLElement>;
}
interface CancelButtonContainerProps {
  isTouching: boolean;
}
const CancelButtonContainer = styled.div<CancelButtonContainerProps>`
  display: flex;
  align-self: flex-start;
  align-items: center;
  background-color: ${(props) => (props.isTouching ? 'white' : 'inherit')}
  &:active{
    background-color:#aaaaaa;
  }
`;

const CancelButtonLabel = styled.span`
  font-size: 32px;
  font-weight: 600;
  margin-left: 24px;
  color: ${styles.colors.gray3};
`;

const CancelButton = (props: PropsData) => {
  const { t, onTap } = props;
  const [isTouching, setIsTouching] = useState(false);
  return (
    <CancelButtonContainer
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={(e: any) => {
        onTap?.(e);
        setIsTouching(false);
      }}
      isTouching={isTouching}
    >
      <IconButton icon={<MdClose />} large />
      <CancelButtonLabel>{t('common.cancel')}</CancelButtonLabel>
    </CancelButtonContainer>
  );
};

export default withTranslation()(CancelButton);
