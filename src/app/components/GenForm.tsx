"use client";

import { useActionState } from "react";
import { useFormStatus, useFormState } from "react-dom";
import fetchColorThemes from "../api/get-colors3";

//TODO: Rewrite: https://nextjs.org/docs/pages/building-your-application/data-fetching/forms-and-mutations
// now we can manually go to http://localhost:3000/theme/star-trek

// TODO: Put default value: Star Trek; or disable submit until the keyword is filled

const initialState = {
    message: "",
};

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled = { pending }
			// aria-disabled={ true }
			className={`ml-4 ${pending ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
		>
			Generate color themes
		</button>
	);
}

function Loader() {
	const { pending } = useFormStatus();
	return (
		<p className={pending? "block": "hidden"}>Loading...</p>
	)
}

const GenForm = () => {
    const [state, formAction] = useActionState(fetchColorThemes, initialState);
	const { pending } = useFormStatus();

	return (
		<div>
			<form action={formAction} className="flex flex-row items-center gap-4">
				{/* keyword */}
				<div className="flex items-center">
					<label
						htmlFor="keyword"
						className="mr-3 text-gray-900 dark:text-gray-100"
					>
						Keyword
					</label>
					<input
						id="keyword"
						name="keyword"
						type="text"
						required
						className="dark:bg-gray-800 dark:text-white py-1 px-2.5 border border-gray-600 rounded mr-4"
					/>
				</div>
				{/* model */}
				{/* <div className="flex items-center">
					<label
						htmlFor="model"
						className="mr-3 text-gray-900 dark:text-gray-100"
					>
						Model
					</label>
					<select
						id="model"
						name="model"
						className="dark:bg-gray-800 dark:text-white py-1 px-2.5 border border-gray-600 rounded"
						style={{ height: "38px" }}
					>
						<option value="">
							Unspecified
						</option>
						<option value="mistralai/Mistral-7B-Instruct-v0.3">
							Mistral-7B-Instruct-v0.3
						</option>
						<option value="mistralai/Mixtral-8x7B-Instruct-v0.1">
							Mixtral-8x7B-Instruct-v0.1
						</option>
						<option value="mistralai/Mistral-Nemo-Instruct-2407">
							Mistral-Nemo-Instruct-2407
						</option>
					</select>
				</div> */}
				<SubmitButton />
				<Loader />
				{/* <p aria-live="polite" className="sr-only" role="status">
					{state?.message}
				</p> */}
			</form>
		</div>
	);
};

export default GenForm;
