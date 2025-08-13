import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import googleDocsIcon from '../assets/images/google-docs.png';

export interface FileItem {
  name: string;
  url: string;
  label: 'BACKGROUND' | 'OVERLAY';
  color?: string;
}

const colorOptions = [
  { color: 'black', label: 'Black' },
  { color: '#EF4444', label: 'Red' },
  { color: '#10B981', label: 'Green' },
  { color: '#3B82F6', label: 'Blue' }
];

export interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileItem[];
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, files }) => {
  const [items, setItems] = useState<FileItem[]>(files);
  const navigate = useNavigate();

  const swap = () => {
    const bg = items.find(i => i.label === 'BACKGROUND');
    const ov = items.find(i => i.label === 'OVERLAY');
    if (bg && ov) {
      setItems([
        { ...ov, label: 'BACKGROUND' },
        { ...bg, label: 'OVERLAY' }
      ]);
    }
  };

  const changeColor = (index: number, color: string) => {
    const updated = [...items];
    updated[index].color = color;
    setItems(updated);
  };

  const handleCompare = () => {
    const background = items.find(f => f.label === 'BACKGROUND');
    const overlay = items.find(f => f.label === 'OVERLAY');
    if (!background || !overlay) return;

    const query = new URLSearchParams({
      filename: 'comparison-result.pdf',
      backgroundFile: background.url,
      overlayFile: overlay.url,
      backgroundColor: background.color || 'black',
      overlayColor: overlay.color || 'black'
    }).toString();

    navigate(`/compare-viewer?${query}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl px-10 py-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Compare Documents</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-8 relative">
          {items.map((file, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-4">
              <img src={googleDocsIcon} alt="Document" className="w-24 h-24 drop-shadow-lg" />
              <span className="text-xs font-bold bg-gray-100 px-4 py-1 rounded-full text-gray-700 uppercase tracking-wide">
                {file.label}
              </span>
              <span className="text-gray-800 font-medium text-base truncate max-w-[200px]">{file.name}</span>
              <div className="flex space-x-4">
                {colorOptions.map(({ color }) => (
                  <button
                    key={color}
                    onClick={() => changeColor(idx, color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      file.color === color ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={swap}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full p-3 shadow-md hover:rotate-180 transition-transform duration-300 group"
            aria-label="Swap Files"
          >
            <svg
              className="w-6 h-6 text-gray-700 group-hover:text-teal-600 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 7H4L8 3M4 7L8 11M8 17H20L16 13M20 17L16 21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCompare}
            className="px-6 py-2 text-sm rounded bg-teal-500 text-white hover:bg-teal-600 shadow-sm transition"
          >
            Compare
          </button>
          <button
            className="px-6 py-2 text-sm rounded border border-teal-500 text-teal-500 hover:bg-teal-50 transition"
          >
            Align
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
