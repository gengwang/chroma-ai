import { siteMetadata } from '@/app/data/siteMetadata';

const Header = () => {
    return (
        <div className="flex items-center space-x-4">
        <div className="flex-grow flex items-baseline space-x-4 text-gray-600 dark:text-gray-400">
            <h1 className="text-3xl font-bold">{(siteMetadata?.title as string) || ''}</h1>
            <p className="text-lg">{(siteMetadata?.description as string) || ''}</p>
            <p className="ml-auto"><a href="https://github.com/gengwang/chroma-ai" className="text-blue-500 hover:underline">Source code</a></p>
        </div>
    </div>
    )
}

export default Header;