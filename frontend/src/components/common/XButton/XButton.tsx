import type { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { X } from 'lucide-react';
import styles from './XButton.module.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const XButton = ({ className, ...props }: Props) => (
  <button className={classNames(styles.button, className)} type="button" {...props}>
    <X size={24} />
  </button>
);

export default XButton;
