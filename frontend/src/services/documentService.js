import api from './api';

/**
 * Get all documents for a specific application
 * @param {number} applicationId - The application ID
 * @returns {Promise} Documents data
 */
export const getDocuments = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}/documents`);
  return response.data;
};

/**
 * Upload a document for an application
 * @param {number} applicationId - The application ID
 * @param {File} file - The file to upload
 * @param {string} type - Document type (cv, cover_letter, portfolio, certificate, reference, other)
 * @returns {Promise} Upload response
 */
export const uploadDocument = async (applicationId, file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post(`/applications/${applicationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete a document
 * @param {number} documentId - The document ID
 * @returns {Promise} Delete response
 */
export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};

/**
 * Download a document
 * @param {number} documentId - The document ID
 * @param {string} filename - Original filename
 * @returns {Promise} Download response
 */
export const downloadDocument = async (documentId, filename) => {
  const response = await api.get(`/documents/${documentId}/download`, {
    responseType: 'blob',
  });
  
  // Create a download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  
  return response.data;
};

export default {
  getDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument,
};
