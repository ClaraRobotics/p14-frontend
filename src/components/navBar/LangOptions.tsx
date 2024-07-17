import React, { useState } from 'react';
import styled from 'styled-components';
import { Popover } from 'react-tiny-popover';

import i18n from '@/i18n';
import styles from '@/styles/styles';
import { Lang } from '@/types/common';

import thFlag from '@assets/img/flags/th.png';
import enFlag from '@assets/img/flags/en.png';
import mmFlag from '@assets/img/flags/mm.png';
import khFlag from '@assets/img/flags/kh.png';

interface Option {
  label: string;
  img: any;
}

const AVAILABLE_LANG: Record<Lang, Option> = {
  th: { label: 'ไทย', img: thFlag },
  en: { label: 'English', img: enFlag },
  mm: { label: 'မြန်မာဘာသာစကား', img: mmFlag },
  kh: { label: 'ភាសាខ្មែរ', img: khFlag },
};

interface FlagItemStyledProps {
  img: any;
}

interface OptionsItemStyledProps {
  active?: boolean;
}

const LangOptionsContainer = styled.div`
  .popover {
    z-index: 98 !important;
  }
`;
const FlagItem = styled.div<FlagItemStyledProps>`
  width: 44px;
  height: 44px;
  border: 2px solid ${styles.colors.gray6};
  border-radius: 100%;
  background: url(${(props) => props.img}) center;
  background-size: 44px 44px;
`;

const OptionsContainer = styled.div`
  width: 160px;
  background-color: ${styles.colors.gray7};
  display: flex;
  flex-direction: column;
  -webkit-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  -moz-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
`;

const OptionsItem = styled.div<OptionsItemStyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  color: ${(props) =>
    props.active ? styles.colors.gray2 : styles.colors.gray4};
  width: 100%;
  padding: 8px;
`;

const LangOptions = () => {
  const [open, setOpen] = useState(false);
  const currentLang = i18n.language as Lang;

  const onLangChange = (lang: Lang) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  return (
    <LangOptionsContainer>
      <Popover
        isOpen={open}
        onClickOutside={() => setOpen(false)}
        positions={['bottom']}
        align="end"
        padding={8}
        containerStyle={{ zIndex: '100' }}
        content={
          <OptionsContainer>
            {Object.keys(AVAILABLE_LANG).map((key) => {
              const lang = key as Lang;
              return (
                <OptionsItem
                  key={key}
                  active={lang === currentLang}
                  onTouchEnd={() => onLangChange(lang)}
                >
                  {AVAILABLE_LANG[lang].label}
                </OptionsItem>
              );
            })}
          </OptionsContainer>
        }
      >
        <FlagItem
          img={AVAILABLE_LANG[currentLang].img}
          onTouchEnd={() => setOpen(!open)}
        />
      </Popover>
    </LangOptionsContainer>
  );
};

export default LangOptions;
