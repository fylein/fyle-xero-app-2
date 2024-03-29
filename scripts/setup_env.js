const { writeFile } = require("fs");

const environment = {
  production: `${process.env.PRODUCTION ? process.env.PRODUCTION : "false"}`,
  fyle_client_id: `${process.env.FYLE_CLIENT_ID ? process.env.FYLE_CLIENT_ID : '{{FYLE_CLIENT_ID}}'}`,
  callback_uri: `${process.env.CALLBACK_URI ? process.env.CALLBACK_URI : '{{CALLBACK_URI}}'}`,
  cluster_domain_api_url: `${process.env.CLUSTER_DOMAIN_API_URL ? process.env.CLUSTER_DOMAIN_API_URL : '{{CLUSTER_DOMAIN_API_URL}}'}`,
  app_url: `${process.env.APP_URL ? process.env.APP_URL : '{{APP_URL}}'}`,
  xero_client_id: `${process.env.XERO_CLIENT_ID ? process.env.XERO_CLIENT_ID : '{{XERO_CLIENT_ID}}'}`,
  old_xero_app_url: `${process.env.OLD_XERO_APP_URL ? process.env.OLD_XERO_APP_URL : '{{OLD_XERO_APP_URL}}'}`,
  xero_scope: `${process.env.XERO_SCOPE ? process.env.XERO_SCOPE : '{{XERO_SCOPE}}'}`,
  xero_authorize_uri: `${process.env.XERO_AUTHORIZE_URI ? process.env.XERO_AUTHORIZE_URI : '{{XERO_AUTHORIZE_URI}}'}`,
  sentry_dsn: `${process.env.SENTRY_DSN ? process.env.SENTRY_DSN : '{{SENTRY_DSN}}'}`,
  sentry_env: `${process.env.SENTRY_ENV ? process.env.SENTRY_ENV : '{{SENTRY_ENV}}'}`,
  release: `${process.env.RELEASE ? process.env.RELEASE : '{{RELEASE}}'}`,
  fyle_app_url: `${process.env.FYLE_APP_URL ? process.env.FYLE_APP_URL : '{{FYLE_APP_URL}}'}`,
  xero_callback_uri: `${process.env.XERO_CALLBACK_URI ? process.env.XERO_CALLBACK_URI : '{{XERO_CALLBACK_URI}}'}`,
  tests: {
    workspaceId: `${process.env.TESTS_WORKSPACEID ? process.env.TESTS_WORKSPACEID : '{{TESTS_WORKSPACEID}}'}`,
  },
  refiner_survey: {
    onboarding_done_survery_id: `${process.env.REFINER_ONBOARDING_DONE_SURVEY_ID ? process.env.REFINER_ONBOARDING_DONE_SURVEY_ID : '{{REFINER_ONBOARDING_DONE_SURVEY_ID}}'}`,
    export_done_survery_id: `${process.env.REFINER_EXPORT_DONE_SURVEY_ID ? process.env.REFINER_EXPORT_DONE_SURVEY_ID : '{{REFINER_EXPORT_DONE_SURVEY_ID}}'}`,
  },
  e2e_tests: {
    env: `${process.env.E2E_TESTS_ENV ? process.env.E2E_TESTS_ENV : '{{E2E_TESTS_ENV}}'}`,
    secret: [{
        org_id: `${process.env.E2E_TESTS_ORG_ID_1 ? process.env.E2E_TESTS_ORG_ID_1 : '{{E2E_TESTS_ORG_ID_1}}'}`,
        workspace_id: `${process.env.E2E_TESTS_WORKSPACE_ID_1 ? process.env.E2E_TESTS_WORKSPACE_ID_1 : '{{E2E_TESTS_WORKSPACE_ID_1}}'}`,
        refresh_token: `${process.env.E2E_TESTS_REFRESH_TOKEN_1 ? process.env.E2E_TESTS_REFRESH_TOKEN_1 : '{{E2E_TESTS_REFRESH_TOKEN_1}}'}`,
    },
    {
      org_id: `${process.env.E2E_TESTS_ORG_ID_2 ? process.env.E2E_TESTS_ORG_ID_2 : '{{E2E_TESTS_ORG_ID_2}}'}`,
      workspace_id: `${process.env.E2E_TESTS_WORKSPACE_ID_2 ? process.env.E2E_TESTS_WORKSPACE_ID_2 : '{{E2E_TESTS_WORKSPACE_ID_2}}'}`,
      refresh_token: `${process.env.E2E_TESTS_REFRESH_TOKEN_2 ? process.env.E2E_TESTS_REFRESH_TOKEN_2 : '{{E2E_TESTS_REFRESH_TOKEN_2}}'}`,
    }
  ],
    client_id: {
        [process.env.E2E_TESTS_WORKSPACE_ID]: `${process.env.E2E_TESTS_CLIENT_ID ? process.env.E2E_TESTS_CLIENT_ID : '{{E2E_TESTS_CLIENT_ID}}'}`
    }
}
};

const targetPath = './src/environments/environment.json';
writeFile(targetPath, JSON.stringify(environment), 'utf8', (err) => {
  if (err) {
    return console.error(err);
  }
});
