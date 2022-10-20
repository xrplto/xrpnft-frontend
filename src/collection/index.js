import React from 'react';
import { useState } from 'react';

// Components
import SpinNFT from './SpinNFT';
import ViewNFT from './ViewNFT';

export default function Collection({data}) {
    const [view, setView] = useState(data?.collection?.type);
    
    return (
        <>
            {view === 'random' ? (
                <SpinNFT
                    collection={data.collection}
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
