import { RIPPLE_TEST_NET_URL } from "./constants";
const xrpl = require("xrpl");

/**
 *
 * @param {string} secret account secret key
 * @param {string} tokenUrl url of ipfs JSON
 * @param {number} flags token flags
 * @param {string} issuer (Optional) The issuer of the token,
 * 												if the sender of the account is issuing it on behalf of another account.
 * 											  This field must be omitted if the account sending the transaction is
 * 												the issuer of the NFToken.
 * 												If provided, the issuer's AccountRoot object must have the
 * 												NFTokenMinter field set to the sender of this transaction
 * 												(this transaction's Account field).
 * @param {number} transferFee (Optional) The value specifies the fee charged by the issuer for secondary sales of the NFToken,
 * 											  if such sales are allowed.
 * 												Valid values for this field are between 0 and 9999 inclusive,
 * 												 allowing transfer rates of between 0.00% and 99.99% in increments of 0.01.
 * 												If this field is provided, the transaction MUST have the
 * 												tfTransferable flag enabled.
 * @param {number} taxon  The taxon associated with the token.
 * 												The taxon is generally a value chosen by the minter of the token.
 * 												A given taxon can be used for multiple tokens.
 * 												Taxon identifiers greater than 0xFFFF'FFFF are disallowed.
 */
export const mintToken = async (secret, tokenUrl, flags, issuer, transferFee, taxon) => {
	console.log('Minting started...')
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
		...(issuer && { Issuer: issuer }),
		TransferFee: transferFee,
		NFTokenTaxon: taxon ? taxon : 0 //Required, but if you have no use for it, set to zero.
	}
	console.log({ transactionBlob })
	// Submit signed blob --------------------------------------------------------
	const tx = await client.submitAndWait(transactionBlob, { wallet })

	// const nfts = await client.request({
	// 	method: "account_nfts",
	// 	account: wallet.classicAddress
	// })
	// console.log(nfts)

	// // Check transaction results -------------------------------------------------
	console.log("Transaction result:", tx)

	console.log("Balance changes:",
		JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	client.disconnect()
	return tx.result.meta
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
		"NFTokenID": tokenId,
		"Amount": amount,
		"Flags": flags
	}

	// Submit signed blob --------------------------------------------------------
	try {

		const tx = await client.submitAndWait(transactionBlob, { wallet })//AndWait
	} catch (e) {
		console.log({ e })
	}


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
	// console.log("Transaction result:",
	// 	JSON.stringify(tx.result.meta.TransactionResult, null, 2))
	// console.log("Balance changes:",
	// 	JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
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
	console.log(wallet.classicAddress, tokenId, amount, flags, owner)

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

/**
 * Send cancel offer
 * @param {string} secret
 * @param {string} tokenOfferIndex
 * @param {string} tokenId
 * @returns {object} sellOffers:[] buyOffers:[]
 */
export const cancelOffer = async (secret, tokenOfferIndex, tokenId) => {
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
	await client.connect()
	console.log("Connected to Sandbox")

	// const tokenOfferID = tokenOfferIndex
	// Prepare a transaction blob. The tokenID argument requires an array rather than a single string.
	const tokenOffers = [tokenOfferIndex]

	const transactionBlob = {
		"TransactionType": "NFTokenCancelOffer",
		"Account": wallet.classicAddress,
		"TokenOffers": tokenOffers
	}

	// Submit the transaction and wait for the results.
	const tx = await client.submitAndWait(transactionBlob, { wallet })

	// Request lists of current Sell Offers and Buy Offers.
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
	console.log("Transaction result:",
		JSON.stringify(tx.result.meta.TransactionResult, null, 2))
	console.log("Balance changes:",
		JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

	client.disconnect()
	return {
		sellOffers: nftSellOffers,
		buyOffers: nftBuyOffers
	}
	// End of cancelOffer()
}


/**
 * Accept Buy Offer
 * Another account holder can create a buy offer for one of your NFTokens.
 * If you agree with the purchase price offered,
 * 	you can use the acceptBuyOffer() function to complete the transaction.
 * @param {string} secret
 * @param {string} tokenOfferIndex
 * @returns {Array} nfts[]
 */
export const acceptBuyOffer = async (secret, tokenOfferIndex) => {

	// Connect to the devnet server.
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
	await client.connect()
	console.log("Connected to Sandbox")

	// Prepare a transaction blob.
	const transactionBlob = {
		"TransactionType": "NFTokenAcceptOffer",
		"Account": wallet.classicAddress,
		"BuyOffer": tokenOfferIndex
	}

	// Submit the transaction and wait for the results.
	const tx = await client.submitAndWait(transactionBlob, { wallet })

	// Display the results in your console log.
	const nfts = await client.request({
		method: "account_nfts",
		account: wallet.classicAddress
	})
	console.log(JSON.stringify(nfts, null, 2))
	console.log("Transaction result:",
		JSON.stringify(tx.result.meta.TransactionResult, null, 2))
	console.log("Balance changes:",
		JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

	// Disconnect from the server.
	client.disconnect()
	// End of submitTransaction()
	return nfts
}

/**
 * Another account on your ledger can create an offer to sell a NFToken.
 * If you agree with the price, you can purchase the NFToken by accepting the sell offer.
 * The transaction completes immediately, debiting your XRP account and crediting the seller account.
 * @param {string} secret
 * @param {string} tokenOfferIndex
 * @returns
 */
export const acceptSellOffer = async (secret, tokenOfferIndex) => {

	// Connect to the devnet server.
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
	await client.connect()
	console.log("Connected to Sandbox")

	// Prepare a transaction blob.
	const transactionBlob = {
		"TransactionType": "NFTokenAcceptOffer",
		"Account": wallet.classicAddress,
		"SellOffer": tokenOfferIndex,
	}

	// Submit the transaction and wait for the results.
	const tx = await client.submitAndWait(transactionBlob, { wallet })

	// Display the results in your console log.
	const nfts = await client.request({
		method: "account_nfts",
		account: wallet.classicAddress
	})
	console.log(JSON.stringify(nfts, null, 2))
	console.log("Transaction result:",
		JSON.stringify(tx.result.meta.TransactionResult, null, 2))
	console.log("Balance changes:",
		JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

	// Disconnect from the server.
	client.disconnect()
	// End of submitTransaction()
	return nfts
}

/**
 * Get sell and buy offers for a given token
 * @param {string} tokenId
 * @returns {object} {
		sellOffers: nftSellOffers,
		buyOffers: nftBuyOffers
	}
 */
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

export const getSellOffers = async (tokenId) => {
	console.log('calling client....')
	const client = new xrpl.Client(RIPPLE_TEST_NET_URL, {
		connectionTimeout: 10000
	})
	await client.connect()
	console.log("Connected to Sandbox")
	console.log("***Sell Offers***")
	console.log('tokenID:', tokenId)
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

	client.disconnect()
	// End of createSellOffer()
	return nftSellOffers
}


export const getBuyOffers = async (tokenId) => {

	console.log("Connecting to sandbox.......")
	const client = new xrpl.Client(RIPPLE_TEST_NET_URL)
	await client.connect()
	console.log("Connected to sandbox")
	console.log('requesting buy offers...')
	console.log({ tokenId })
	let offers
	try {
		offers = await client.request({
			method: "nft_buy_offers",
			nft_id: tokenId
		})
	} catch (err) {
		console.log({ err })
	}
	console.log(JSON.stringify(offers, null, 2))

	client.disconnect()
	// End of createSellOffer()
	return offers
}

/**
 * Get Account NFTs
 * @param {string} key account address
 * @returns
 */
export async function getTokens(key) {
	// Connect to the devnet server.
	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
	await client.connect()

	console.log("Connected to Sandbox")
	const nfts = await client.request({
		method: "account_nfts",
		account: key
	})


	client.disconnect()
	return nfts
} //End of getTokens
