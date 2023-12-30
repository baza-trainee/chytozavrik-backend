import React from 'react';
import { AdminHeader, TableHeader } from '@/app/(admin)/components';
import { Metadata } from 'next';
import { getContactsService } from '@/services/api';
import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';
import Contacts from './components/Contacts';
import styles from './Contacts.module.scss';

export const metadata: Metadata = {
  title: 'Контакти - Читозаврик',
};

interface ContactsResponse {
  id: number;
  first_phone: string;
  second_phone: string;
  email: string;
  updated_at: string;
}

const ContactsPage = async () => {
  const queryClient = new QueryClient();
  const contacts: ContactsResponse = await queryClient.fetchQuery({
    queryKey: ['contact-info'],
    queryFn: getContactsService,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={styles.contacts}>
        <AdminHeader withSearch={false} withButton={false} withClose={false} heading="Контакти" />
        <div>
          <TableHeader variant="contacts" colNames={['Перелік контактів', 'Дата  оновлення']} />
          <Contacts contacts={contacts} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default ContactsPage;

// export default Contacts;
