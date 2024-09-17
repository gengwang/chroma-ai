'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface KeywordInputProps {
    initialKeyword: string;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ initialKeyword }) => {
    const [keyword, setKeyword] = useState(initialKeyword);
    const router = useRouter();

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('keyword', keyword);
        router.push(url.toString());
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <label htmlFor="keywordInput" className="mr-3 text-gray-900 dark:text-gray-100">Theme</label>
            <input
                id="keywordInput"
                type="text"
                value={keyword}
                onChange={handleKeywordChange}
                placeholder={`Enter keyword, e.g. 'Star Trek'`}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                    }
                }}
                className="mr-2.5 dark:bg-gray-800 dark:text-white py-1 px-2.5 border border-gray-600 rounded w-60"
            />
            {/* <button type="submit">Generate Palette</button> */}
        </form>
    );
};

export default KeywordInput;
