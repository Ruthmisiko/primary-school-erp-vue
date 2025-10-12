export interface Payment{
    id: string;
    amount:number;
    description: string;
    payment_method: string;
    transaction_id: string;
    student_id: string;
    status: string;
}