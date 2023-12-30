export const formatPhoneNumber = (phoneNumber: string) =>
  phoneNumber.replace(/(\+?\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
