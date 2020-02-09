var grpc = require("grpc");
var fs = require("fs");
var auth = require("./auth");
var protoLoader = require("@grpc/proto-loader");

// Due to updated ECDSA generated tls.cert we need to let gprc know that
// we need to use that cipher suite otherwise there will be a handhsake
// error when we communicate with the lnd rpc server.
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

// Macaroon cred
var macaroonCreds = grpc.credentials.createFromMetadataGenerator((
  args,
  callback
) => {
  var macaroon = fs.readFileSync(auth.config.AUTH).toString("hex");
  var metadata = new grpc.Metadata();
  metadata.add("macaroon", macaroon);
  callback(null, metadata);
});

var lndCert = fs.readFileSync(auth.config.CERT);
var sslCreds = grpc.credentials.createSsl(lndCert);

var creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);

// Create Lightning rpc
var packageDefinition = protoLoader.loadSync("rpc.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var lnrpc = protoDescriptor.lnrpc;
var walletUnlocker = new lnrpc.WalletUnlocker(auth.config.HOST, sslCreds);
var lightning = new lnrpc.Lightning(auth.config.HOST, creds);

lightning.getInfo({}, function(err, response) {
  	if (err) console.log('Error:', err);
  	if (response) console.log('GetInfo:', response);
  });

// Response-streaming RPC
// Create an invoice and it will display in console.
const invoiceRequest = {
	value: 1000
}

lightning.addInvoice(invoiceRequest, (err, response) => {
	if (err) console.log(err)
	if (response) console.log("Added Invoice", response)
})

// Monitor invoices
var call = lightning.subscribeInvoices({});
call.on('data', function(invoice) {
    console.log("Invoice Data", invoice);
})
.on('end', function() {
})
.on('status', function(status) {
  console.log("Current invoice status" + status);
});

module.exports = {
  lightning,
  walletUnlocker
};