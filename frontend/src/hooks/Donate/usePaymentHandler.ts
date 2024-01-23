import { useState } from 'react';
import axios from 'axios';
import * as process from 'process';

const usePaymentHandler = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async ({ paymentData }: { paymentData: { amount: number } }) => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';

    if (paymentData) {
      try {
        const { data } = await axios.post(`${baseUrl}/pay/`, paymentData);
        const checkoutUrl = data?.data.payment_url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      } catch (error) {
        setErrorMessage('Error occurred while processing payment');
        console.error(error);
      }
    } else {
      setErrorMessage('Please enter a valid payment amount');
    }
  };

  return {
    errorMessage,
    handlePayment,
  };
};

export default usePaymentHandler;
