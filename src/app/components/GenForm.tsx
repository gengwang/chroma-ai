"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import fetchColorThemes, { getMockColorThemes, redirectToTheme } from "../api/get-colors3";
import { Theme } from "../api/types";

// Initial state for the form
const initialState = {
    message: "",
};

const GenForm = () => {
    const [keyword, setKeyword] = useState(""); // State for the keyword input
    const [stateMesssage, setStateMessage] = useState(initialState); // State for the form message
    const { pending } = useFormStatus(); // Get the form status

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        // Create FormData object and append keyword
        const formData = new FormData();
        formData.append("keyword", keyword); // Append the keyword to the FormData

        // Call the fetchColorThemes function with the FormData object
        try {
            const mockTheme = await redirectToTheme(formData); // Pass the FormData object
            // const response = await fetchColorThemes(formData); // Pass the FormData object
            // setState({ message: response.message }); // Update state with the response message
            setStateMessage({ message: "Generating..." }); // Update state with the response message
            // console.log("mockTheme", mockTheme);
        } catch (error) {
            console.error("Error fetching color themes:", error);
            setStateMessage({ message: "Failed to generate color themes." });
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit} // Use handleSubmit for form submission
                className="flex flex-row items-center justify-center min-h-60 gap-4"
            >
                {/* Keyword input */}
                <div className="flex items-center">
                    <label
                        htmlFor="keyword"
                        className="mr-3 text-gray-900 dark:text-gray-100"
                    >
                        Enter your theme idea:
                    </label>
                    <input
                        id="keyword"
                        name="keyword"
                        type="text"
                        value={keyword} // Controlled input
                        onChange={(e) => setKeyword(e.target.value)} // Update state on change
                        autoFocus
                        placeholder="e.g., Sunset Vibes"
                        required
                        className="bg-white text-black dark:bg-gray-800 dark:text-white py-1 px-2.5 border border-gray-600 rounded mr-4 w-96"
                    />
                </div>
                <SubmitButton pending={pending} /> {/* Pass pending state to SubmitButton */}
            </form>
            {/* Display message if needed */}
            {stateMesssage.message && <p>{stateMesssage.message}</p>}
        </>
    );
};

// SubmitButton component
function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className={`ml-4 min-w-[200px] ${
                pending
                    ? "bg-gray-300 dark:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
        >
            {pending ? "Generating..." : "Generate color themes"}
        </button>
    );
}

export default GenForm;
