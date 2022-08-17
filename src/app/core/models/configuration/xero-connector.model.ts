export type XeroCredentials = {
    id: number;
    refresh_token: string;
    country: string;
    created_at: Date;
    updated_at: Date;
    workspace: number;
  };
  export type XeroConnector = {
    code: string;
    realm_id: string;
  }

  export interface XeroConnectorPost extends XeroConnector {
    redirect_uri: string;
  }
