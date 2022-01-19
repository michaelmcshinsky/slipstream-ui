import React, { useState, forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { useDebounce, useDidMount } from '../../utils';
import { Input } from '../../';
import { Search as SearchIcon } from '../../assets/icons';

export interface SearchProps {
  className?: string;
  customIcon: ReactNode;
  defaultValue?: any;
  delay: number;
  icon?: boolean;
  iconProps: any;
  innerRef?: any;
  inputClassName?: string;
  inputProps?: any;
  onChange?: (value: string) => void;
}

export const Search = forwardRef<HTMLDivElement, SearchProps>(
  (
    {
      className,
      customIcon,
      defaultValue,
      delay,
      icon,
      iconProps,
      innerRef,
      inputClassName,
      inputProps,
      onChange,
      ...props
    },
    ref
  ) => {
    const [searchText, setSearchText] = useState(defaultValue ?? '');
    const debounceSearchText = useDebounce(searchText, delay);

    useDidMount(() => {
      if (debounceSearchText !== null && onChange) {
        onChange(debounceSearchText);
      }
    }, [debounceSearchText]);

    function _handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setSearchText(e.target.value);
    }

    const classes = classNames('sui--search', 'relative', className);
    const inputClasses = classNames({ 'pr-7': icon }, inputClassName);

    return (
      <div ref={ref} className={classes} {...props}>
        <Input
          ref={innerRef}
          type="text"
          className={inputClasses}
          defaultValue={searchText}
          onChange={_handleChange}
          {...inputProps}
        />
        {!!icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {!!customIcon ? { customIcon } : <SearchIcon {...iconProps} />}
          </div>
        )}
      </div>
    );
  }
);

Search.displayName = 'Search';
Search.defaultProps = {
  icon: true,
  delay: 500,
  defaultValue: '',
};

export default Search;
