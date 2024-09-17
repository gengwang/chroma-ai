'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { HfInference } from '@huggingface/inference';
import { z } from "zod";
import { insertColorTheme } from './mongodb-data';

// Helper functions
function sanitizeResponse(response: string) {
    return response
        .replace(/```json\s*|\s*```/g, '')
        .replace(/\n/g, '')
        .replace(/^json\s*/, '')
        .replace(/^json(?=\{|\[)/, '')
        .trim();
}

// Main logic and exported functions
const huggingFaceAccessToken = process.env.HUGGING_FACE_ACCESS_TOKEN;

if (!huggingFaceAccessToken) {
    console.error('Hugging Face access token not found in .env file');
}

// console.log('hugging face:::', huggingFaceAccessToken);

const hf = new HfInference(huggingFaceAccessToken);

// Used to separate the JSON array from the rest of the response. 
// Setting the correct delimiter is an art that entails experimentation, and is important for the JSON parsing.
const delimiter = "####END####\n";


async function chatCompletion(message: string, model?: string) {
	try {
		const response = await hf.textGeneration({
			model: model,
			// Available models:
			// - 'google/gemma-2-2b-it' //default?
			// - 'mistralai/Mistral-7B-Instruct-v0.3'
			// - 'mistralai/Mixtral-8x7B-Instruct-v0.1'
			// - 'mistralai/Mistral-Nemo-Instruct-2407'
			// model: 'mistralai/Mamba-Codestral-7B-v0.1',
			// model: 'meta-llama/Meta-Llama-3-8B', // To large for local dev
			//model: 'mattshumer/Reflection-Llama-3.1-70B', // Requires Pro subscription
			inputs: message,
			system:
				"Generate responses related to color palettes and themes. The user input message will be delimited by " +
				delimiter +
				" characters.",
			assistant:
				"You are a helpful AI assistant specializing in art, design and color theory. Do not include any explanation in the response, just the output.",
			parameters: {
				max_new_tokens: 100, // original template 50
				temperature: 0.8, // original template 0.7
				top_k: 100, // original template 50
				top_p: 0.95, // original template 0.95
			},
		});

		// Extract the JSON content from the generated_text
		const jsonStart =
			response.generated_text.indexOf(delimiter) + delimiter.length;
		const jsonEnd = response.generated_text.length;

		if (jsonStart === -1) {
			throw new Error("No valid JSON content found in the response");
		}

		const jsonContent = response.generated_text.slice(jsonStart, jsonEnd);

		// Sanitize the extracted JSON content
		let sanitizedText = sanitizeResponse(jsonContent);

		console.log('Debug - Sanitized text:', sanitizedText);

		// Attempt to parse the JSON
		try {
			const parsedContent = JSON.parse(sanitizedText);
			// const contentInfo = getContentType(parsedContent);
			// console.log(`Debug - Content Info:\nType: ${contentInfo.type}\nDetails: ${contentInfo.details}`);

			return parsedContent;
		} catch (parseError) {
			console.error("Error parsing JSON:", parseError);
			// const contentInfo = getContentType(sanitizedText);
			// console.log(`Debug - Content Info (failed to parse as JSON):\nType: ${contentInfo.type}\nDetails: ${contentInfo.details}`);
			throw new Error("Failed to parse JSON response");
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error message:", error.message);
		} else {
			console.error("An unknown error occurred:", error);
		}
	}
}

async function genColorTheme(keyword:string = "Star Trek", model?:string) {
	const startTime = Date.now();
    console.log(`getColorPalettes called with model: ${model}, keyword: ${keyword}`);
    let themeNamesPrompt;

	try {
        themeNamesPrompt = `Create a list of 5 different theme names based on ${keyword}. Make sure the output is a valid JSON array of strings, where each theme object is in the following format: { "theme": "Theme Name"}, and the array is in the following format: [{ "theme": "Theme Name"}, { "theme": "Theme Name"}]. Make sure the JSON array is wrapped in square brackets. Do not include anything else in the response, just the output.` + delimiter;

        const userInput2 = "Create a themed color palette named {theme from userInput1} consisting 6 colors, with each color represented in a hex color.  Make sure the output is a valid JSON object in the following format: { \"theme\": \"Theme Name\", \"colors\": [\"#RRGGBB\", \"#RRGGBB\", \"#RRGGBB\", \"#RRGGBB\", \"#RRGGBB\", \"#RRGGBB\"] }. Do not include anything else in the response, just the output." + delimiter;

        // Get color palette names
        const themeNamesResponse = await chatCompletion(themeNamesPrompt, model);

        // console.log('Debug - themeNamesResponse:', themeNamesResponse);
        
        // No need to sanitize here as it's already done in chatCompletion
        let parsedThemeNames = themeNamesResponse;

        // Ensure parsedThemeNames is an array
        if (!Array.isArray(parsedThemeNames)) {
            throw new Error('Parsed theme names is not an array');
        }

        // Use array map to extract theme names
        const themeNames = parsedThemeNames.map(item => item.theme);

		console.log("theme names are:", themeNames);
		const colorPalettes = [];
        // Generate color palettes for each theme
        for (const theme of themeNames) {
            const themeInput = userInput2.replace('{theme from userInput1}', theme);
            const paletteResponse = await chatCompletion(themeInput, model);
            
            // No need to sanitize here as it's already done in chatCompletion
            colorPalettes.push(paletteResponse);
        }

        const elapsedTime = Date.now() - startTime;
        console.log(`getColorPalettes returning successfully with ${colorPalettes.length} palettes. Elapsed time: ${elapsedTime}ms`);
        return colorPalettes;

	} catch (error: unknown) {
        const elapsedTime = Date.now() - startTime;
        console.error("Error generating color palettes:", error);
		let errorMessage = "Unknown error";
		if (error instanceof Error) {
			errorMessage = error.message;
			console.error(`getColorPalettes throwing error: ${error.message}. Elapsed time: ${elapsedTime}ms`);
		} else {
			console.error("An unknown error occurred:", error);
		}

		return [{
            theme: "Error: " + errorMessage,
            colors: ['#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000']
        }];
	}
}
// This form is used to call the generate color palettes API
// TODO: This will first query the mongodb and see if anything is already there if so, direct the to /theme/[name]
// otherwise, call HF/inference API, generate themes, and write to mongodb, then direct to /theme/[name]
export default async function fetchColorThemes(prevState: {
    message: string;
  }, formData: FormData) {

	const schema = z.object({
		keyword: z.string().min(1),
		model: z.string().min(1),
	});
	// console.log("z--->", z.string());
	
	const parse = schema.safeParse({
		keyword: formData.get("keyword"),
		model: formData.get("model")
	});
	
	// TODO: Return a list of red colors
	if (!parse.success) {
		return { message: "Failed to create todo" };
	}

	const { keyword, model } = parse.data;

	console.log('z----keyword:', keyword, '; model:', model);

	// const keyword = formData.get("keyword");
	console.log("formData:", keyword);
	// await new Promise(resolve => setTimeout(resolve, 1000));
	
	const result = await genColorTheme();
	console.log('result:', result);
	const insert = await insertColorTheme(keyword, model);
	
	/* const res = await fetch(
		"https://stapi.co/api/v1/rest/season?uid=SAMA0000001633"
	);
	const json = await res.json();
	console.log('json:', json); */

	// const out = await hf.chatCompletion({
	// 	// model: "mistralai/Mistral-7B-Instruct-v0.2",
	// 	messages: [{ role: "user", content: "Complete the this sentence with words one plus one is equal " }],
	// 	max_tokens: 100
	//   });

	// const out = await hf.translation({
	// 	model: 't5-base',
	// 	inputs: 'My name is Wolfgang and I live in Amsterdam'
	//   })
	  

	//   console.log(out);
	//   console.log(out.choices[0].message);

	revalidatePath('/');

	// if (!res.ok) {
	// 	return { message: "Please enter a url" };
	// }

	redirect('/theme/star-trek'); // Pass 'res' as the first argument
}
