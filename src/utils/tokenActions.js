import { RIPPLE_TEST_NET_URL } from "./constants";
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
	const client = new xrpl.Client(RIPPLE_TEST_NET_URL)
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
	const client = new xrpl.Client(RIPPLE_TEST_NET_URL)
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


/**
 * Create Sell offer
 * @param {string} secret 
 * @param {string} tokenId NFT token id want to sell 
 * @param {string} amount the sale price in drops(millionths of an xrp) 1 xrp = 1000000 drop
 * @param {number} flags if 1 then sell offer, otherwise buy offer
 */
export const createSellOffer = async (secret, tokenId, amount, flags) => {
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client(RIPPLE_TEST_NET_URL)
	await client.connect()
	console.log("Connected to Sandbox")

	// Prepare transaction -------------------------------------------------------
	const transactionBlob = {
		"TransactionType": "NFTokenCreateOffer",
		"Account": wallet.classicAddress,
		"TokenID": tokenId,
		"Amount": amount,
		"Flags": flags
	}

	// Submit signed blob --------------------------------------------------------

	const tx = await client.submitAndWait(transactionBlob, { wallet })//AndWait


	console.log("***Sell Offers***")
	let nftSellOffers
	try {
		nftSellOffers = await client.request({
			method: "nft_sell_offers",
			tokenid: tokenId
		})
	} catch (err) {
		console.log("No sell offers.")
	}
	console.log(JSON.stringify(nftSellOffers, null, 2))
	console.log("***Buy Offers***")
	let nftBuyOffers
	try {
		nftBuyOffers = await client.request({
			method: "nft_buy_offers",
			tokenid: tokenId
		})
	} catch (err) {
		console.log("No buy offers.")
	}
	console.log(JSON.stringify(nftBuyOffers, null, 2))

	// Check transaction results -------------------------------------------------
	console.log("Transaction result:",
		JSON.stringify(tx.result.meta.TransactionResult, null, 2))
	console.log("Balance changes:",
		JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	client.disconnect()
	// End of createSellOffer()
	return {
		sellOffers: nftSellOffers,
		buyOffers: nftBuyOffers
	}
}


export const getSellAndBuyOffers = async (tokenId) => {
	const client = new xrpl.Client(RIPPLE_TEST_NET_URL)
	await client.connect()
	console.log("Connected to Sandbox")
	console.log("***Sell Offers***")
	let nftSellOffers
	try {
		nftSellOffers = await client.request({
			method: "nft_sell_offers",
			tokenid: tokenId
		})
	} catch (err) {
		console.log("No sell offers.")
	}
	console.log(JSON.stringify(nftSellOffers, null, 2))
	console.log("***Buy Offers***")
	let nftBuyOffers
	try {
		nftBuyOffers = await client.request({
			method: "nft_buy_offers",
			tokenid: tokenId
		})
	} catch (err) {
		console.log("No buy offers.")
	}
	console.log(JSON.stringify(nftBuyOffers, null, 2))

	client.disconnect()
	// End of createSellOffer()
	return {
		sellOffers: nftSellOffers,
		buyOffers: nftBuyOffers
	}
}

/**
 * Create Buy Offer
 * @param {string} secret 
 * @param {string} tokenId 
 * @param {number} amount 
 * @param {number} flags 
 * @param {string} owner 
 * @returns {object} sell and buy offers for this token
 */
export const createBuyOffer = async (secret, tokenId, amount, flags, owner) => {

	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
	await client.connect()
	console.log("Connected to Sandbox")

	// Prepare transaction -------------------------------------------------------
	const transactionBlob = {
		"TransactionType": "NFTokenCreateOffer",
		"Account": wallet.classicAddress,
		"Owner": owner,
		"TokenID": tokenId,
		"Amount": amount,
		"Flags": flags
	}

	// Submit signed blob --------------------------------------------------------
	const tx = await client.submitAndWait(transactionBlob, { wallet })

	console.log("***Sell Offers***")
	let nftSellOffers
	try {
		nftSellOffers = await client.request({
			method: "nft_sell_offers",
			tokenid: tokenId
		})
	} catch (err) {
		console.log("No sell offers.")
	}
	console.log(JSON.stringify(nftSellOffers, null, 2))
	console.log("***Buy Offers***")
	let nftBuyOffers
	try {
		nftBuyOffers = await client.request({
			method: "nft_buy_offers",
			tokenid: tokenId
		})
	} catch (err) {
		console.log("No buy offers.")
	}
	console.log(JSON.stringify(nftBuyOffers, null, 2))


	// Check transaction results -------------------------------------------------
	console.log("Transaction result:",
		JSON.stringify(tx.result.meta.TransactionResult, null, 2))
	console.log("Balance changes:",
		JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	client.disconnect()
	return {
		sellOffers: nftSellOffers,
		buyOffers: nftBuyOffers
	}
	// End of createBuyOffer()
}
