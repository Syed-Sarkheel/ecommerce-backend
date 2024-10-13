export interface ApiResponse {
  message: string;
  data: object;
  code: string | null;
  errors: any | null;
}

export const createApiResponse = (
  message: string,
  data: object = {},
  code: string | null = null,
  errors: any | null = null,
): ApiResponse => {
  return {
    message,
    data,
    code,
    errors,
  };
};

export interface Page {
  previous: number;
  current: number;
  next: number;
  total: number;
  size: number;
  records: {
    total: number;
    onPage: number;
  };
}

export interface PaginatedApiResponse {
  message: string;
  data: object;
  code: string | null;
  errors: any | null;
  page: Page;
}

export const createPaginatedApiResponse = (
  message: string,
  data: object = {},
  page: Page,
  code: string | null = null,
  errors: any | null = null,
): PaginatedApiResponse => {
  return {
    message,
    data,
    code,
    errors,
    page,
  };
};
