'use client';

import React, { InputHTMLAttributes, ReactNode, useMemo } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import IconButton from 'components/common/IconButton/IconButton';
import { XCircle } from 'lucide-react';
import styles from './AdminSearch.module.scss';

export type InputProps<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<T> & {
    icon?: ReactNode;
    resetField?: () => void;
    handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  };

export type InputStatus = 'normal' | 'filled' | 'error';

const AdminSearch = <T extends FieldValues>({
  name,
  control,
  icon,
  resetField,
  className,
  handleKeyDown,
  ...props
}: InputProps<T>) => {
  const { field } = useController<T>({ name, control });

  const status = useMemo<InputStatus>(() => {
    if (field.value) {
      return 'filled';
    }
    return 'normal';
  }, [field.value]);

  const renderIcon = useMemo(() => {
    if (field.value?.length > 0) {
      return <IconButton onClick={resetField} icon={<XCircle width={24} />} />;
    }
    return null;
  }, [field.value?.length, icon, resetField, status, props.type]);

  return (
    <div className={`${styles.group} ${className || ''}`} data-status={status}>
      <label className={styles.label}>
        <span className={styles['input-group']}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            className={styles.input}
            {...field}
            onKeyDown={handleKeyDown && handleKeyDown}
            {...props}
          />
          {renderIcon && <span className={styles.icon}>{renderIcon}</span>}
        </span>
      </label>
    </div>
  );
};

export default AdminSearch;
