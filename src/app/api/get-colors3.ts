'use server';

import { redirect } from 'next/navigation';
import { HfInference } from '@huggingface/inference';
import { z } from "zod";
// import { insertColorTheme } from './mongodb-data';
import { ColorPalette, Theme } from './types';
import { insertColorTheme, colorThemeByNameExists } from './mongodb-data';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";


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

export async function redirectToTheme(formData: FormData, delay = 0) {
    const formattedThemeName = slugFromName(formData.get("keyword") as string);
    await new Promise(resolve => setTimeout(resolve, delay));
    redirect(`/theme/${formattedThemeName}`);
}

export async function getMockColorThemes(): Promise<Theme[]> {
    // fake delay
    await new Promise(resolve => setTimeout(resolve, 333));

    const timestamp = new Date().toISOString();
    const mockTheme: Theme = {
        name: "Mock Seasonal Theme",
        model: "mock llm",
        timestamp: timestamp,
        palettes: [
            {
                name: "Ocean Breeze",
                colors: ["#1A237E", "#0D47A1", "#01579B", "#0277BD", "#039BE5", "#29B6F6"]
            },
            {
                name: "Forest Mist",
                colors: ["#1B5E20", "#2E7D32", "#388E3C", "#43A047", "#4CAF50", "#66BB6A"]
            },
            {
                name: "Desert Sunset",
                colors: ["#BF360C", "#D84315", "#E64A19", "#F4511E", "#FF5722", "#FF7043"]
            },
            {
                name: "Arctic Frost",
                colors: ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B"]
            },
            {
                name: "Royal Purple",
                colors: ["#4A148C", "#6A1B9A", "#7B1FA2", "#8E24AA", "#9C27B0", "#AB47BC"]
            }
        ]
    };

    return [mockTheme];
}

async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Attempt ${attempt} failed:`, lastError);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

export async function fetchColorThemes2(keyword: string, model: string | null = null) {
//   const exists = await colorThemeByNameExists(keyword);

//   if (exists) {
//     const formattedThemeName = slugFromName(keyword);
//     redirect(`/theme/${formattedThemeName}`);
//     return;
//   }

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  name: "The name of the color theme",
  model: "gpt-3.5-turbo",
  timestamp: "The timestamp when the theme was created",
  palettes: "A JSON string containing an array of color palettes, each with a name and colors array"
});

const formatInstructions = parser.getFormatInstructions();

const result = await callWithRetry(async () => {
  console.log("calling retries....")
  const prompt = PromptTemplate.fromTemplate(
    "Create a color theme based on {text}. The theme should have 5 color palettes, each with a palette name and 6 colors. Return a JSON object with the following structure: {format_instructions}. Make sure to stringify the palettes array."
  );

  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  try {
    const promptText = await prompt.format({ 
      text: keyword,
      format_instructions: formatInstructions
    });
    const response = await model.invoke([
      { role: "user", content: promptText }
    ]);
    
    // Parse the response into a Theme object
    const parsed = await parser.parse(response.text);
    console.log(">>>>parsed", parsed);
    
    // Convert the parsed object to a Theme
    const theme: Theme = {
      name: String(parsed.name),
      model: String(parsed.model),
      timestamp: String(parsed.timestamp),
      palettes: JSON.parse(parsed.palettes)
    };
    
    return [theme];
  } catch (error) {
    console.error("Error in fetchColorThemes2:", error);
    throw error;
  }
});

return result;

  // Insert the theme into the database
//   const insertedTheme = await insertColorTheme(result);

  // Redirect to the theme page
//   const formattedThemeName = slugFromName(insertedTheme.name);
//   redirect(`/theme/${formattedThemeName}`);
}

// Fetch from HF if no cache exists in mongodb
export default async function fetchColorThemes(formData: FormData) {
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

    const exists = await colorThemeByNameExists(keyword);

    if (exists) {
        redirect(`/theme/${slugFromName(keyword)}`);
    }

    const result = await genColorTheme(keyword, model);

    const insertedTheme = await insertColorTheme(result as Theme);

    const formattedThemeName = slugFromName(insertedTheme.name);
    redirect(`/theme/${formattedThemeName}`);
}
