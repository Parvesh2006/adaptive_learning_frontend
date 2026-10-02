import { useState, useEffect, useCallback } from 'react';
import type { KnowledgeDocument } from '@/types';
import { getDocuments, getDocument, uploadDocument, deleteDocument, searchKnowledge } from '@/services/api/knowledgeApi';

export function useKnowledge() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    const data = await getDocuments();
    setDocuments(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const upload = useCallback(
    async (file: { name: string; size: number; type: string }) => {
      setUploading(true);
      setUploadProgress(0);

      const stages = [
        { progress: 15, label: 'Uploading' },
        { progress: 35, label: 'Extracting' },
        { progress: 55, label: 'Understanding' },
        { progress: 80, label: 'Indexing' },
        { progress: 100, label: 'Ready' },
      ];

      for (const stage of stages) {
        setUploadStage(stage.label);
        setUploadProgress(stage.progress);
        await new Promise((r) => setTimeout(r, 600));
      }

      await uploadDocument(file);
      await loadDocuments();
      setUploading(false);
      setUploadProgress(0);
      setUploadStage('');
    },
    [loadDocuments]
  );

  const remove = useCallback(async (id: string) => {
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const getDoc = useCallback(async (id: string) => {
    return await getDocument(id);
  }, []);

  const search = useCallback(async (query: string) => {
    return await searchKnowledge(query);
  }, []);

  return {
    documents,
    loading,
    uploading,
    uploadProgress,
    uploadStage,
    upload,
    remove,
    getDoc,
    search,
    reload: loadDocuments,
  };
}
