'use client';

import React, { useMemo, useState } from 'react';
import Select, {
  ActionMeta,
  SingleValue,
  GroupBase,
  InputActionMeta,
  components,
  StylesConfig,
} from 'react-select';
import IconButton from '@/components/common/IconButton';
import { ChevronUp, ChevronDown, XCircle, AlertCircle } from 'lucide-react';
import styles from './SearchableSelect.module.scss';

const DropdownIndicator = (props: any) => {
  const { clearInput, selected, inputValue, isOpen, handleMenuIsOpen } = props;

  return (
    <components.DropdownIndicator {...props}>
      <>
        {!inputValue && !selected && (
          <IconButton
            icon={isOpen ? <ChevronUp /> : <ChevronDown />}
            onClick={() => handleMenuIsOpen(false)}
          />
        )}
        {inputValue && <XCircle className={styles.xCircle} onClick={clearInput} />}
      </>
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props: any) => {
  const { clearInput } = props;

  return (
    <components.ClearIndicator {...props}>
      <XCircle className={styles.xCircle} onClick={clearInput} />
    </components.ClearIndicator>
  );
};

const Option = (props: any) => {
  const { label, author } = props.data;

  return (
    <components.Option {...props}>
      <div className={styles.option}>
        <p>
          {label}
          <span> | {author}</span>
        </p>
      </div>
    </components.Option>
  );
};

export interface SearchableSelectProps {
  onChange: ((newValue: SingleValue<string>, actionMeta: ActionMeta<string>) => void) | undefined;
  onInputChange?: ((newValue: string, actionMeta: InputActionMeta) => void) | undefined;
  clearInput: () => void;
  options: GroupBase<string>[];
  selected: SingleValue<string>;
  inputValue?: SingleValue<string>;
  label: string;
  error?: string;
  loading: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  onChange,
  onInputChange,
  clearInput,
  loading,
  options,
  selected,
  inputValue,
  label,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuIsOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const customStyles: StylesConfig<string, false, GroupBase<string>> = useMemo(
    () => ({
      input: (provided: any) => ({
        ...provided,
        color: isOpen ? '#7791fa' : '#000',
      }),
      control: (provided: any) => ({
        ...provided,
        color: isOpen ? '#7791fa' : '#727272',
        border: '1px solid #e3f0ff',
        minWidth: '722px',
        borderRadius: '8px',
        backgroundColor: '#FDFDFD',
      }),
      placeholder: (provided: any) => ({
        ...provided,
        color: isOpen ? '#7791fa' : '#727272',
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: isOpen ? '#7791fa' : '#000',
      }),
      valueContainer: (provided: any) => ({
        ...provided,
        color: isOpen ? '#7791fa' : '#000',
      }),
      menuList: (provided: any) => ({
        ...provided,
        paddingTop: '0px',
        maxHeight: '227px',
        '::-webkit-scrollbar': {
          width: '8px',
          height: '0px',
        },
        '::-webkit-scrollbar-track': {
          background: '#ffffff',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#e3f0ff',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#e3f0ff',
        },
      }),
      menu: (provided: any) => ({
        ...provided,
        marginTop: '0px',
        border: 'none',
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        padding: '12px 16px',
        border: '1px solid #e3f0ff',
        backgroundColor: state.isSelected ? '#e3f0ff' : provided.backgroundColor,
      }),
      dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: !inputValue && !selected ? '8px' : inputValue ? '8px' : '0px',
      }),
      indicatorSeparator: () => ({
        display: 'none',
      }),
    }),
    [inputValue, selected, isOpen]
  );

  return (
    <div
      className={
        isOpen
          ? `${styles.searchableSelectContainer} ${styles.active}`
          : styles.searchableSelectContainer
      }
    >
      <label className={styles.label}>{label}</label>

      <Select
        className={styles.searchableSelect}
        styles={customStyles}
        options={options}
        onChange={onChange}
        onInputChange={onInputChange}
        isSearchable
        placeholder="Оберіть назву книги"
        value={selected}
        components={{
          DropdownIndicator: (props: any) =>
            DropdownIndicator({
              ...props,
              clearInput,
              selected,
              inputValue,
              isOpen,
              handleMenuIsOpen,
            }),
          ClearIndicator: (props: any) => ClearIndicator({ ...props, clearInput }),
          Option,
        }}
        isClearable
        menuIsOpen={isOpen}
        onMenuOpen={() => handleMenuIsOpen(true)}
        onMenuClose={() => handleMenuIsOpen(false)}
        classNamePrefix="select"
      />
      {error && (
        <div className={styles.error}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
