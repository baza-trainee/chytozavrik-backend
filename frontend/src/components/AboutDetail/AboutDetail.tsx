import Image from 'next/image';
import Container from '../common/Container/Container';
import Typography from '../common/Typography/Typography';
import styles from './AboutDetail.module.scss';
import kids1 from '../../../public/images/aboutDet_kids1.png';
import kids2 from '../../../public/images/aboutDet_kids2.png';
import kids3 from '../../../public/images/aboutDet_kids3.png';
import kids4 from '../../../public/images/aboutDet_kids4.png';
import kids5 from '../../../public/images/aboutDet_kids5.png';

const AboutDetail = () => (
  <section className={styles.section}>
    <Container className={styles.container}>
      <div className={styles.item}>
        <Image className={styles.img} src={kids1} alt="kids1" />
        <div className={styles.info}>
          <Typography component="h2" variant="h5" className={styles.title}>
            Сприяє розвитку читацьких навичок дитини
          </Typography>
          <Typography variant="body" component="p" className={styles.text}>
            Читозаврик поєднує у собі читання та гру, що стимулює дитину до активного сприйняття
            прочитаного матеріалу. Це допомагає розвивати читацькі навички та вдосконалювати
            розуміння прочитаного тексту.
          </Typography>
        </div>
      </div>
      <div className={styles.item}>
        <Image className={styles.img} src={kids2} alt="kids2" />
        <div className={styles.info}>
          <Typography component="h2" variant="h5" className={styles.title}>
            Підвищує мотивацію до читання
          </Typography>
          <Typography variant="body" component="p" className={styles.text}>
            Заохочення у вигляді вікторини та винагород може бути сильним мотиватором для дитини.
            Вона буде радіти проходженню вікторини, оскільки це дає відчуття досягнення та
            впевненості у своїх знаннях.
          </Typography>
        </div>
      </div>
      <div className={styles.item}>
        <Image className={styles.img} src={kids3} alt="kids3" />
        <div className={styles.info}>
          <Typography component="h2" variant="h5" className={styles.title}>
            Розширює знання та розвиває мислення
          </Typography>
          <Typography variant="body" component="p" className={styles.text}>
            Вікторина в Читозаврику містить питання, що спонукають дитину до роздумів та аналізу
            прочитаного. Вона змушує дитину розуміти текст, знаходити логічні зв&apos;язки та
            запам&apos;ятовувати деталі.
          </Typography>
        </div>
      </div>
      <div className={styles.item}>
        <Image className={styles.img} src={kids4} alt="kids4" />
        <div className={styles.info}>
          <Typography component="h2" variant="h5" className={styles.title}>
            Сприяє родинній взаємодії
          </Typography>
          <Typography variant="body" component="p" className={styles.text}>
            Читозаврик може стати чудовим способом спільно проводити час з дитиною. Батьки можуть
            підтримувати та заохочувати дитину у процесі читання, а потім разом відповідати на
            питання вікторини, обговорюючи прочитане. Це не тільки сприяє близькості в сім&apos;ї, а
            й підтримує інтерес до книг.
          </Typography>
        </div>
      </div>
      <div className={styles.item}>
        <Image className={styles.img} src={kids5} alt="kids5" />
        <div className={styles.info}>
          <Typography component="h2" variant="h5" className={styles.title}>
            Батькам легко відстежувати прогрес
          </Typography>
          <Typography variant="body" component="p" className={styles.text}>
            Батьки матимуть можливість переглядати результати вікторини своєї дитини. Це дозволить
            батькам відстежувати прогрес у читанні та переконуватися в тому, що їхня дитина отримує
            користь від використання додатку.
          </Typography>
        </div>
      </div>
    </Container>
  </section>
);

export default AboutDetail;
