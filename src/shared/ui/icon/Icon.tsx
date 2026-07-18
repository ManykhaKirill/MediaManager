import type { CSSProperties } from 'react';

import { icons, type IconName } from '@shared/assets/icons';
import styles from './Icon.module.css';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string | undefined;
}

export function Icon({
  name,
  size = 20,
  className
}: IconProps) {
  const style = {
    '--icon-url': `url("${icons[name]}")`,
    '--icon-size': `${size}px`
  } as CSSProperties;

  return (
    <span
      className={`${styles.icon} ${className ?? ''}`}
      style={style}
      aria-hidden="true"
    />
  );
}