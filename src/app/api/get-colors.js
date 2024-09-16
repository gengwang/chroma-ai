// File: colorGen.js
// import 'server-only'; // disable this to allow `pnpm test` to pass.

import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';
import { getContentType } from '../utils/utils'; //TODO: fix this import using @ notation.

dotenv.config();

// Helper functions
function sanitizeResponse(response) {
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
    process.exit(1);
}

// console.log('huggingFaceAccessToken:', huggingFaceAccessToken);

const hf = new HfInference(huggingFaceAccessToken);

// Used to separate the JSON array from the rest of the response. 
// Setting the correct delimiter is an art that entails experimentation, and is important for the JSON parsing.
const delimiter = "####END####\n";

async function chatCompletion(message, model) {
    try {
        const response = await hf.textGeneration({
            model: model || 'mistralai/Mistral-7B-Instruct-v0.3',
            // Available models:
            // - 'mistralai/Mistral-7B-Instruct-v0.3'
            // - 'mistralai/Mixtral-8x7B-Instruct-v0.1'
            // - 'mistralai/Mistral-Nemo-Instruct-2407'
            // model: 'mistralai/Mamba-Codestral-7B-v0.1',
            // model: 'meta-llama/Meta-Llama-3-8B', // To large for local dev
            //model: 'mattshumer/Reflection-Llama-3.1-70B', // Requires Pro subscription
            inputs: message,
            system: "Generate responses related to color palettes and themes. The user input message will be delimited by " + delimiter + " characters.",
            assistant: "You are a helpful AI assistant specializing in art, design and color theory. Do not include any explanation in the response, just the output.",
            parameters: {
                max_new_tokens: 100, // original template 50
                temperature: 0.8, // original template 0.7
                top_k: 100, // original template 50
                top_p: 0.95 // original template 0.95
            }
        });
        
        // console.log('Debug - Raw response:', response);

        // Extract the JSON content from the generated_text
        const jsonStart = response.generated_text.indexOf(delimiter) + delimiter.length;
        const jsonEnd = response.generated_text.length;
        
        if (jsonStart === -1) {
            throw new Error('No valid JSON content found in the response');
        }

        const jsonContent = response.generated_text.slice(jsonStart, jsonEnd);

        // Sanitize the extracted JSON content
        let sanitizedText = sanitizeResponse(jsonContent);

        // console.log('Debug - Sanitized text:', sanitizedText);
        
        // Attempt to parse the JSON
        try {
            const parsedContent = JSON.parse(sanitizedText);
            // const contentInfo = getContentType(parsedContent);
            // console.log(`Debug - Content Info:\nType: ${contentInfo.type}\nDetails: ${contentInfo.details}`);

            return parsedContent;
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            // const contentInfo = getContentType(sanitizedText);
            // console.log(`Debug - Content Info (failed to parse as JSON):\nType: ${contentInfo.type}\nDetails: ${contentInfo.details}`);
            throw new Error('Failed to parse JSON response');
        }
    } catch (error) {
        console.error('Error in chat completion:', error);
        return 'Error in chat completion.';
    }
}

async function getColorPalettes(model = "mistralai/Mistral-Nemo-Instruct-2407", keyword = "Star Trek") {
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
    } catch (error) {
        const elapsedTime = Date.now() - startTime;
        console.error("Error generating color palettes:", error);
        console.log(`getColorPalettes throwing error: ${error.message}. Elapsed time: ${elapsedTime}ms`);
        
        return [{
            theme: "Error: " + error.message,
            colors: ['#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000']
        }];
    }
}

export { getColorPalettes };
