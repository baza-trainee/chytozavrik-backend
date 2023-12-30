/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Check } from 'lucide-react';
import styles from 'components/common/form/Checkbox/Checkbox.module.scss';

interface AdminCheckBoxProps {
  color?: 'primary' | 'secondary';
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: number;
}

const AdminCheckBox = ({ color = 'primary', className, onChange, id }: AdminCheckBoxProps) => (
  <div className={classNames(className)}>
    <label className={styles.label} htmlFor={id.toString()}>
      <span className={classNames(styles['input-group'], styles[`input-group--${color}`])}>
        <input id={id.toString()} className={styles.input} type="checkbox" onChange={onChange} />
        <Check className={styles['input-checked-icon']} strokeWidth={4} />
      </span>
    </label>
  </div>
);

export default AdminCheckBox;
