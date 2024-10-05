import { siteMetadata } from '@/app/data/siteMetadata';

const Header = () => {
    return (
        <div className="flex items-center space-x-4">
        <div className="flex-grow flex items-baseline space-x-4 text-gray-500 dark:text-gray-500">
            <h1 className="font-bold">{(siteMetadata?.title as string) || ''}</h1>
            <p className="text-sm">{(siteMetadata?.description as string) || ''}</p>
        </div>
    </div>
    )
}

export default Header;