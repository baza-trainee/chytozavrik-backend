import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Spinner.module.scss';

type Props = HTMLAttributes<HTMLDivElement>;

const Spinner = ({ className, ...props }: Props) => (
  <span className={classNames(styles.loader, className)} {...props} />
);

export default Spinner;
