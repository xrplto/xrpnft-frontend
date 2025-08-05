// React
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Components
import ExploreNFT from './ExploreNFT';

export default function AllNFT() {
    const router = useRouter();
    const [urlParams, setUrlParams] = useState({}); // Start with empty object
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for router to be ready
        if (!router.isReady) return;
        
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search);
        const issuer = params.get('issuer');
        const taxon = params.get('taxon');
        const filterAttrs = params.get('filterAttrs');

        console.log('[AllNFT] URL Parameters:', {
            issuer,
            taxon,
            filterAttrs,
            rawFilterAttrs: filterAttrs,
            parsedFilterAttrs: filterAttrs ? JSON.parse(filterAttrs) : null,
            rawURL: window.location.search,
            decodedFilterAttrs: filterAttrs ? decodeURIComponent(filterAttrs) : null,
            timestamp: new Date().toISOString(),
            routerReady: router.isReady,
            routerAsPath: router.asPath
        });

        const newUrlParams = {};
        if (issuer) newUrlParams.issuer = issuer;
        if (taxon) newUrlParams.taxon = taxon;
        if (filterAttrs) newUrlParams.filterAttrs = JSON.parse(filterAttrs);
        
        setUrlParams(newUrlParams);
        setIsReady(true);
    }, [router.isReady, router.asPath]);

    // Always render, even without URL params
    return (
        <>
            <ExploreNFT collection={null} urlParams={urlParams} />
        </>
    );
}
