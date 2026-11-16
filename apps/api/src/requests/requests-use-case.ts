import type { CreateRequestInput } from "@revez/contracts";

export type CreateRequestCommand = {
    input: CreateRequestInput;
    creatorId: string;
};

export type CreateRequestResult = {
    id: string;
    status: "NEW";
};

export type CreateRequestUseCase = (
    command: CreateRequestCommand,
) => Promise<CreateRequestResult>;

export interface RequestsRepository {
    createRequest(command: CreateRequestCommand): Promise<CreateRequestResult>;
}

export function makeCreateRequestUseCase(
  repository: RequestsRepository,
): CreateRequestUseCase {
  return (command) => repository.createRequest(command);
}