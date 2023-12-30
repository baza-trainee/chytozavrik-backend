import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button, Typography } from '@/components/common';
import { Route } from '@/constants';
import { useConfetti } from '@/hooks';
import styles from './QuizPrize.module.scss';

type Props = {
  prize: string;
  onReplyQuiz: () => void;
};

const QuizPrize = ({ prize, onReplyQuiz }: Props) => {
  const canvas = useConfetti({ className: styles.confetti });
  const { childId } = useParams();

  return (
    <div className={styles.prize}>
      <div className={styles.thumb}>
        <Image
          className={styles.image}
          src={prize}
          alt="Призове зображення читозаврика"
          width={100}
          height={100}
        />
      </div>
      <div className={styles['text-wrapper']}>
        <Typography className={styles.text} component="h2" variant="h2">
          Молодець!
        </Typography>
        <Typography className={styles.text} component="h2" variant="h2">
          Читозавр з’явиться у твоїй колекції
        </Typography>
      </div>
      <div className={styles['buttons-wrapper']}>
        <Button
          className={styles.button}
          component="link"
          href={`${Route.WIGWAM}/${childId}`}
          color="secondary"
        >
          До вігваму
        </Button>
        <Button className={styles.button} variant="outline" onClick={onReplyQuiz}>
          Пройти ще раз
        </Button>
      </div>
      {canvas}
    </div>
  );
};

export default QuizPrize;
