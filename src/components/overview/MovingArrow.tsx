import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import dummyData from '../3Ddisplay/dummyData';
import Stack3DPreview from '../3Ddisplay/Stack3DPreview';

const MovingArrow = ({ t }: WithTranslation) => {
  return (
    <>
      {' '}
      <Stack3DPreview
        divContainerWidth={400}
        divContainerHeight={400}
        dataToDisplay={dummyData.stackCenter}
        layerHeight={120}
      />
    </>
  );
};

export default withTranslation()(MovingArrow);
