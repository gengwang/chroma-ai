'use client';

import React from 'react';

interface PreloaderProps {
  defaultText?: string;
  keywordChanged: boolean;
  modelChanged: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ defaultText = "Loading...", keywordChanged, modelChanged }) => {
  let text = defaultText;

  if (keywordChanged) {
    text = "Keyword changed";
  } else if (modelChanged) {
    text = "Model changed";
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
        {text}
      </div>
    </div>
  );
};

export default Preloader;
