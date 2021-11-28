import next from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import { DoorDisplay } from '../../components/door';
import styles from './Home.module.css';
import { MontyHall, useMontyHall } from './useMontyHall';

function NextButtons({ montyHall }: { montyHall: MontyHall }) {
    const { doors, originalSelection, advance, gameState, nextGame } =
        montyHall;
    const selectedDoor = doors.find((door) => door.isSelected);

    useEffect(() => {
        if (gameState === 'selected') {
            setTimeout(() => {
                advance();
            }, 1500);
        }
    }, [gameState, advance]);

    if (gameState === 'selecting') {
        if (selectedDoor) {
            return (
                <div>
                    <button onClick={advance}>Confirm Selection</button>
                </div>
            );
        }
        return <div>Select a door</div>;
    }

    if (gameState === 'selected') {
        return (
            <div>
                Your selection is set. Monty Hall is choosing a door to
                remove...
            </div>
        );
    }

    if (gameState === 'removed') {
        const otherDoor = doors.find(
            (door) =>
                door.label !== originalSelection.label &&
                door.isRemoved === false
        );
        return (
            <div>
                Would you like to keep door {originalSelection.label} or switch
                to door {otherDoor.label}?
                <br />
                <button onClick={advance}>Confirm selection</button>
            </div>
        );
    }

    if (gameState === 'complete') {
        if (selectedDoor.isCorrect) {
            return (
                <div>
                    YOU WON!
                    <br />
                    <button onClick={nextGame}>New Game</button>
                </div>
            );
        }
        return (
            <div>
                You lost.
                <br />
                <button onClick={nextGame}>New Game</button>
            </div>
        );
    }
}

export function HomeContainer() {
    const montyHall = useMontyHall(3);
    const { doors, selectDoor, gameState } = montyHall;
    return (
        <div className={styles.container}>
            <Head>
                <title>Monty Hall</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Monty Hall</h1>
                <div>
                    {doors.map((door) => {
                        const isClickable =
                            gameState === 'selecting' ||
                            (gameState === 'removed' &&
                                door.isRemoved === false);
                        return (
                            <DoorDisplay
                                key={door.label}
                                isOpen={gameState === 'complete'}
                                door={door}
                                onClick={
                                    isClickable
                                        ? (door) => selectDoor(door)
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>
                <div className={styles.nextButtons}>
                    <NextButtons montyHall={montyHall} />
                </div>
            </main>
        </div>
    );
}
