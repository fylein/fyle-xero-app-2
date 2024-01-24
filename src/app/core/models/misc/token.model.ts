import { User } from "../db/user.model";

export type Token = {
  access_token: string;
  refresh_token: string;
  user: User;
};

export type ClusterDomainWithToken = {
  cluster_domain: string;
  tokens: Token;
};
