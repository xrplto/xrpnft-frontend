import pinataSDK from '@pinata/sdk'

const pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET_KEY)

export const testPinata = async () => {
    try {
        const res = await pinata.testAuthentication()
        console.log(res)
        return res
    } catch (e) {
        console.log(e)
        return { authenticated: false }
    }
}