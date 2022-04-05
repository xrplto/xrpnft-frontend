const xrpl = require("xrpl");

/**
 * Mint nft.
 * @param {string} secret
 * @param {string} tokenUrl
 * @param {number} flags
 * @returns user account nfts when succeed.
 */
export const mintToken = async (secret, tokenUrl, flags) => {
	// const wallet = xrpl.Wallet.fromSeed(secret.value)
	console.log('Minting started...', secret, tokenUrl, flags)
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
	await client.connect()
	console.log("Connected to Devnet")

	// Note that you must convert the token URL to a hexadecimal
	// value for this transaction.
	// ----------------------------------------------------------
	const transactionBlob = {
		TransactionType: "NFTokenMint",
		Account: wallet.classicAddress,
		URI: xrpl.convertStringToHex(tokenUrl),
		Flags: parseInt(flags),
		TokenTaxon: 0 //Required, but if you have no use for it, set to zero.
	}
	// Submit signed blob --------------------------------------------------------
	const tx = await client.submitAndWait(transactionBlob, { wallet })

	const nfts = await client.request({
		method: "account_nfts",
		account: wallet.classicAddress
	})
	console.log(nfts)

	// Check transaction results -------------------------------------------------
	console.log("Transaction result:", tx.result.meta.TransactionResult)
	console.log("Balance changes:",
		JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	client.disconnect()
	return nfts
} //End of mintToken

/**
 * Send NFT burn token transaction.
 * @param {string} secret
 * @param {string} tokenId
 */
export const burnToken = async (secret, tokenId) => {
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
	await client.connect()
	console.log("Connected to Sandbox")

	// Prepare transaction -------------------------------------------------------
	const transactionBlob = {
		"TransactionType": "NFTokenBurn",
		"Account": wallet.classicAddress,
		"TokenID": tokenId.value
	}

	// Submit signed blob --------------------------------------------------------
	const tx = await client.submitAndWait(transactionBlob, { wallet })
	const nfts = await client.request({
		method: "account_nfts",
		account: wallet.classicAddress
	})
	console.log(nfts)
	// Check transaction results -------------------------------------------------
	console.log("Transaction result:", tx.result.meta.TransactionResult)
	console.log("Balance changes:",
		JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	client.disconnect()
}
// End of burnToken()
