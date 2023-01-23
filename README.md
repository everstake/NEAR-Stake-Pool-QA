## Requires Node.JS installed. v.16.15.1   
## Test run: 
```  
- npm install   
- npm run test  
``` 
## Filter test run by title or tag:   
``` npx playwright test -g <'testName or tag'>   
```
## Setup environment for test executing: create **.env** config file, add ENVIRONMENT = "localNet" or "testnet" or "mainNet"   
## For localNet local client build is needed.   
## Setup user accounts in **.env** file according to **.env_template** example.   
## Investor account must be in smart-contract white list to be able manage validators.   
## Note: First user stake, instant unstake, delayed unstake transactions for new accounts must be created manually. It requires specific payments. You may also setup initial script using transaction scenarios but without validations.   