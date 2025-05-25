import { api ,generateUrl } from "@/api"

export const addResult = async (postBody: any) => {
    return await api
        .post('results', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchResults = async (filter: any) => {
    const url = generateUrl('results', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateResult = async (id: string, postBody: any) => {
    return await api
        .patch(`results/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getResult = async (id: string) => {
    return await api
        .get(`results/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeResult = async (id: string) => {
    return await api
        .delete(`results/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const importResults = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    return await api
      .post('import-results', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response)
      .catch(e => e.response);
  };
  
  export const downloadResultTemplate = () => {
    return api
      .get('download-results-template', {
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'results_upload_template.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((e) => {
        console.error('Error downloading template:', e);
      });
  };
 