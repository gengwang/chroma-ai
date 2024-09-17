import React from 'react';
import Link from 'next/link';
import { RiLinkedinLine, RiTwitterLine, RiGithubLine } from 'react-icons/ri';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-6 bg-white dark:bg-black">
      <div className="mx-10 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="https://www.linkedin.com/in/wanggeng" target="_linkedin" rel="noopener noreferrer">
            <RiLinkedinLine className="text-gray-400 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 text-2xl transition-colors" />
          </Link>
          <Link href="https://twitter.com/emotioner" target="_twitter" rel="noopener noreferrer">
            <RiTwitterLine className="text-gray-400 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 text-2xl transition-colors" />
          </Link>
          <Link href="https://github.com/gengwang" target="_github" rel="noopener noreferrer">
            <RiGithubLine className="text-gray-400 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 text-2xl transition-colors" />
          </Link>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <Link href="https://work.maohao.com" target="_portfolio" rel="noopener noreferrer">
            Geng Wang @ 2024
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
