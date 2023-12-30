export type AttemptsInfoResponse = {
  score: number;
};

export type sendPasswordResetEmailType = {
  email: string;
};

export type resetPasswordType = {
  new_password1: string;
  new_password2: string;
  uid: string;
  token: string;
};
