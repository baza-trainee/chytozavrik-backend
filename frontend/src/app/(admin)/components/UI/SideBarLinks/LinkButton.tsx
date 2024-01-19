import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinkProps as NextLinkProps } from 'next/dist/client/link';
import styles from './LinkButton.module.scss';

type LinkProps = NextLinkProps & {
  component: 'link';
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  component?: 'button';
};

type LinkButtonProps = {
  href: string;
  anchor: string;
  icon: ReactNode;
  iconOpen?: ReactNode;
} & (LinkProps | ButtonProps);

const LinkButton = ({ icon, iconOpen, anchor, ...props }: LinkButtonProps) => {
  const pathname = usePathname();

  const children = (
    <>
      <div>{icon}</div>
      {anchor}
      {iconOpen && <div className={styles.arrow}>{iconOpen}</div>}
    </>
  );

  if (props.component === 'link') {
    const { href, ...otherProps } = props;

    return (
      <Link
        href={href}
        className={`${styles.link} ${pathname === href && styles.active}`}
        {...otherProps}
      >
        {children}
      </Link>
    );
  }
  const { href, ...otherProps } = props;

  return (
    <button
      type="button"
      className={`${styles.link} ${pathname === href && styles.active}`}
      {...(otherProps as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default LinkButton;
