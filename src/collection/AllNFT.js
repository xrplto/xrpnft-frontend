// React
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Components
import ExploreNFT from 'src/explore';

export default function AllNFT() {
    const router = useRouter();
    const [urlParams, setUrlParams] = useState(null); // Start with null to indicate loading
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
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

        setUrlParams({
            issuer,
            taxon,
            filterAttrs: filterAttrs ? JSON.parse(filterAttrs) : null
        });
        setIsReady(true);
    }, [router.asPath]);

    // Don't render until URL params are parsed
    if (!isReady) {
        return null;
    }

    return (
        <>
            <ExploreNFT collection={null} urlParams={urlParams || {}} />
        </>
    );
}
