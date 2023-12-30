// export interface Contact {
//   id: number;
//   first_phone: string;
//   second_phone: string;
//   email: string;
//   updated_at: string;
// }

// export interface ContactsResponse {
//   data: Contact[];
// }

// export interface ContactsFormProps {
//   contacts: Contact[];
// }

export interface Contact {
  id: number;
  first_phone: string;
  second_phone?: string; // second_phone is optional
  email: string;
  updated_at: string;
}

// export interface CustomResponse_ContactSerializer {
//   status: string;
//   title: string;
//   data: {
//     id: number;
//     first_phone: string;
//     second_phone?: string;
//     email: string;
//     updated_at: string;
//   };
// }

// export interface ContactsResponse {
//   data: Contact[];
// }

export interface ContactsFormProps {
  contacts: Contact;
}
