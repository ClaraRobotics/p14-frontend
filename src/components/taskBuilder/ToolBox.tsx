import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { withTranslation, WithTranslation } from 'react-i18next';
import { MdRotateLeft, MdUndo, MdRedo } from 'react-icons/md';
import { RiDeleteBin6Line, RiSave3Line } from 'react-icons/ri';
import { AiOutlineStop } from 'react-icons/ai';

import IconButton from '@/components/common/buttons/IconButton';

import { taskState, taskActions } from '@/store';

const ToolboxContainer = styled.div`
  margin-top: 72px;
  justify-content: center;
  align-items: center;
`;

const ToolBox = ({ t }: WithTranslation) => {
  const [pattern, setPattern] = useRecoilState(taskState);
  const { layout, activeBox, redoStack, undoStack } = pattern;

  const hasActiveBox = activeBox !== null;
  const hasBox = !!layout.length;
  const undoable = !!undoStack.length;
  const redoable = !!redoStack.length;

  const onRotate = () => {
    taskActions.toggleRotate(pattern, setPattern, activeBox);
  };

  const onDelete = () => {
    taskActions.deleteBox(pattern, setPattern, activeBox);
  };

  const onClearAll = () => {
    taskActions.clearAllBox(pattern, setPattern);
  };

  const onUndo = () => {
    taskActions.popUndo(pattern, setPattern);
  };

  const onRedo = () => {
    taskActions.popRedo(pattern, setPattern);
  };

  return (
    <ToolboxContainer>
      <IconButton
        label={t('taskbuilder.pattern.toolbox.rotate')}
        disabled={!hasActiveBox}
        icon={<MdRotateLeft />}
        onTap={hasActiveBox ? onRotate : () => {}}
      />
      <IconButton
        label={t('taskbuilder.pattern.toolbox.delete')}
        disabled={!hasActiveBox}
        icon={<RiDeleteBin6Line />}
        onTap={hasActiveBox ? onDelete : () => {}}
      />
      <IconButton
        label={t('taskbuilder.pattern.toolbox.clearall')}
        disabled={!hasBox}
        icon={<AiOutlineStop />}
        onTap={hasBox ? onClearAll : () => {}}
      />
      <IconButton
        label={t('taskbuilder.pattern.toolbox.undo')}
        disabled={!undoable}
        icon={<MdUndo />}
        onTap={undoable ? onUndo : () => {}}
      />
      <IconButton
        label={t('taskbuilder.pattern.toolbox.redo')}
        disabled={!redoable}
        icon={<MdRedo />}
        onTap={redoable ? onRedo : () => {}}
      />
    </ToolboxContainer>
  );
};

export default withTranslation()(ToolBox);
