'use server';

import { redirect } from 'next/navigation';
import { HfInference } from '@huggingface/inference';
import { z } from "zod";
// import { insertColorTheme } from './mongodb-data';
import { ColorPalette, Theme } from './types';
import { insertColorTheme, colorThemeByNameExists } from './mongodb-data';

const huggingFaceAccessToken = process.env.HUGGING_FACE_ACCESS_TOKEN;

if (!huggingFaceAccessToken) {
    console.error('Hugging Face access token not found in .env file');
}

// console.log('hugging face:::', huggingFaceAccessToken);

const hf = new HfInference(huggingFaceAccessToken);
// Used to separate the JSON array from the rest of the response. 
// Setting the correct delimiter is an art that entails experimentation, and is important for the JSON parsing.
const delimiter = "####END####";

// Helper functions
function sanitizeResponse(response: string, delimiter: string) {
    return response
        .replace(delimiter, '')
		// // .replace(/^[^:]+:\s*/, '')
        // .replace(/```json\s*|\s*```/g, '')
        // .replace(/\n/g, '')
        // .replace(/^json\s*/, '')
        // .replace(/^json(?=\{|\[)/, '')
        // .trim();
}

function slugFromName(name:string):string {
    return name.toLowerCase().replace(/\s+/g, '-');
}

async function chatCompletion(message: string, model: string | null = null) {
	try {
		const response = await hf.chatCompletion({
			model: "mistralai/Mistral-7B-Instruct-v0.3",
			messages: [
				{
					role: "user",
					content:
						message +
                        delimiter,
				},
			],
			system:
				"Generate responses related to color palettes and themes. The user input message will be delimited by " +
				delimiter +
				" characters.",
			assistant:
				"You are a helpful AI assistant specializing in art, design and color theory. Do not include any explanation in the response, just the output in valid JSON format.",
			temperature: 0.8,
			max_tokens: 100,
			top_p: 0.9,
		});

		const generated_text = response?.choices?.at(0)?.message?.content;

		if (!generated_text) {
			console.error("Generated text is undefined");
			return;
		}

		const sanitizedText = sanitizeResponse(generated_text, delimiter);

		// console.log("Debug - Sanitized text:", sanitizedText);

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

async function genColorTheme(keyword: string = "Star Trek", model: string | null = null): Promise<Theme> {
    let themeNamesPrompt: string;
    let timestamp:string;
    try {
        themeNamesPrompt = `Create a list of 5 different color palette names based on ${keyword}. Make sure the output is a valid JSON array of strings, in the following format: [\"Color Palette Name \", \"Color Palette Name\", ...]. Make sure the JSON array is wrapped in square brackets. Do not include anything else in the response, just the output.`;

        const colorPalettePrompt = "Create a color palette named \"<theme_name>\" consisting 6 colors, with each color represented in a hex color.  Make sure the output is a valid JSON object in the following format: { \"name\": \"Color Palette Name\", \"colors\": [\"#RRGGBB\", \"#RRGGBB\", \"#RRGGBB\", \"#RRGGBB\", \"#RRGGBB\", \"#RRGGBB\"] }. Do not include anything else in the response, just the output.";

        const themeNamesResponse = await chatCompletion(themeNamesPrompt, model);
        // console.log('themeNamesResponse:::', themeNamesResponse);

        if (!Array.isArray(themeNamesResponse)) {
            throw new Error('Parsed theme names is not an array');
        }

        const palettes:ColorPalette[] = [];

        for(const name of themeNamesResponse) {
            // console.log("theme name:", name);
            const themeInput = colorPalettePrompt.replace('<theme_name>', name);
            // console.log("themeInput", themeInput);
            const colorPaletteResponse = await chatCompletion(themeInput, model) as ColorPalette;
            // console.log("color palettes:\n", colorPaletteResponse);

            palettes.push(colorPaletteResponse);
        }

        // console.log("palettes!!!!\n", palettes);
        
        timestamp = new Date().toISOString();
        // console.log("timestamp:", timestamp);

        return {
            "name": keyword,
            "model": model,
            "timestamp": timestamp,
            "palettes": palettes
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        timestamp = new Date().toISOString();
        return {
            "name": keyword,
            "model": model,
            "timestamp": timestamp,
            "palettes": [{'name': 'Error:' + errorMessage, 'colors': ['#B71C1C', '#C62828', '#D32F2F', '#E53935', '#F44336', '#EF5350']}]
        }
    }
}
// Fetch from HF if no cache exists in mongodb
export default async function fetchColorThemes(prevState: { message: string; }, formData: FormData) {
    const schema = z.object({
		keyword: z.string().min(1),
		model: z.string().optional(), // Make model optional
	});

    const parse = schema.safeParse({
		keyword: formData.get("keyword"),
		model: formData.get("model") || ''
	});

    if (!parse.success) {
		return { message: "Failed to create todo" };
	}

	const { keyword, model } = parse.data;

    // console.log('z----keyword:', keyword, '; model:', model);

    // redirect('/theme/star-trek');
    
    const exists = await colorThemeByNameExists(keyword);

    if(exists) {
        redirect(`/theme/${slugFromName(keyword)}`); 
    }

    const result = await genColorTheme(keyword, model);
    // console.log('result!!!!', result);

    // Insert the theme and get a plain object back
    const insertedTheme = await insertColorTheme(result as Theme);
    // console.log("Inserted theme:", insertedTheme);

    const formattedThemeName = slugFromName(insertedTheme.name); // Format the theme name
    redirect(`/theme/${formattedThemeName}`); // Use the formatted name

    // return {
    //     'message': 'completed',
    //     'result': insertedTheme // Return the plain object
    // };
}
