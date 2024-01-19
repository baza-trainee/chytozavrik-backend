'use client';

import { FieldValues, useController } from 'react-hook-form';
import Input, { InputProps } from '../Input/Input';

const NumberInput = <T extends FieldValues>(props: InputProps<T>) => {
  const { name, control } = props;
  const { field } = useController<T>({ name, control });

  const changeHandler = (evt: any) => {
    field.onChange(evt.target.value.toString().replace(/((\D+)|(^(?:0+(?=[1-9])|0+(?=0$))))/g, ''));
  };

  return <Input {...props} inputMode="numeric" onChange={changeHandler} autoComplete="off" />;
};

export default NumberInput;
