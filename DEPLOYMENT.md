### Deployment Instructions

1. Run the app locally and make sure it does was you expect it to do:
    ```
    npm start
    ```
1. Run unit tests and ensure that all pass:
    ```
    npm test
    ```
1. Validate that coverage is sufficient
    ```
    ---------------|---------|----------|---------|---------|-------------------
    File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ---------------|---------|----------|---------|---------|-------------------
    All files      |     100 |      100 |     100 |     100 |                   
    calculator.ts  |     100 |      100 |     100 |     100 |                   
    ---------------|---------|----------|---------|---------|-------------------
    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        1.749 s
    ```
1. Ensure all changes to be deployed are committed
    ```
    git add all
    git commit -m "Hi mom!"
    ```
1. Push changes to mainline
    ```
    git push
    ```
1. Deploy page with a helpful deployment message that clearly states which mainline commit it is on:
    ```
    npm run deploy -- -m "Deploy laser shark feature. Mainline commit: abc123"
    ```
