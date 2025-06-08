import { api ,generateUrl } from "@/api"

export const addStudent = async (postBody: any) => {
    return await api
        .post('students', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchStudents = async (filter: any) => {
    const url = generateUrl('students', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateStudent = async (id: string, postBody: any) => {
    return await api
        .patch(`students/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getStudent = async (id: string) => {
    return await api
        .get(`students/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeStudent = async (id: string) => {
    return await api
        .delete(`students/${id}`)
        .then(response => response)
        .catch(e => e.response)
}


export const importStudents = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    return await api
      .post('import-students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response)
      .catch(e => e.response);
  };
  
  export const downloadStudentTemplate = () => {
    return api
      .get('download-students-template', {
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'student_upload_template.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((e) => {
        console.error('Error downloading template:', e);
      });
  };

  export const printResult = async (studentId: string) => {
    return await api
      .get(`students/${studentId}/print-result`, {
        responseType: 'blob', // Important: ensures we get a file (e.g., PDF)
      })
      .then(response => response)
      .catch(e => e.response);
  };
  
  export const exportStudents = async () => {
    return await api
        .get('students/report/pdf', { responseType: 'blob' })
        .then(response => response)
        .catch(e => e.response)
}