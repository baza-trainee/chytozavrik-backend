import React from 'react';
import classNames from 'classnames';
import { Trash2 } from 'lucide-react';
import styles from './TableHeader.module.scss';

interface TableHeaderProps {
  colNames: string[];
  variant: 'users' | 'books' | 'documents' | 'partners' | 'contacts';
  handleDelete?: () => void;
}

const TableHeader = ({ colNames, variant, handleDelete }: TableHeaderProps) => {
  const styleNames = {
    users: styles.users,
    books: styles.books,
    documents: styles.documents,
    partners: styles.partners,
    contacts: null,
  };

  return (
    <div className={styles.header}>
      <div className={classNames(styleNames[variant], styles.names)}>
        {colNames.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
      {variant === 'users' || variant === 'books' || variant === 'partners' ? (
        <div className={styles.icon} onClick={handleDelete}>
          <Trash2 width={16} height={16} />
        </div>
      ) : null}
    </div>
  );
};

export default TableHeader;
