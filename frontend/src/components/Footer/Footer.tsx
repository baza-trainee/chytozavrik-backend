'use client';

import Link from 'next/link';
import { Route } from '@/constants';
import classNames from 'classnames';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail } from 'lucide-react';
import { useQueryContactInfo } from '@/hooks/useQueryContactInfo';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import { Fragment } from 'react';
import { useGetDocuments } from '@/hooks/useGetDocuments';
import Container from '../common/Container/Container';
import Typography from '../common/Typography/Typography';
import styles from './Footer.module.scss';

interface IDocument {
  file: string;
  name: string;
  id: number;
  updated_at: string;
}
const Footer = () => {
  const pathName = usePathname();
  const isShowFooter = !pathName.includes(Route.WIGWAM);
  const { contacts } = useQueryContactInfo();
  const { documents } = useGetDocuments();

  return (
    isShowFooter && (
      <footer className={styles.footer}>
        <Container className={styles.container}>
          <div className={styles.footerContainer}>
            <Link href="/" className={styles.logoContainer}>
              <Image
                src="/images/logo/logo-footer.svg"
                width={58}
                height={50}
                alt="Logo"
                className={styles.logo}
              />
              <Image
                src="/images/logo/chytozavryk-footer.svg"
                width={120}
                height={16}
                alt="Logo"
                className={styles.logoText}
              />
            </Link>

            <div className={styles.wrapper}>
              <div className={classNames(styles.list, styles.informationText, styles.footerList)}>
                <ul className={styles.class4}>
                  <Typography className={styles.informationText} component="p" variant="footer">
                    <Link href="https://baza-trainee.tech">Про проєкт</Link>
                  </Typography>
                  <Typography className={styles.informationText} component="p" variant="footer">
                    <Link href={Route.WIGWAM_LOBBY}>До вігваму</Link>
                  </Typography>
                </ul>
                {Array.isArray(documents) && documents.length > 0 && (
                  <ul className={styles.class1}>
                    {documents?.map((document: IDocument) => (
                      <Fragment key={document.id}>
                        <Typography
                          className={styles.informationText}
                          component="p"
                          variant="footer"
                        >
                          <Link
                            href={`${document.file}#toolbar=0`}
                            target="_blank"
                            className={styles.linkText}
                          >
                            {document.name}
                          </Link>
                        </Typography>
                      </Fragment>
                    ))}
                  </ul>
                )}
              </div>

              <div className={classNames(styles.list, styles.contacts)}>
                <ul>
                  <Typography className={styles.informationContact} component="p" variant="h6">
                    <Phone width={18} height={18} className={styles.image} />
                    {contacts && formatPhoneNumber(contacts.first_phone)}
                  </Typography>

                  {contacts && contacts.second_phone && (
                    <Typography
                      className={styles.informationContactSecond}
                      component="p"
                      variant="h6"
                    >
                      <Phone width={18} height={18} className={styles.image} />
                      {contacts && formatPhoneNumber(contacts.second_phone)}
                    </Typography>
                  )}
                  <a href={`mailto:${contacts && contacts.email}`}>
                    <Typography
                      className={styles.informationMail}
                      component="p"
                      variant="footer-mail"
                    >
                      <Mail width={18} height={18} className={styles.image} />
                      {contacts && contacts.email}
                    </Typography>
                  </a>
                </ul>
              </div>
            </div>
          </div>

          <Typography className={styles.footerText} component="p" variant="footer-end">
            Розробка Baza Trainee Ukraine 2024 &copy; Усі права захищені
          </Typography>
        </Container>
      </footer>
    )
  );
};

export default Footer;
