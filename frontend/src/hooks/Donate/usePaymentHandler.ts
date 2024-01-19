import { useState } from 'react';
import { useAuthAxiosInstance } from '@/hooks';

const usePaymentHandler = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const axios = useAuthAxiosInstance();

  const handlePayment = async ({ paymentData }: { paymentData: { amount: number } }) => {
    if (paymentData) {
      try {
        const { data } = await axios.post(`pay/`, paymentData);
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
