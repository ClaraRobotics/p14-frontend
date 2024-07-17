import React from 'react';
import styled from 'styled-components';
import Button from '@/components/common/buttons/Button';
import Page from '@/components/common/Page';
import styles from '@/styles/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

const Container = styled.div`
  margin: auto;
  text-align: center;
`;
const Text = styled.div`
  margin-top: -80px;
  margin-bottom: 24px;
  font-size: 24px;
  font-style: italic;
  color: ${styles.colors.gray5};
  text-align: center;
`;

const ErrorMsg = ({ t }: WithTranslation) => {
  const history = useHistory();
  const onBack = () => history.push('/');

  return(
    <Page>
      <Container>
        <Text>{ t('component.common.error.text') }</Text>
        <Button label={ t('common.back') } onTap={onBack} />
      </Container>
    </Page>
  )
}

export default withTranslation()(ErrorMsg);
