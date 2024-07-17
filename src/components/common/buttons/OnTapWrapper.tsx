import React, {
  TouchEventHandler,
  ReactElement,
  useState,
  PropsWithChildren,
} from 'react';

interface OnTapWrapperProps {
  onTap?: TouchEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}
const OnTapWrapper = (props: PropsWithChildren<OnTapWrapperProps>) => {
  const { children,disabled, onTap } = props;
  const [isTapFiring, setIsTapFiring] = useState(false);
  return (
    <div
      onTouchStart={() => setIsTapFiring(true)}
      onTouchMove={() => setIsTapFiring(false)}
      onTouchEnd={(e: any) => {
        if (disabled!==false && isTapFiring === true) {
          onTap?.(e);
        }
        setIsTapFiring(false);
      }}
    >
      {children}
    </div>
  );
};
export default OnTapWrapper;
