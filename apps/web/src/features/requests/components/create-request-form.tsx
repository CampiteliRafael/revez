'use client';

import type { CreateRequestInput } from "@revez/contracts";
import type { CreateRequestResponse } from "../../../api/requests";
import { useState, type SubmitEvent } from "react";
import styles from "./create-request-form.module.css";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type CreateRequestFormProps = {
    onSubmit: (input: CreateRequestInput) => Promise<CreateRequestResponse>;
    onCancel: () => void;
};

export function CreateRequestForm({ onSubmit, onCancel }: CreateRequestFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<CreateRequestInput["category"]>("IT");
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [createdRequest, setCreatedRequest] =
        useState<CreateRequestResponse | null>(null);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setCreatedRequest(null);
        setSending(true);

        try {
            const result = await onSubmit({
                title,
                description,
                category,
                priority,
                dueDate,
            });
            setCreatedRequest(result);
            setTitle("");
            setDescription("");
            setCategory("IT");
            setPriority("LOW");
            setDueDate("");
        } catch (cause: unknown) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Não foi possível criar a solicitação.",
            );
        } finally {
            setSending(false);
        }
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
            aria-describedby="create-request-form-help"
        >
            <header>
                <h2 id="create-request-heading">Nova solicitação</h2>
                <p className={styles.help} id="create-request-form-help">
                    Descreva o pedido. Todos os campos marcados com{" "}
                    <span aria-hidden="true">*</span> são obrigatórios.
                </p>
            </header>

            <div className={styles.field}>
                <label htmlFor="title">
                    Título <span aria-hidden="true">*</span>
                </label>
                <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex.: Acesso ao ambiente de homologação"
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="description">
                    Descrição <span aria-hidden="true">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Inclua contexto, resultado esperado e prazos relevantes."
                    required
                />
            </div>

            <div className={styles.fieldPair}>
                <div className={styles.field}>
                    <label htmlFor="category">
                        Categoria <span aria-hidden="true">*</span>
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value as CreateRequestInput["category"])
                        }
                        required
                    >
                        <option value="IT">Tecnologia</option>
                        <option value="INFRASTRUCTURE">Infraestrutura</option>
                        <option value="ADMINISTRATIVE">Administrativo</option>
                        <option value="PURCHASES">Compras</option>
                        <option value="HR">Recursos Humanos</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="priority">
                        Prioridade <span aria-hidden="true">*</span>
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={priority}
                        onChange={(event) =>
                            setPriority(event.target.value as CreateRequestInput["priority"])
                        }
                        required
                    >
                        <option value="LOW">Baixa</option>
                        <option value="MEDIUM">Média</option>
                        <option value="HIGH">Alta</option>
                    </select>
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="dueDate">
                    Prazo <span aria-hidden="true">*</span>
                </label>
                <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    required
                />
            </div>

            {error && <p role="alert">{error}</p>}

            {createdRequest && (
                <p role="status">
                    Solicitação criada: {createdRequest.id}
                </p>
            )}

            <div className={styles.actions}>
                <Button type="button" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={sending}>
                    {sending ? "Enviando..." : "Criar solicitação"}
                </Button>
            </div>
        </form>
    )
}