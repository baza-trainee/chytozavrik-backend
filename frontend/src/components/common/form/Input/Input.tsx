'use client';

import React, { InputHTMLAttributes, ReactNode, useMemo } from 'react';
import { useController, UseControllerProps, FieldValues } from 'react-hook-form';
import { AlertCircle, XCircle } from 'lucide-react';
import IconButton from '@/components/common/IconButton';
import styles from './Input.module.scss';

export type InputProps<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<T> & {
    icon?: ReactNode;
    additionalIcon?: ReactNode;
    label?: string;
    resetField?: () => void;
    handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    usage?: string;
  };

export type InputStatus = 'normal' | 'filled' | 'error';

const Input = <T extends FieldValues>({
  label,
  name,
  control,
  icon,
  resetField,
  className,
  handleKeyDown,
  additionalIcon,
  usage,
  ...props
}: InputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController<T>({ name, control });

  const status = useMemo<InputStatus>(() => {
    if (error) {
      return 'error';
    }
    if (field.value) {
      return 'filled';
    }
    return 'normal';
  }, [error, field.value]);

  const renderIcon = useMemo(() => {
    if (status === 'error') {
      return field.value?.length > 0 ? (
        <IconButton onClick={resetField} icon={<XCircle />} />
      ) : (
        <AlertCircle />
      );
    }

    if (icon) {
      return icon;
    }

    if (field.value.length > 0 && props.type === 'email') {
      return <IconButton onClick={resetField} icon={<XCircle />} />;
    }

    return null;
  }, [field.value?.length, icon, resetField, status, props.type]);

  const renderAdditionalIcon = useMemo(() => {
    if (additionalIcon && field.value.length > 0) {
      return additionalIcon;
    }
    return null;
  }, [additionalIcon, field.value]);

  return (
    <div className={`${styles.group} ${className || ''}`} data-status={status}>
      <label className={styles.label}>
        {label && <span className={styles['label-text']}>{label}</span>}
        <span className={styles['input-group']}>
          <input
            className={styles.input}
            {...field}
            onKeyDown={handleKeyDown && handleKeyDown}
            {...props}
          />
          {renderIcon && <span className={styles.icon}>{renderIcon}</span>}
          {renderAdditionalIcon && (
            <span className={`${styles.icon} ${styles.additionalIcon}`}>
              {renderAdditionalIcon}
            </span>
          )}
        </span>
      </label>
      {error &&
        (usage === 'admin' ? (
          <div className={styles.errorMessage}>
            <AlertCircle width={14} height={14} />
            <span>{error.message}</span>
          </div>
        ) : (
          <span className={styles.message}>{error.message}</span>
        ))}
    </div>
  );
};

export default Input;
