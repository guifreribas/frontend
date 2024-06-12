export type User = {
  _id: string;
  name: string;
  lastname: string;
  age: number;
  email: string;
  password: string;
  phone: string;
  gender: GenderTypes;
};

export type UserResponse = {
  count: number;
  users: User[];
  page: string;
  ok: boolean;
};

export type UserAddResponse = {
  count: number;
  user: User;
  ok: boolean;
  page: string;
};

export type UserUpdateResponse = {
  user: User;
  ok: boolean;
};

export type UserDeleteResponse = {
  message: string;
  user: User;
  ok: boolean;
};

export type GenderTypes = 'MALE' | 'FEMALE' | 'OTHER' | null;

export type UserActionForm = 'ADD' | 'EDIT' | 'DELETE' | null;
