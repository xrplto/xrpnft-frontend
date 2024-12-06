const COINBASE_APP_ID = 'cee25f15-2e2f-4243-b640-87749410be9b';

export const generateCoinbaseUrl = ({
    address,
    presetCryptoAmount,
    redirectUrl
}) => {
    // Base URL for Coinbase onramp
    const baseUrl = 'https://pay.coinbase.com/landing';

    // Create destination wallet object
    const destinationWallets = [{
        address,
        blockchains: ["ripple"]
    }];

    // Build query parameters
    const params = new URLSearchParams({
        appId: COINBASE_APP_ID,
        destinationWallets: JSON.stringify(destinationWallets),
        handlingRequestedUrls: 'true',
        presetCryptoAmount: presetCryptoAmount || '',
        redirectUrl: redirectUrl || window.location.href
    });

    return `${baseUrl}?${params.toString()}`;
}; 