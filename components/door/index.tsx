import { Door } from '../../containers/home/useMontyHall';
import styles from './door.module.css';

type Props = {
    isOpen: boolean;
    door: Door;
    onClick?: (door: Door) => void;
};

function getClassName(props: Props) {
    const { door } = props;
    switch (true) {
        case props.isOpen:
            if (door.isCorrect) {
                return styles.correct;
            } else {
                return styles.incorrect;
            }
        case door.isRemoved:
            return styles.removed;
    }
    return styles.closed;
}

export function DoorDisplay(props: Props) {
    const { door } = props;
    let className = getClassName(props);

    if (door.isSelected) {
        className += ` ${styles.selected}`;
    }

    if (props.onClick) {
        className += ` ${styles.clickable}`;
    }

    return (
        <div
            className={className}
            onClick={props.onClick ? () => props.onClick(door) : undefined}
        >
            <div className={styles.label}>{door.label}</div>
        </div>
    );
}
