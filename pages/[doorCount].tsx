import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HomeContainer } from '../containers/home';

export default function HomePage() {
    const router = useRouter();
    const { doorCount } = router.query;
    const count = parseInt(Array.isArray(doorCount) ? doorCount[0] : doorCount);
    return <HomeContainer doorCount={count} />;
}

export function getServerSideProps() {
    return {
        props: {},
    };
}
