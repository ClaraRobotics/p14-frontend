import styles from '@/styles/styles';
import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import ExitKioskMode from './ExitKioskMode';
import ControlButton from '../common/buttons/ControlButton';
import AlertModal from '../common/AlertModal';


const DevComponent = ({ t }: WithTranslation) => {

    const [showControlPanel, setShowControlPanel] = useState(false);

    return (
    <div>
        <div style={{marginTop: '-12px'}} onTouchEnd={() => setShowControlPanel(!showControlPanel)}> 
        <ControlButton
        label={t('Dev')} />
        </div>

        <AlertModal
        title={''}
        show={showControlPanel}
        actionButtonLabel={t('common.ok')}
        onActionButtonTap={() => setShowControlPanel(false)}
        onClickOutside={() => setShowControlPanel(false)}
        >
        <ExitKioskMode setShowControlPanel={setShowControlPanel} />
      </AlertModal>

    </div>
    );


};

export default withTranslation()(DevComponent);
