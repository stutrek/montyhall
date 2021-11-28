import { Door } from '../../hooks/useMontyHall';
import styles from './door.module.css';

type Props = {
    isOpen: boolean;
    door: Door;
    onClick?: (door: Door) => void;
};

function getClassName(props: Props) {
    const { door } = props;
    if (props.isOpen) {
        if (door.isCorrect) {
            return styles.correct;
        } else {
            return styles.incorrect;
        }
    }
    if (door.isRemoved) {
        return styles.incorrect;
    }
    return styles.closed;
}

export function DoorDisplay(props: Props) {
    const { door } = props;
    let className = getClassName(props);

    if (door.isSelected) {
        className += ` ${styles.selected}`;
    } else if (door.isRemoved) {
        className += ` ${styles.removed}`;
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
