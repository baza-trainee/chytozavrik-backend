import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import type { LinkProps as NextLinkProps } from 'next/link';
import classNames from 'classnames';
import Spinner from '../Spinner/Spinner';
import styles from './Button.module.scss';

type LinkProps = Omit<NextLinkProps, 'href'> & {
  href: string;
  component: 'link';
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  component?: 'button';
};

type CommonProps = {
  children: ReactNode;
  className?: string | null;
  variant?: 'filled' | 'outline' | 'text';
  color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'success' | 'error';
  size?: 'small' | 'default' | 'big';
  isLoading?: boolean;
  selected?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

type Props = CommonProps & (LinkProps | ButtonProps);

const Button: React.FC<Props> = props => {
  const {
    children,
    className,
    variant = 'filled',
    color = 'primary',
    size = 'default',
    isLoading,
    selected,
    startIcon,
    endIcon,
    component = 'button',
    ...otherProps
  } = props;

  const buttonClassNames = classNames(
    className,
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${color}`],
    styles[`button--${size}`],
    { [styles.loading]: isLoading }
  );

  const renderButtonContent = () => (
    <>
      {startIcon && <span className={styles['button-icon']}>{startIcon}</span>}
      {children}
      {endIcon && <span className={styles['button-icon']}>{endIcon}</span>}
      {isLoading && <Spinner />}
    </>
  );

  if (component === 'link') {
    const { href, ...linkProps } = otherProps as LinkProps;
    return (
      <Link href={href} {...linkProps} className={buttonClassNames} data-selected={selected}>
        {renderButtonContent()}
      </Link>
    );
  }

  const buttonProps = otherProps as ButtonProps;
  return (
    <button type="button" className={buttonClassNames} data-selected={selected} {...buttonProps}>
      {renderButtonContent()}
    </button>
  );
};

export default Button;
