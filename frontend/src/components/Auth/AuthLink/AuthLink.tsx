import { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';
import classNames from 'classnames';
import styles from './AuthLink.module.scss';

type Props = { children?: ReactNode; className?: string } & LinkProps;

const AuthLink = ({ children, className, ...props }: Props) => (
  <Link className={classNames(styles.link, className)} {...props}>
    {children}
  </Link>
);

export default AuthLink;
