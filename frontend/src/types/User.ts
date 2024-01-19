export type UserType = {
  id: number;
  email: string;
  is_superuser: boolean;
  childs: string[];
  date_joined: string;
};

export interface UserResponse {
  status: string;
  data: UserType[];
}
