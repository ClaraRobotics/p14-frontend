import React from 'react';
import styled from 'styled-components';
import Page from '@/components/common/Page';
import styles from '@/styles/styles';
import { WithTranslation, withTranslation } from 'react-i18next';

const Text = styled.div`
  margin: auto;
  font-size: 24px;
  font-style: italic;
  padding-bottom: 80px;
  color: ${styles.colors.gray5};
  text-align: center;
`;

const Loading = ({ t }: WithTranslation) => {
  return(
    <Page>
      <Text>{ t('component.common.loading.text') }...</Text>
    </Page>
  )
}

export default withTranslation()(Loading);
