import React from 'react';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { IconContext } from 'react-icons';
import { HiOutlineTemplate } from 'react-icons/hi';
import { MdLibraryAdd } from 'react-icons/md';

import { taskState, taskActions, systemState } from '@/store';

import styles from '@/styles/styles';

const AddBoxButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  top: 55%;
  left: 53%; /* magic number */
  width: 120px;
  transform: translateY(-50%) translateX(-50%) translateX(80px);
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${styles.colors.gray8};
  padding: 16px 0;
  margin-bottom: 32px;
  color: ${styles.colors.primary1};

  &:active {
    color: ${styles.colors.primary2};
  }
`;

const AddBoxButtonLabel = styled.div`
  font-size: 24px;
`;

const AddBoxButton = ({ t }: WithTranslation) => {
  const [task, setTask] = useRecoilState(taskState);
  const [system] = useRecoilState(systemState);
  const [pattern, setPattern] = useRecoilState(taskState);

  const onTapAddBox = () => {
    taskActions.addNewBox(task, setTask, {
      offset: system.overHang + 2 * system.boxMargin * task.layout.length,
    });
  };
  const onTapTemplates = () => {
    taskActions.togglePatternList(pattern, setPattern);
  };

  return (
    <>
      <AddBoxButtonContainer>
        <ButtonWrap onTouchEnd={onTapAddBox}>
          <IconContext.Provider
            value={{
              style: {
                width: '64px',
                height: '64px',
              },
            }}
          >
            <MdLibraryAdd />
          </IconContext.Provider>
          <AddBoxButtonLabel>
            {t('taskbuilder.pattern.button.addbox')}
          </AddBoxButtonLabel>
        </ButtonWrap>
        <ButtonWrap onTouchEnd={onTapTemplates}>
          <IconContext.Provider
            value={{
              style: {
                width: '64px',
                height: '64px',
              },
            }}
          >
            <HiOutlineTemplate />
          </IconContext.Provider>
          <AddBoxButtonLabel>
            {t('taskbuilder.pattern.patternlist.title')}
          </AddBoxButtonLabel>
        </ButtonWrap>
      </AddBoxButtonContainer>
    </>
  );
};

export default withTranslation()(AddBoxButton);
