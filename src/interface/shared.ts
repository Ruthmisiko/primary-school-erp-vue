// src/interface/shared.ts

export interface IPagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
  }
  