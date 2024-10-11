import { Client } from 'xrpl';

export default async function handler(req, res) {
    const { nfTokenID } = req.query;

    const client = new Client('wss://s1.ripple.com');
    try {
        await client.connect();
        
        // Fetch NFT data using the nfTokenID
        const nftInfo = await client.request({
            command: 'nft_info',
            nft_id: nfTokenID
        });

        // Process the NFT data as needed
        const nftData = {
            NFTokenID: nftInfo.result.nft_id,
            // Add other relevant NFT data here
        };

        res.status(200).json(nftData);
    } catch (error) {
        console.error('Error fetching NFT data:', error);
        res.status(500).json({ error: 'Error fetching NFT data' });
    } finally {
        client.disconnect();
    }
}