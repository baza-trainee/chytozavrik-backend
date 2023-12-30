import React from 'react';
import { Metadata } from 'next';
import { AdminHeader, TableHeader } from '@/app/(admin)/components';
import Documents from '@/app/(admin)/admin/documents/components/Documents';
import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';
import { getDocumentsService } from '@/services/api';
import styles from './Documents.module.scss';

export const metadata: Metadata = {
  title: 'Документи - Читозаврик',
};

const DocumentsPage = async () => {
  const queryClient = new QueryClient();

  const documents = await queryClient.fetchQuery({
    queryKey: ['documents'],
    queryFn: getDocumentsService,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={styles.documents}>
        <AdminHeader withSearch={false} withButton={false} withClose={false} heading="Документи" />
        <div>
          <TableHeader
            variant="documents"
            colNames={['Назва документу', 'Дата  оновлення', 'Редагування']}
          />
          <Documents documents={documents.data.data} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default DocumentsPage;
