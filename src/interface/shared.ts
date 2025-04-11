// src/interface/shared.ts

export interface IPagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  }
  export interface IFilter {
    search?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }
  