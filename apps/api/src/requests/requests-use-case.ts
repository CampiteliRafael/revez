import type { CreateRequestInput, ListRequestsQuery } from "@revez/contracts";

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

export type ListRequestsCommand = {
  query: ListRequestsQuery;
  isOperator: boolean;
  requesterId: string;
};

export type ListRequestsResult = {
  items: {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
      id: string;
      displayName: string | null;
    };
    assignee: {
      id: string;
      displayName: string | null;
    } | null;
  }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export interface RequestsListingRepository {
  listRequests(params: {
    page: number;
    pageSize: number;
    createdById?: string;
  }): Promise<ListRequestsResult>;
}

export type ListRequestsUseCase = (
  command: ListRequestsCommand,
) => Promise<ListRequestsResult>;

export function makeListRequestsUseCase(
  repository: RequestsListingRepository,
): ListRequestsUseCase {
  return ({ query, isOperator, requesterId }) => {
    return repository.listRequests({
      ...query,
      ...(isOperator ? {} : { createdById: requesterId }),
    });
  };
}
