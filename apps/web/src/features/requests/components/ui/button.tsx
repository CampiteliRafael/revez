import type { ComponentProps } from "react";
import styles from "./button.module.css";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ComponentProps<"button"> & {
    variant?: ButtonVariant;
};

export function Button({
    className,
    variant = "primary",
    ...props
}: ButtonProps) {
    const classes = [
        styles.button,
        styles[variant],
        className,
    ].filter(Boolean).join(" ");

    return <button {...props} className={classes} />;
}