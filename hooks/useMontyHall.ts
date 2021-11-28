import { useCallback, useEffect, useMemo, useState } from 'react';

const random = (max: number) => Math.floor(Math.random() * max);

export type Door = {
    isSelected: boolean;
    isCorrect: boolean;
    isRemoved: boolean;
    label: string;
};
export type State = typeof states[number];
export type MontyHall = ReturnType<typeof useMontyHall>;

const states = ['selecting', 'selected', 'removed', 'complete'] as const;

const createRegularDoor: (label: string) => Door = (label: string) => ({
    isSelected: false,
    isCorrect: false,
    isRemoved: false,
    label,
});

export function useMontyHall(doorCount = 3) {
    const [currentGame, setCurrentGame] = useState(0);
    const [doors, setDoors] = useState<Door[]>([]);
    const [gameState, setGameState] = useState<State>('selecting');
    const [originalSelection, setOriginalSelection] = useState<Door>();

    useEffect(
        function createNewGame() {
            const newDoors = new Array(doorCount)
                .fill(undefined)
                .map((_, i) => createRegularDoor((i + 1).toString()));

            const correctDoor = newDoors[random(doorCount)];
            correctDoor.isCorrect = true;

            setDoors(newDoors);
            setGameState('selecting');
            setOriginalSelection(undefined);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentGame]
    );

    const selectDoor = useCallback(
        (selection: Door) => {
            if (gameState === 'selecting') {
                setOriginalSelection(selection);
            }
            setDoors((doors) => {
                const updated = doors.map((door) => {
                    if (door === selection) {
                        return { ...door, isSelected: true };
                    } else if (door.isSelected) {
                        return { ...door, isSelected: false };
                    }
                    return door;
                });
                return updated;
            });
        },
        [gameState]
    );

    const nextGame = useCallback(() => setCurrentGame((game) => game + 1), []);
    const advance = useCallback(() => {
        setGameState((state) => {
            if (state === 'selecting' && originalSelection === undefined) {
                throw new Error('Tried to advance before making a selection.');
            }
            // it has to pick which doors to remove.
            if (state === 'selected') {
                setDoors((doors) => {
                    const correctIsSelected = doors.find(
                        (door) => door.isCorrect && door.isSelected
                    );
                    if (correctIsSelected) {
                        const correctIndex = doors.findIndex(
                            (door) => door.isCorrect
                        );
                        let doorToKeep = random(doorCount - 2);
                        if (doorToKeep >= correctIndex) {
                            doorToKeep++;
                        }
                        return doors.map((door, index) => {
                            if (door.isSelected || index === doorToKeep) {
                                return door;
                            }
                            return {
                                ...door,
                                isRemoved: true,
                            };
                        });
                    } else {
                        return doors.map((door) => {
                            if (door.isSelected || door.isCorrect) {
                                return door;
                            }
                            return {
                                ...door,
                                isRemoved: true,
                            };
                        });
                    }
                });
            }
            const stateIndex = states.indexOf(state);
            if (states[stateIndex + 1]) {
                return states[stateIndex + 1];
            }
            return state;
        });
    }, [doorCount, originalSelection]);

    return {
        doors,
        originalSelection,
        selectDoor,
        advance,
        gameState,
        nextGame,
    } as const;
}
