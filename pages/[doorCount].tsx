import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HomeContainer } from '../containers/home';

export default function HomePage() {
    const router = useRouter();
    console.log(router);
    const { doorCount } = router.query;
    console.log(doorCount);
    const count =
        parseInt(Array.isArray(doorCount) ? doorCount[0] : doorCount) || 3;
    return <HomeContainer doorCount={count} />;
}
