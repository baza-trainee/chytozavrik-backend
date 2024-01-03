'use client';

import React, { useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import IconButton from '@/components/common/IconButton';
import Input, { InputProps } from '../Input/Input';

const PasswordInput = <T extends FieldValues>(props: InputProps<T>) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { isPass, isShowMessage, ...inputProps } = props;

  const clickIconHandler = () => {
    setIsShowPassword(prev => !prev);
  };

  return (
    <div>
      <Input
        type={isShowPassword ? 'text' : 'password'}
        {...inputProps}
        icon={
          <IconButton icon={isShowPassword ? <EyeOff /> : <Eye />} onClick={clickIconHandler} />
        }
        isPass={isPass}
        isShowMessage={isShowMessage}
      />
    </div>
  );
};

export default PasswordInput;
