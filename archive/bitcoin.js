//load the config file.
var nconf = require('nconf');
//note (Chris) have to look into this, if it can accept payment only, it should be able to.
var bitcoin = require('bitcoinjs-lib');

//load the express framework
var express = require('express');
//set up the router
var router = express.Router()

// define the  add task route
// note (chris) we could link these routes together instead of having the get and post toghether, research how.
router.get('/', function(req, res) {

	//note (Chris) good reference for this transaction builder.
	//https://medium.com/@orweinberger/how-to-create-a-raw-transaction-using-bitcoinjs-lib-1347a502a3a#.q57l9ckap
	//bitcoin.networks.testnet;
	
	//these are exported via the exoort in src/network.jd
	//console.log(bitcoin.networks.testnet);
	//bitcoin.network = bitcoin.networks.testnet;
	
	var satoshiamount = 15000;
	var recipentaddress = "1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK";
	var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet);
	console.log(tx);
	

	//return
	// Add the input (who is paying):
	// [previous transaction hash, index of the output to use]
	//  This has to be the ID a transaction that has already been sent on the network and of course the keys much match and have ability to access this address
	var txId = 'aa94ab02c182214f090e99a0d57021caffd0f195a81c24602b1028b130b63e31';
	tx.addInput(txId, 0);
	// Add the output (who to pay to):
	// [payee's address, amount in satoshis]
		console.log('ddd');

	tx.addOutput(recipentaddress, satoshiamount);
		console.log('ee');

	// Initialize a private key using WIF
	var privateKeyWIF = 'L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy';
	var keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF);

	// Sign the first input with the new key
	tx.sign(0, keyPair);

	// Print transaction serialized as hex
	console.log("transaction serialized as hex"+tx.build().toHex());
	res.send('Sending '+satoshiamount+' to '+recipentaddress);
	// => 0100000001313eb630b128102b60241ca895f1d0ffca21 ...

	// You could now push the transaction onto the Bitcoin network manually
	// (see https://blockchain.info/pushtx)
});

module.exports = router;