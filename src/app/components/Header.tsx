import { siteMetadata } from '@/app/data/siteMetadata';

const Header = () => {
    return (
        <div className="flex items-center space-x-4">
        <div className="flex-grow flex items-baseline space-x-4 text-gray-600 dark:text-gray-400">
            <h1 className="font-bold">{(siteMetadata?.title as string) || ''}</h1>
            <p className="text-sm">{(siteMetadata?.description as string) || ''}</p>
            <p className="text-sm ml-auto px-8"><a href="https://github.com/gengwang/chroma-ai" className="text-blue-500 hover:underline">Github</a></p>
        </div>
    </div>
    )
}

export default Header;