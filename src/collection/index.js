import React from 'react';
import { useState } from 'react';

// Components
import SpinNFT from './SpinNFT';
import ViewNFT from './ViewNFT';

export default function Collection({data}) {
    const [view, setView] = useState(data?.collection?.type);
    
    return (
        <>
            {view === 'spinner' ? (
                <SpinNFT
                    collection={data.collection}
                    nfts={data.spins}
                    setView={setView}
                />
            ):(
                <ViewNFT
                    collection={data.collection}
                />
            )}
        </>
    );
}
