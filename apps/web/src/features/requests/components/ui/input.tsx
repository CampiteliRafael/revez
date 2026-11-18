import type { ComponentProps } from "react";
import styles from "./input.module.css";

type InputProps = ComponentProps<"input">;

export function Input({ className, ...props }: InputProps) {
    const classes = [styles.input, className].filter(Boolean).join(" ");

    return <input {...props} className={classes} />;
}