import * as yup from 'yup';

const phoneRegExp = /^\+\d{1,12}$/;
export const notEmailMatch: yup.TestFunction<string | undefined, Record<string, any>> = (
  value,
  context
) => {
  const emailPart = context?.options?.context?.user?.email?.split('@')[0];
  return !value || value.toLowerCase() !== emailPart?.toLowerCase();
};

const HttpUrlRegex =
  /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

const emailRegex =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const passworsRegex = /^(?=.*[a-zA-Z]).{6,30}$/;

export const validation = {
  email: yup.string().lowercase().matches(emailRegex, 'Не вірна email адреса.').required(),
  signUpPassword: yup.string().required('Пароль не може бути порожнім.'),
  password: yup
    .string()
    .min(8, ({ min }) => `Пароль має бути ${min} символів.`)
    .max(64, ({ max }) => `Пароль має бути не більше ніж ${max} символів.`)
    .matches(passworsRegex, 'Пароль повинен бути латиницею.')
    .matches(/[0-9]/, 'Пароль повинен містити хоча б 1 цифру.')
    .matches(/[A-Z]/, 'Пароль повинен містити хоча б одну велику літеру.')
    .matches(/[a-z]/, 'Пароль повинен містити хоча б одну маленьку літеру')
    .matches(/[@#$%^&+=!]/, 'Пароль повинен містити хоча б один символ з перелічених: "@#$%^&+=!".')
    .test('notEmailMatch', 'Пароль надто схожий на email', notEmailMatch)
    .required('Пароль не може бути порожнім.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароль не співпадає.')
    .required('Будь ласка, підтвердіть пароль.'),
  rememberMe: yup.boolean().required(),
  acceptedRules: yup
    .boolean()
    .oneOf([true], 'Ви повинні прийняти правила користування сайтом.')
    .required(),
  donate: yup
    .mixed()
    .test('is-valid-amount', 'Сума донату повинна бути числом більшим за 0', value => {
      if (typeof value === 'string' || typeof value === 'number') {
        const number = parseFloat(value.toString());
        return !Number.isNaN(number) && number > 0;
      }
      return false;
    })
    .required(),
  bookInput: yup
    .string()
    .min(2, 'Мінімальна кількість символів 2')
    .required('Будь ласка, заповніть поле'),
  recommended: yup.boolean().required(),
  first_phone: yup
    .string()
    .max(13, 'Введіть коректний номер телефону')
    .test('starts-with-plus', 'Номер телефону має починатися з +', value => {
      if (!value) return false;
      if (!value.startsWith('+38'))
        throw new yup.ValidationError('Номер телефону має починатися з +38');
      return true;
    })
    .test('format-plus380', 'Номер телефону в форматі +380XXXXXXXXX', value => {
      if (!value) return false;
      if (value === '+') return true;
      return phoneRegExp.test(value);
    })
    .required('Введіть номер телефону '),
  second_phone: yup
    .string()
    .max(13, 'Введіть коректний номер телефону')
    .test('starts-with-plus', 'Номер телефону має починатися з +', value => {
      if (!value) return false;
      if (!value.startsWith('+38'))
        throw new yup.ValidationError('Номер телефону має починатися з +38');
      return true;
    })
    .test('format-plus380', 'Номер телефону в форматі +380XXXXXXXXX', value => {
      if (!value) return false;
      if (value === '+') return true;
      return phoneRegExp.test(value);
    }),
  id: yup.string(),
  partnerInput: yup
    .string()
    .required('Будь ласка, заповніть поле')
    .min(2, 'Мінімальна кількість символів 2')
    .matches(
      /^[^\s].*[^\s]$/,
      "Ім'я повинно містити не менше двох символів, починатися та закінчуватися не пробілом"
    ),
  url: yup
    .string()
    .required('Будь ласка, заповніть поле')
    .matches(HttpUrlRegex, 'Невірний формат посилання'),
};
