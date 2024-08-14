import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import Button from '../common/buttons/Button';
import NumberInput from '../common/input/NumberInput';
import { useHistory } from 'react-router';
import { electron } from 'process';

interface ExitKioskModeProps extends WithTranslation {
  setShowControlPanel: (value: boolean) => void;
}

const ExitKioskMode = ({ t, setShowControlPanel }: ExitKioskModeProps) => {
  const [passcode, setPasscode] = useState('');
  const history = useHistory();

  const goToDevpage = () => history.push('/dev-page');

  const handleConfirm = () => {
    if (passcode === '1188') {
      alert("go to devpage");
      setShowControlPanel(false);
      goToDevpage();
    }
    else {
      alert("wrong password");
    }
  };

  return (
    <>
      <NumberInput
        keyboardPosition="top"
        value={passcode}
        label={'Password'}
        onChange={(e) => setPasscode(e)}
      />
      <Button label="Confirm" onTap={handleConfirm}/>
    </>
  );
};

export default ExitKioskMode;
