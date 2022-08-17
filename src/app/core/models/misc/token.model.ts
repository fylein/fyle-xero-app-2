import { User } from "../db/user.model";

export type Token = {
  access_token: string;
  refresh_token: string;
  user: User;
};
