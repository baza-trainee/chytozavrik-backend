import React from 'react';
import { Button } from 'components/common';
import styles from './Buttons.module.scss';

const Buttons = ({
  onClick,
  secondBtnText,
}: {
  onClick: () => void;
  secondBtnText: 'Створити' | 'Зберегти';
}) => (
  <div className={styles.buttonsWrapper}>
    <Button variant="outline" className={styles.button} onClick={onClick}>
      Скасувати
    </Button>
    <Button type="submit" color="secondary" className={styles.button}>
      {secondBtnText}
    </Button>
  </div>
);

export default Buttons;
