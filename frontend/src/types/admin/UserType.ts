export interface UserAdmin {
  user_id: number;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface UserAdminProps {
  user: UserAdmin;
  page: 'users';
  onCheckboxChange: (checked: boolean, userId: number) => void;
  isDeleting: boolean;
}
