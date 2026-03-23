import {forwardRef, type InputHTMLAttributes, useId} from 'react';
import styles from './Toggle.module.css';
import {clsx} from 'clsx';
import type {Variant} from "../../types";

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    variant?: Variant
};

const Toggle = forwardRef<HTMLInputElement, ToggleProps>((
    {
        variant = 'primary',
        className,
        checked,
        disabled,
        id,
        style,
        ...props
    }, ref) => {
    const generatedId = useId();

    const inputId = id || generatedId;

    return (
        <label
            htmlFor={inputId}
            className={clsx(
                styles.toggleContainer,
                styles[variant],
                disabled && styles.disabled,
                className
            )}
            style={style}
        >
            <input
                type="checkbox"
                id={inputId}
                className={styles.hiddenInput}
                ref={ref}
                checked={checked}
                disabled={disabled}
                {...props}
            />
            <span className={styles.track}>
                <span className={styles.thumb}/>
            </span>
        </label>
    );
});

Toggle.displayName = 'Toggle';

export default Toggle;