"use client";

import styles from "./dialog.module.css";

import { useEffect, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  preventClose: boolean;
};

export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
  preventClose,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      className={styles.dialog}
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(event) => {
        if (preventClose) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </dialog>
  );
}
