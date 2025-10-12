export interface Student{
    id: string;
    name: string;
    class_id: string;
    parent: string;
    age: number;
    fee_balance: number;
    paid_fee: number;
    sclass: Result[];
    results: Sclass[];
    phone_number: string;
    address: string;
}

export interface Result{
    class_id: string;
    student_id: string;
    subject_id: string;
    exam_id: string;
    marks_obtained: number;
    grade: string;
    remarks: string;

}

export interface Sclass{
    name: string;
}