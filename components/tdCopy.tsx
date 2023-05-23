import React from 'react';
import clipboardCopy from 'clipboard-copy';

interface CopyButtonProps {
  text: string;
}

const TdCopy: React.FC<CopyButtonProps> = ({ text }) => {
  const handleCopyClick = async () => {
    try {
      await clipboardCopy(text);
      console.log('Text copied to clipboard:', text);
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
    }
  };

  return (
    <td onClick={handleCopyClick} className='whitespace-nowrap cursor-default hover:bg-slate-300 px-6 py-4 font-medium'>{text}</td>
  );
};

export default TdCopy;