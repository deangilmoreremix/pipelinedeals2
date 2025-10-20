import React, { useState, useEffect } from 'react';
import { Deal } from '../../types';
import { FileText, Upload, Download, Trash2, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { getSupabaseService } from '../../services/supabaseService';
import { logError, handleAPIError } from '../../utils/errorHandling';

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url?: string; // For downloaded files
}

interface DealDetailAttachmentsProps {
  deal: Deal;
}

export const DealDetailAttachments: React.FC<DealDetailAttachmentsProps> = ({ deal }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttachments();
  }, [deal.id]);

  const loadAttachments = async () => {
    try {
      setLoading(true);
      setError(null);
      // For now, use the attachments from the deal object
      // In a real implementation, you might fetch from a separate attachments table
      setAttachments(deal.attachments || []);
    } catch (err) {
      const appError = handleAPIError(err, 'load-attachments');
      logError(appError, 'DealDetailAttachments load');
      setError('Failed to load attachments');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Basic file validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please upload PDF, images, or documents.');
      }

      // In a real implementation, you would upload to a cloud storage service
      // For now, we'll create a local attachment object
      const attachment: Attachment = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        // url: uploadedUrl // Would be set after successful upload
      };

      // Update deal with new attachment
      const supabase = getSupabaseService();
      const currentAttachments = deal.attachments || [];
      await supabase.updateDeal(deal.id, {
        attachments: [...currentAttachments, attachment],
        updatedAt: new Date()
      });

      setAttachments(prev => [...prev, attachment]);

      // Reset file input
      event.target.value = '';

    } catch (err) {
      const appError = handleAPIError(err, 'upload-attachment');
      logError(appError, 'DealDetailAttachments upload');
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      // In a real implementation, you would fetch the file from storage
      // For now, we'll show an alert
      alert(`Downloading ${attachment.name} - This would download the actual file in a real implementation.`);
    } catch (err) {
      const appError = handleAPIError(err, 'download-attachment');
      logError(appError, 'DealDetailAttachments download');
      setError('Failed to download file');
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) {
      return;
    }

    try {
      const supabase = getSupabaseService();
      const updatedAttachments = attachments.filter(att => att.id !== attachmentId);

      await supabase.updateDeal(deal.id, {
        attachments: updatedAttachments,
        updatedAt: new Date()
      });

      setAttachments(updatedAttachments);
    } catch (err) {
      const appError = handleAPIError(err, 'delete-attachment');
      logError(appError, 'DealDetailAttachments delete');
      setError('Failed to delete attachment');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return '🖼️';
    } else if (type === 'application/pdf') {
      return '📄';
    } else if (type.includes('word') || type.includes('document')) {
      return '📝';
    } else {
      return '📎';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading attachments...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documents & Attachments</h3>
        <div>
          <label className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm font-medium cursor-pointer disabled:opacity-50">
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-1" />
                Upload File
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Uploaded Files</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">{attachments.length} files</span>
        </div>

        {attachments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by uploading a file.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600 px-2 rounded">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded mr-3">
                    <span className="text-lg">{getFileIcon(attachment.type)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{attachment.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(attachment.size)} • Uploaded {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => handleDownload(attachment)}
                    className="p-1 hover:text-gray-700 dark:hover:text-gray-300"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(attachment.id)}
                    className="p-1 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supported formats: PDF, Images (JPG, PNG, GIF), Text files, Word documents. Maximum file size: 10MB.
          </p>
        </div>
      </div>
    </div>
  );
};