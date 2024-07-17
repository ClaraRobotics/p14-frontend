import React, { ReactElement } from 'react';
import styled from 'styled-components';
import Column from '@/components/common/Column';
import styles from '@/styles/styles';

const FieldContainer = styled.div`
  display: flex;
  width: 100%;
  color: ${styles.colors.gray3};
  margin-bottom: 16px;
  align-items: center;

  &.info {
    margin-bottom: -24px;
  }
`;
interface PropsData {
  label: string;
  slot: ReactElement;
  info?: boolean;
  labelCol?: number;
}

const Field = (props: PropsData) => {
  const { label, slot, info, labelCol } = props;
  const className =
    labelCol && labelCol > 0 && labelCol < 12 ? `col-${labelCol}` : 'col-3';
  return (
    <FieldContainer className={info ? 'info' : ''}>
      <Column className={className}>
        <h2>{label}</h2>
      </Column>
      <Column className="col-1" />
      {slot}
    </FieldContainer>
  );
};

export default Field;
