import React, { Dispatch, SetStateAction } from 'react';
import Modal from '../../../../../components/common/ModalActions/Modal';

const ModalWindows = ({
  reset,
  isSuccess,
  isDiscard,
  isEmptySecondPhone,
  setIsSuccess,
  setIsEmptySecondPhone,
  setIsDiscard,
  handleSubmit,
}: {
  isSuccess: boolean;
  isDiscard: boolean;
  isEmptySecondPhone: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  setIsDiscard: Dispatch<SetStateAction<boolean>>;
  setIsEmptySecondPhone: Dispatch<SetStateAction<boolean>>;
  reset: () => void;
  handleSubmit: () => void;
}) => {
  const successFunctionHandler = () => {
    if (isDiscard) {
      setIsDiscard(false);
      reset();
    }
    if (isEmptySecondPhone) {
      setIsEmptySecondPhone(false);
      handleSubmit();
    }
  };
  const getMessage = (isDiscard: boolean, isEmptySecondPhone: boolean) => {
    if (isDiscard) {
      return 'Ви точно хочете скасувати зміни? Вони не будуть збережені';
    }
    if (isEmptySecondPhone) {
      return 'Ви точно хочете залишити тільки один номер телефону?';
    }
    return 'Ваші зміни успішно збережено!';
  };

  const getTitle = (isDiscard: boolean, isEmptySecondPhone: boolean) => {
    if (isDiscard) {
      return 'Скасувати зміни';
    }
    if (isEmptySecondPhone) {
      return 'Залишити один номер телефону';
    }
    return 'Збережено!';
  };

  return (
    <Modal
      type={isDiscard || isEmptySecondPhone ? 'question' : 'success'}
      message={getMessage(isDiscard, isEmptySecondPhone)}
      title={getTitle(isDiscard, isEmptySecondPhone)}
      active={isDiscard || isSuccess || isEmptySecondPhone}
      setActive={() => {
        setIsSuccess(false);
        setIsDiscard(false);
        setIsEmptySecondPhone(false);
      }}
      successFnc={successFunctionHandler}
      cancelButtonText="Повернутись"
    />
  );
};

export default ModalWindows;
