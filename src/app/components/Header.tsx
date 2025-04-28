'use client';
	
import { useEffect, useState } from 'react';
import { siteMetadata } from '@/app/data/siteMetadata';
import { useRouter } from 'next/navigation'; // Use next/navigation for navigation
import { RiAddLine, RiBookOpenLine, RiMoonLine, RiSunLine } from 'react-icons/ri'; // Import icons for theme toggle

const Header = () => {
    const router = useRouter(); // Initialize router for navigation
    const [isDarkTheme, setIsDarkTheme] = useState(false); // State to track theme

    // Effect to apply the theme based on the user's preference or system preference
    useEffect(() => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            setIsDarkTheme(currentTheme === 'dark');
            document.documentElement.classList.toggle('dark', currentTheme === 'dark');
        } else {
            // Check for system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkTheme(prefersDark);
            document.documentElement.classList.toggle('dark', prefersDark);
        }

        // Listen for changes in the system's color scheme
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? 'dark' : 'light';
            setIsDarkTheme(newTheme === 'dark');
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            localStorage.setItem('theme', newTheme); // Save the user's preference
        };

        mediaQuery.addEventListener('change', handleChange);

        // Cleanup listener on component unmount
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Function to toggle the theme
    const toggleTheme = () => {
        const newTheme = isDarkTheme ? 'light' : 'dark';
        setIsDarkTheme(!isDarkTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme); // Save the user's preference
    };

    return (
			<div className="flex items-center p-4 space-x-4 min-h-[64px]">
				<div className="flex-grow flex items-baseline space-x-4">
					<h1 className="font-bold">{(siteMetadata?.title as string) || ""}</h1>
					<p className="text-sm">
						{(siteMetadata?.description as string) || ""}
					</p>
				</div>
                {/* TMP. hide for now. */}
                {false && 
				<div className="flex space-x-4"> {/* Container for buttons */}
					<button 
						onClick={() => router.push('/')} 
						className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
					>
						<RiAddLine className="h-5 w-5" aria-hidden="true" /> {/* Changed icon to RiAddLine */}
						<span>Create</span> {/* Changed text to "Create" */}
					</button>
					<button 
						onClick={() => router.push('/learn')} 
						className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
					>
						<RiBookOpenLine className="h-5 w-5" aria-hidden="true" />
						<span>Learn</span>
					</button>
					{false && <button 
						onClick={toggleTheme} 
						className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
					>
						{isDarkTheme ? (
							<RiSunLine className="h-5 w-5" aria-hidden="true" /> // Sun icon for light theme
						) : (
							<RiMoonLine className="h-5 w-5" aria-hidden="true" /> // Moon icon for dark theme
						)}
						<span>Theme</span> {/* Button text */}
					</button>}
				</div>}
			</div>
		);
}

export default Header;