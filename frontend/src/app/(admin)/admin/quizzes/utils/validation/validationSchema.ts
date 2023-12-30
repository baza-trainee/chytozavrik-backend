import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  ...[...Array(5)].reduce((acc, _, index) => {
    acc[`question_${index}_isTrue`] = yup.string().required(`Введіть відповідь`);

    for (let j = 0; j < 3; j++) {
      acc[`question_${index}_answer_${j}`] = yup.string().required(`Введіть відповідь`);
    }

    acc[`question_${index}`] = yup
      .string()
      .required(`Питання ${index + 1} є обов'язковим`)
      .test(
        'question-answers-check',
        `Оберіть правильний варіант відповіді для цього питання`,
        (value, { parent }) => Boolean(parent[`question_${index}_isTrue`])
      );

    return acc;
  }, {}),
});
