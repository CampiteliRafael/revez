import type { ComponentProps } from "react";
import styles from "./button.module.css";

type ButtonProps = ComponentProps<"button">;

export function Button({ className, ...props }: ButtonProps) {
    const classes = [styles.button, className].filter(Boolean).join(" ");

    return <button {...props} className={classes} />;
}