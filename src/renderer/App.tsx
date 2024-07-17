import React, { useState, useCallback, useEffect } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import GlobalStyle from '@/styles/GlobalStyle';
import MainComponent from './MainComponent';
import { HashRouter as Router } from 'react-router-dom';

export default function App() {

  const ConvertMouseToTouch = require('convert-mouse-to-touch');
  ConvertMouseToTouch.init();
	return (
		<RecoilRoot>
			<GlobalStyle />
			<Router>
				<MainComponent />
			</Router>
		</RecoilRoot>
	);
}
