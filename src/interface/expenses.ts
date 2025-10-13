export interface Expense {
    id: string;
    school_id?: string;
    category: string;
    description: string;
    amount: number;
    currency: string;
    payment_method: string;
    expense_date: string;
    receipt_number: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}
