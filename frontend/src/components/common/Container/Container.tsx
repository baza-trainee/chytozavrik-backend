import { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Container.module.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

const Container = ({ children, className }: Props) => {
  const classes = classNames(styles.container, className);

  return <div className={classes}>{children}</div>;
};

export default Container;
