'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { FolderLock, Upload, Trash2, FileText, Search, Plus, CheckCircle2 } from 'lucide-react';
import { FileRecord } from '@/lib/db/types';
import { formatBytes, formatDate } from '@/lib/utils';
import { getAuthToken, subscribeToAuthState } from '@/lib/auth/firebase-client-auth';

export default function KnowledgeFilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/files', { headers });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch (e) {
      console.error('Error fetching files:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    const unsubscribe = subscribeToAuthState((fbUser) => {
      if (fbUser) fetchFiles();
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !content) return;
    setUploading(true);

    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/files', {
        method: 'POST',
        headers,
        body: JSON.stringify({ fileName, content }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFileName('');
        setContent('');
        fetchFiles();
      }
    } catch (e) {
      console.error('Upload failed:', e);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file from your knowledge base?')) return;
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFiles();
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">Company Knowledge Base</h1>
            <p className="text-xs text-ink-muted mt-1">
              Upload documents, competitive memos, and PDFs for your agents to index and reference.
            </p>
          </div>

          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Button>
        </div>

        {/* Files Grid */}
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="clay-surface p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-[20px] bg-cloud-blue text-primary flex items-center justify-center mb-4 shadow-clay-button-subtle">
                <FolderLock className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-ink mb-1">No Knowledge Files Uploaded</h3>
              <p className="text-xs text-ink-muted max-w-sm mb-6">
                Ground your AI coworkers with real company pitch decks, pricing sheets, and market research.
              </p>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                Upload First File
              </Button>
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="clay-surface p-5 flex items-center justify-between hover:shadow-clay-card-hover transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[12px] bg-[#E6EEF8] text-primary flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{file.fileName}</h3>
                    <div className="flex items-center gap-3 text-xs text-ink-muted mt-0.5">
                      <span>{formatBytes(file.sizeBytes)}</span>
                      <span>•</span>
                      <span>{formatDate(file.createdAt)}</span>
                      <span>•</span>
                      <Badge variant="success" className="text-[10px]">
                        Indexed & Ready
                      </Badge>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-ink-muted hover:text-danger rounded-control hover:bg-black/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Upload Modal */}
        <Dialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Knowledge Document"
          description="Paste or write document content to index into semantic chunks for your agents."
        >
          <form onSubmit={handleUpload} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Document Title</label>
              <Input
                placeholder="e.g. Q3_Competitor_Analysis.md"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 ml-1">Document Content</label>
              <Textarea
                rows={8}
                placeholder="Paste the markdown, research text, or data sheet here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={uploading}>
                Index Document
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
    </AppShell>
  );
}
