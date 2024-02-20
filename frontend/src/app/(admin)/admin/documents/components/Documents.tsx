import React, { Fragment } from 'react';
import DocumentItem from '@/app/(admin)/components/TableItems/DocumentItem/DocumentItem';
import { DocumentsFormProps } from '@/types/Documents';

const Documents = ({ documents }: DocumentsFormProps) =>
  documents?.map(item => (
    <Fragment key={item.id}>
      <DocumentItem id={item.id} name={item.name} file={item.file} updated_at={item.updated_at} />
    </Fragment>
  ));

export default Documents;
