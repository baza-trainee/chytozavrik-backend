import React, { HTMLAttributes, ReactNode } from 'react';
import styles from './IconButton.module.scss';

type Props = HTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
};

const ClearButtonIcon = ({ icon, ...props }: Props) => (
  <button className={styles.button} type="button" {...props}>
    {icon}
  </button>
);

export default ClearButtonIcon;
