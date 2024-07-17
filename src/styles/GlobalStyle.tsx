import { createGlobalStyle } from 'styled-components';

import IBMThaiMedium from '@/assets/fonts/IBMPlexSansThai-Medium.ttf';
import IBMThaiSemiBold from '@/assets/fonts/IBMPlexSansThai-SemiBold.ttf';
import IBMThaiBold from '@/assets/fonts/IBMPlexSansThai-Bold.ttf';
import IBMEngMedium from '@/assets/fonts/IBMPlexSans-Medium.ttf';
import IBMEngSemiBold from '@/assets/fonts/IBMPlexSans-SemiBold.ttf';
import IBMEngBold from '@/assets/fonts/IBMPlexSans-Bold.ttf';

import styles from './styles';


const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: 'pt-prime';
    src: url(${IBMThaiMedium});
    font-weight: 400;
    font-style: normal;
    font-display: fallback;
    unicode-range: U+0E00-0E7F;
  }

  @font-face {
    font-family: 'pt-prime';
    src: url(${IBMThaiSemiBold});
    font-weight: 600;
    font-style: normal;
    font-display: fallback;
    unicode-range: U+0E00-0E7F;
  }

  @font-face {
    font-family: 'pt-prime';
    src: url(${IBMThaiBold});
    font-weight: 700;
    font-style: normal;
    font-display: fallback;
    unicode-range: U+0E00-0E7F;
  }

  @font-face {
    font-family: 'pt-prime';
    src: url(${IBMEngMedium});
    font-weight: 400;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: 'pt-prime';
    src: url(${IBMEngSemiBold});
    font-weight: 600;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: 'pt-prime';
    src: url(${IBMEngBold});
    font-weight: 700;
    font-style: normal;
    font-display: fallback;
  }

  body {
    font-family: 'pt-prime';
    font-weight: 400;
    line-height: 1.5;
    width: 1920px;
    height: 1080px;
    max-width: 1920px;
    max-height: 1080px;
    overflow: hidden;
    color: ${styles.colors.gray4};
    background-color: ${styles.colors.gray8};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-decoration: none;
    margin: 0;
  }

  input {
    font-family: 'pt-prime';
    border: none;
    outline: none;

    &:focus {
      border: none;
      outline: none;
    }
  }

  h1 {
    color: ${styles.colors.white};
    font-weight: 700;
  }

  a {
    text-decoration:none;
  }
`;

export default GlobalStyle;
