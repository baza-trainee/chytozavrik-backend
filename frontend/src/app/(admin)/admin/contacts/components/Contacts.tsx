import React, { Fragment } from 'react';
import ContactItem from '@/app/(admin)/components/TableItems/ContactItem/ContactItem';
import { ContactsFormProps } from '@/types/Contacts';

const Contacts = ({ contacts }: ContactsFormProps) => (
  <Fragment key={contacts.id}>
    <ContactItem
      id={contacts.id}
      first_phone={contacts.first_phone}
      second_phone={contacts.second_phone}
      email={contacts.email}
      updated_at={contacts.updated_at}
    />
  </Fragment>
);
export default Contacts;
