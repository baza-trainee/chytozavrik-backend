import React, { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Typography } from '@/components/common';
import { Route } from '@/constants';
import Image from 'next/image';
import { ChildType } from '@/types';
import Modal from 'components/common/ModalActions/Modal';
import EditWigwam from '../EditWigwam';
import styles from './KidProfile.module.scss';

type Props = {
  kid: ChildType;
};

const KidProfile = ({ kid }: Props) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
  const [edit, setEdit] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const editWigwamRef = useRef<HTMLDivElement | null>(null);
  const handleEdit = () => {
    if (!edit) {
      setEdit(true);
    } else {
      setEdit(false);
    }
  };

  useEffect(() => {
    if (edit && editWigwamRef.current) {
      editWigwamRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [edit]);

  const { mutate: handleDelete } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${baseUrl}/users/me/children/${id}/`, {
        headers: {
          Authorization: `Bearer ${session?.user.token.access}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kids'] });
      setIsSuccess(true);
    },
  });

  return (
    <>
      <li key={kid.id} className={styles.item}>
        <Link className={styles.link} href={`${Route.WIGWAM}/${kid.id}`} data-avatar>
          <div className={styles.thumb}>
            <Image
              src={kid.avatar_as_url}
              className={styles.image}
              width={80}
              height={80}
              alt={kid.name}
            />
          </div>
          <Typography component="p" variant="body" className={styles.name}>
            {kid.name}
          </Typography>
        </Link>
        <div className={styles.books}>
          <Typography className={styles.title} component="p" variant="h5">
            Прочитано
          </Typography>
          <div className={styles.wrapper}>
            <Typography className={styles.quantity} component="p" variant="h3">
              {kid.unique_quizzes_passed}
            </Typography>
            <p className={styles.text}>книг</p>
          </div>
        </div>
        <div className={styles.booksQuizzes}>
          <Typography className={styles.title} component="p" variant="h5">
            Вікторин пройдено
          </Typography>
          <div className={styles.quizzes}>
            <div className={styles.wrapper}>
              <p className={styles.quantity}>{kid.unique_quizzes_passed}</p>
              <p className={styles.text}>Загалом</p>
            </div>
            <div className={styles.wrapper}>
              <p className={styles.quantity}>{kid.quizzes_passed_today_max_score}</p>
              <p className={styles.text}>Сьогодні</p>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <div
            onClick={() => {
              handleEdit();
            }}
          >
            <Image src="/images/edit.svg" alt="кнопка редагування" width={36} height={36} />
          </div>
          <div className={styles.button} onClick={() => setIsDeleted(true)}>
            <Image src="/images/delete.svg" alt="кнопка видалення" width={36} height={36} />
          </div>
        </div>
      </li>
      {edit && (
        <div ref={editWigwamRef}>
          <EditWigwam
            closeEditWigwam={handleEdit}
            id={kid.id}
            kidName={kid.name}
            kidAvatar={kid.avatar}
          />
        </div>
      )}
      {(isSuccess || isDeleted) && (
        <Modal
          type={isDeleted ? 'question' : 'success'}
          message={
            isDeleted
              ? 'Ви дійсно хочете видалити вігвам дитини?'
              : "Вігвам дитини було успішно видалено. Всі дані, пов'язані з цим аккаунтом більше не доступні і були назавжди видалені."
          }
          title={isDeleted ? 'Видалити вігвам' : 'Видалення аккаунту завершено!'}
          //
          active={isDeleted || isSuccess}
          setActive={() => {
            setIsSuccess(false);
            setIsDeleted(false);
          }}
          successFnc={() => {
            handleDelete(kid.id);
            setIsDeleted(false);
          }}
        />
      )}
    </>
  );
};

export default KidProfile;
