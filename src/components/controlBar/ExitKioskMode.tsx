import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import Button from '../common/buttons/Button';
import NumberInput from '../common/input/NumberInput';

const ExitKioskMode = ({ t }: WithTranslation) => {
  const [passcode, setPasscode] = useState('');
  return (
    <>
      <NumberInput
        keyboardPosition="top"
        value={passcode}
        label={'Password'}
        onChange={(e) => setPasscode(e)}
      />
      <Button label="Confirm" onTap={()=>{
        if(passcode==="118864"){
          window.electron.ipcRenderer.exitFullScreen();
          alert("exiting");
        }
      }}/>
    </>
  );
};

export default ExitKioskMode;
