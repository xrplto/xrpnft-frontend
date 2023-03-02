const Assets = () => {};

export async function getServerSideProps(ctx) {
    const params = ctx.params.nftokenid;
    const NFTokenID = params[0];
    
    return {
        redirect: {
            permanent: false,
            destination: `/nft/${NFTokenID}`
        }
    }
}

export default Assets;