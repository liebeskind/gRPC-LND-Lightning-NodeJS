var grpc = require("grpc");
var fs = require("fs");
var auth = require("./auth");
var protoLoader = require("@grpc/proto-loader");

// Due to updated ECDSA generated tls.cert we need to let gprc know that
// we need to use that cipher suite otherwise there will be a handhsake
// error when we communicate with the lnd rpc server.
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

var packageDefinition = protoLoader.loadSync("rpc.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var lnrpc = protoDescriptor.lnrpc;

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
var walletUnlocker = new lnrpc.WalletUnlocker(auth.config.HOST, sslCreds);
var creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
var ln = new lnrpc.Lightning(auth.config.HOST, creds);

ln.getInfo({}, function(err, response) {
  	if (err) console.log('Error:', err);
  	if (response) console.log('GetInfo:', response);
  });

// Response-streaming RPC
// Create an invoice and it will display in console.
var call = ln.subscribeInvoices({});
call.on('data', function(invoice) {
    console.log(invoice);
})
.on('end', function() {
  // The server has finished sending
})
.on('status', function(status) {
  // Process status
  console.log("Current status" + status);
});



module.exports = {
  ln,
  walletUnlocker
};