import Image from 'next/image';
import { Button, Typography } from '@/components/common';
import catImage from 'public/images/cat/cat-question.svg';
import styles from './Toast.module.scss';

type Props = {
  onAction: () => void;
};

const ErrorToast = ({ onAction }: Props) => (
  <div className={styles.toast}>
    <div className={styles.body}>
      <div className={styles.thumb}>
        <Image className={styles.image} src={catImage} alt="Задумливий кіт" />
      </div>
      <div className={styles['body-wrapper']}>
        <Typography className={styles.title} component="h2" variant="h2">
          Неправильно
        </Typography>
        <Typography component="p" variant="body">
          Спробуй подумати ще раз.
        </Typography>
      </div>
    </div>

    <div className={styles['button-wrapper']}>
      <Button className={styles.button} color="error" onClick={onAction}>
        Спробувати ще
      </Button>
    </div>
  </div>
);

export default ErrorToast;
