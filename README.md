# gRPC-LND-Lightning-NodeJS
This is a fully functioning javascript grpc server for connecting to Lightning nodes based on NodeJS.  You can add commands from [the lightning gRPC api](https://api.lightning.community/#lnd-grpc-api-reference).

This server is based on [this javascript grpc guide](https://dev.lightning.community/guides/javascript-grpc/) and Stage 1 of [the lightning dev tutorial]( https://dev.lightning.community/tutorial/01-lncli/index.html).

This assumes you have completed Stage 1 of the dev tutorial.  If you have not, do that first.

## To Run
### Set up Environment
* Create a .env file
* Add the following variables:
```
CERT="/Users/[user]/Library/Application Support/Lnd/tls.cert"
AUTH="/Users/[user]/go/dev/bob/data/chain/bitcoin/simnet/admin.macaroon"
```
**Make sure to change [user] to whatever your directory path is.  You can find this by typing `pwd` into your command line**

In the AUTH variable above, this is using 'bob' from Stage 1 of [the lightning dev tutorial](https://dev.lightning.community/tutorial/01-lncli/index.html).  We're assuming you're connected to 'bob' at `localhost:10002`, but you can change that in the auth.js file if not.

### Install Node Modules
Type `npm install` into command line to install node modules.

### Run
Run the server by typing `npm run start` into the command line.
