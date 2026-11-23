"use client";

import type { CreateRequestInput } from "@revez/contracts";
import {
  CreateRequestError,
  type CreateRequestResponse,
} from "../../../api/requests";
import { useState, useEffect, type SubmitEvent } from "react";
import styles from "./create-request-form.module.css";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type CreateRequestFormProps = {
  onSubmit: (input: CreateRequestInput) => Promise<CreateRequestResponse>;
  onCancel: () => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
};

export function CreateRequestForm({
  onSubmit,
  onCancel,
  onSubmittingChange,
}: CreateRequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<CreateRequestInput["category"]>("IT");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [createdRequest, setCreatedRequest] =
    useState<CreateRequestResponse | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRevision, setFeedbackRevision] = useState(0);

  useEffect(() => {
    if (!showFeedback) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setShowFeedback(false),
      error ? 8000 : 5000,
    );

    return () => window.clearTimeout(timeoutId);
  }, [showFeedback, error, feedbackRevision]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setShowFeedback(false);
    setCreatedRequest(null);
    setSending(true);
    onSubmittingChange(true);

    try {
      const result = await onSubmit({
        title,
        description,
        category,
        priority,
        dueDate,
      });
      setCreatedRequest(result);
      setShowFeedback(true);
      setFeedbackRevision((revision) => revision + 1);
      setTitle("");
      setDescription("");
      setCategory("IT");
      setPriority("LOW");
      setDueDate("");
    } catch (cause: unknown) {
      if (cause instanceof CreateRequestError) {
        const messages = {
          NETWORK:
            "Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.",
          UNAUTHORIZED:
            "Sua sessão expirou ou você não tem permissão. Entre novamente e tente de novo.",
          VALIDATION:
            "Alguns dados não foram aceitos. Revise os campos e tente novamente.",
          SERVER:
            "O serviço está temporariamente indisponível. Tente novamente em instantes.",
          UNEXPECTED: "Não foi possível criar a solicitação. Tente novamente.",
        } satisfies Record<CreateRequestError["code"], string>;

        setError(messages[cause.code]);
      } else if (cause instanceof TypeError) {
        setError(
          "Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.",
        );
      } else {
        setError("Não foi possível criar a solicitação. Tente novamente.");
      }
      setShowFeedback(true);
      setFeedbackRevision((revision) => revision + 1);
    } finally {
      setSending(false);
      onSubmittingChange(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-describedby="create-request-form-help"
    >
      <header className={styles.formHeader}>
        <h2 className={styles.title} id="create-request-heading">
          Nova solicitação
        </h2>
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
          className={`${styles.control} ${styles.textarea}`}
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
            className={styles.control}
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
            className={styles.control}
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

      {showFeedback && error && (
        <p
          className={`${styles.feedback} ${styles.feedbackError}`}
          role="alert"
        >
          {error}
        </p>
      )}

      {showFeedback && createdRequest && (
        <p
          className={`${styles.feedback} ${styles.feedbackSuccess}`}
          role="status"
        >
          Solicitação criada com sucesso
        </p>
      )}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={sending}
        >
          {createdRequest ? "Fechar" : "Cancelar"}
        </Button>

        <Button type="submit" variant="primary" disabled={sending}>
          {sending ? "Enviando..." : "Criar solicitação"}
        </Button>
      </div>
    </form>
  );
}
