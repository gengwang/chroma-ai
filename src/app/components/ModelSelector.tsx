"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ModelOption {
	value: string;
	label: string;
}

const models: ModelOption[] = [
	{ value: "mistralai/Mistral-7B-Instruct-v0.3", label: "Mistral-7B-Instruct-v0.3" },
    { value: "mistralai/Mixtral-8x7B-Instruct-v0.1", label: "Mixtral-8x7B-Instruct-v0.1" },
    { value: "mistralai/Mistral-Nemo-Instruct-2407", label: "Mistral-Nemo-Instruct-2407" },
];

interface ModelSelectorProps {
	model: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ model }) => {
	const router = useRouter();

	const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newModel = e.target.value;
		const url = new URL(window.location.href);
		url.searchParams.set("model", newModel);
		router.push(url.toString());
	};

	return (
		<div>
			<label htmlFor="modelSelect" className="mr-3 text-gray-900 dark:text-gray-100">Model</label>
			<select
				id="modelSelect"
				className="mb-5 dark:bg-gray-800 dark:text-white py-1 px-2.5 border border-gray-600 rounded"
				value={model}
				onChange={handleModelChange}
			>
				{models.map((modelOption) => (
					<option key={modelOption.value} value={modelOption.value}>
						{modelOption.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default ModelSelector;
