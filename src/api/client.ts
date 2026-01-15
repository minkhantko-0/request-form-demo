const API_BASE_URL = 'https://41l5r34h-3001.asse.devtunnels.ms/api'
const WORKFLOW_API_BASE_URL = 'https://41l5r34h-3002.asse.devtunnels.ms/api/v1'

export const api = {
  async getWorkflowInstances(createdBy?: string) {
    const url = createdBy 
      ? `${WORKFLOW_API_BASE_URL}/workflows/instances?createdBy=${encodeURIComponent(createdBy)}`
      : `${WORKFLOW_API_BASE_URL}/workflows/instances`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch workflow instances')
    return res.json()
  },

  async startWorkflow(workflowId: string, refId: string, context: any, createdBy: string) {
    const res = await fetch(`${WORKFLOW_API_BASE_URL}/workflows/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId, refId, context, createdBy }),
    })
    if (!res.ok) throw new Error('Failed to start workflow')
    return res.json()
  },
  async getSubmissions() {
    const res = await fetch(`${API_BASE_URL}/submissions`)
    if (!res.ok) throw new Error('Failed to fetch submissions')
    return res.json()
  },

  async submitForm(data: any, schema: any) {
    console.log(data)
    const hasFiles = Object.values(data).some(v => v instanceof File);
    console.log('Has files:', hasFiles);
    if(hasFiles){
      const formData = new FormData();
        const cleanData: any = {};

        for (const [key, value] of Object.entries(data)) {
          console.log('key:', key, 'value:', value);
          if (value instanceof File) {
            console.log('val is file:', value);
            formData.append(key, value);
          } else {
            cleanData[key] = value;
          }
        }

        formData.append('data', JSON.stringify(cleanData));
        formData.append('schema', JSON.stringify(schema));
        console.log(formData)
        const res = await fetch(`${API_BASE_URL}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        })
        if (!res.ok) throw new Error('Failed to submit form')
        return res.json()
    }
    const res = await fetch(`${API_BASE_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, schema }),
    })
    if (!res.ok) throw new Error('Failed to submit form')
    return res.json()
  },

  async getFormMappings() {
    const res = await fetch(`${API_BASE_URL}/form-mappings`)
    if (!res.ok) throw new Error('Failed to fetch form mappings')
    return res.json()
  },

  async getFormMappingById(id: number) {
    const res = await fetch(`${API_BASE_URL}/form-mappings/${id}`)
    if (!res.ok) throw new Error('Failed to fetch form mapping')
    return res.json()
  },

  async createFormMapping(data: any) {
    const res = await fetch(`${API_BASE_URL}/form-mappings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create form mapping')
    return res.json()
  },

  async updateFormMapping(id: number, data: any) {
    const res = await fetch(`${API_BASE_URL}/form-mappings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update form mapping')
    return res.json()
  },

  async deleteFormMapping(id: number) {
    const res = await fetch(`${API_BASE_URL}/form-mappings/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete form mapping')
    return res.json()
  },
}
