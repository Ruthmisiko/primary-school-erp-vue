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
}

export interface Result{
    class_id: string;
    student_id: string;
    english: number;
    kiswahili: number;
    mathematics: number;
    cre: number;
    science: number;

}

export interface Sclass{
    name: string;
}