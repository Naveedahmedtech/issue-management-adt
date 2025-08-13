import React, { useState } from 'react';
import CompareModal, { FileItem } from './CompareModal';

// Real PDF files
const files: FileItem[] = [
  { name: 'Framework.pdf', url: 'https://backend.viewsoft.com/uploads/projects/Framework.pdf', label: 'BACKGROUND', color: 'black' },
  { name: 'Annotated.pdf', url: 'https://backend.viewsoft.com/uploads/projects/annotated.pdf', label: 'OVERLAY', color: 'black' },
];

const FileListViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Files</h2>
      <ul className="mb-6 space-y-2">
        {files.map((file, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span>{file.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => setSelectedFile(file)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View
              </button>
              <button
                onClick={openModal}
                className="px-3 py-1 bg-teal-400 text-white rounded hover:bg-teal-500 transition"
              >
                Compare
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedFile && (
        <div className="border p-2 mb-6">
          <h3 className="font-semibold mb-2">Viewing: {selectedFile.name}</h3>
          <iframe
            src={selectedFile.url}
            title={selectedFile.name}
            className="w-full h-[400px]"
          />
        </div>
      )}

      <CompareModal isOpen={showModal} onClose={closeModal} files={files} />
    </div>
  );
};

export default FileListViewer;
