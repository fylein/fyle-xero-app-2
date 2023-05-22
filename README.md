# fyle-xero-app
Frontend Repository for Fyle &lt;> Xero Integration

### Setup

### Setup - 1 (Recommended)
Follow instructions mentioned in [Integrations Central](https://github.com/fylein/fyle-integrations-central/)

### Setup - 2
* Install dependencies

    ```bash
    npm install
    ```

* Copy `environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/xero-app-2/environment.json src/environments/environment.json
    ```

* Run app

    ```bash
    npm start
    ```

## Running End to End Tests on local
### Setup Org to test
<b>Note:</b> *All the steps mentioned in this section are one time activity*
* It would be very easy if we use this org for running tests since we have pre populated data in Fyle to run tests
    ```
    For Journey/Onboarding E2E Tests
    Email: admin1@fyleforfyleXeroJourney.com | Org Name: Fyle For Xero Journey

    For Micro-actions E2E Tests
    Email: admin1@fyleforfylexero.in | Org Name: Fyle For XeroMicroAction
    
    ```
* Login to this org on [local](http:localhost:4200) once and complete Xero OAuth connection
* Update values for these variables in `e2e_tests` key in `environment.json` (present in `src/environments`) -
*(Copy all these values from local storage)*
<b>Note:</b> *Copy refresh_token from `user` key in local storage*
    ```
        "workspace_id": "",
        "refresh_token": "",
        "org_id": ""
    ```

* For Journey E2E Test we have an sql function to partially setup an org to run tests -
    ```bash
    # bash into database
    \i ../fyle-xero-api/sql/functions/e2e-test-setup-workspace-local.sql;
    ```

* Partially reset the org using the sql script -
    ```sql
    select reset_workspace_e2e(<workspace_id_goes_here>);
    ```
### Helper commands
* Make sure the app and api is up and running
* To open Cypress UI and run end to end test spec wise, use this command -
    ```bash
    npm run cypress:open
    ```
* To reset the org to initial data, use the `reset_workspace_e2e()` sql function and re run tests

### Bonus points
* If we are writing a test that represent an user journey, create the test in the journey folder. Or if it represents a micro action, place it in the micro-actions folder. If we add a new feature and wanted to cover all possible scenarios to write a test, add it to the feature folder, along with month and year.

### End to End Tests on Github
* End to End tests runs on all PRs, after the PR is approved. Only if all tests pass, contributor will be able to merge it to master. This happens against the staging environment. We'll receive a comment in the PR about the run status and code coverage summary.
* End to End tests against production environment will run every Tuesday and Thursday at 2pm.
* Manually if we wanted to trigger end to end tests, we can make use of manual [github action](https://github.com/fylein/fyle-xero-app-2/actions/workflows/manual-e2e.yml) and run it against Staging/Production environment with the specified branch and click on `Run Workflow` button.
* Once the tests are completed, we'll receive a message on slack with the summary and screen recordings incase the test fails.
* Consider the following scenario for example -
    * Developer raised a PR -> reviewer approved it -> e2e failed -> dev fixed the broken test
    * Now, to trigger the action, the developer should manually trigger the github action by creating a label named `run e2e tests` in the PR.
    * Dev will be able to un label and label them multiple times to trigger e2e tests.
    <b>Note</b>: *Labels can be found in the right side section where Reviewer, Assignee are maintained*