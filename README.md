# gRPC-LND-Lightning-NodeJS
Fully functioning javascript grpc server based on NodeJS.  Based on https://dev.lightning.community/guides/javascript-grpc/ and Stage 1 of https://dev.lightning.community/tutorial/01-lncli/index.html

## To Run
### Set up Environment
* Create a .env file
* Add the following variables:
```
CERT="/Users/[user]/Library/Application Support/Lnd/tls.cert"
AUTH="/Users/[user]/go/dev/bob/data/chain/bitcoin/simnet/admin.macaroon"
```

In the AUTH variable above, this is using 'bob' from Stage 1 of https://dev.lightning.community/tutorial/01-lncli/index.html.  We're assuming you're connected to 'bob' at `localhost:10002`, but you can change that in the auth.js file if not.

### Install Node Modules
Type `npm install` into command line to install node modules.

### Run
Run the server by typing `npm run start` into the command line.
