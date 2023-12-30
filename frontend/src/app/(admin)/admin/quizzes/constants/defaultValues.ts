export const defaultValuesForm = {
  ...[...Array(5)].reduce((acc, _, index) => {
    acc[`question_${index}`] = '';
    acc[`question_${index}_isTrue`] = '';

    for (let j = 0; j < 3; j++) {
      acc[`question_${index}_answer_${j}`] = '';
    }

    return acc;
  }, {}),
};
