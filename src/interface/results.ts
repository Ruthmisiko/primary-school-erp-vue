export interface Result {
    id: string;
    class_id: string;
    subject_id: string;
    exam_id: string;
    result_items: ResultItem[];
  }
  
  export interface ResultItem {
    id?: string; // optional for new items
    student_id: string;
    marks_obtained: number;
    grade?: string;
    remarks?: string;
  }
  