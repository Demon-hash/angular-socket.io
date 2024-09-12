export type UserModel = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  token?: string;
  online?: boolean;
};
