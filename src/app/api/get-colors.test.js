import { getColorPalettes } from './get-colors.js';

describe('getColorPalettes', () => {
  it('should return an array of color palettes', async () => {
    
    const model = 'mistralai/Mistral-7B-Instruct-v0.3'
    
    // const keyword = 'Eternal flame' // error
    // const keyword = 'For better or worse' // error
    // const keyword = '25 basis points' // error
    // const keyword = 'Serendipity' // error

    // const keyword = 'Serendipitous encounter'
    // const model = 'mistralai/Mixtral-8x7B-Instruct-v0.1'
    // const model = 'mistralai/Mistral-Nemo-Instruct-2407'
    // const keyword = 'Star Trek'
    // const keyword = 'Monkey King'
    // const keyword = 'Vibing'
    // const keyword = 'Starlit embrace'
    // const keyword = 'Fist bump'
    // const keyword = 'Kiss on the cheek'
    // const keyword = 'Hi five'
    const keyword = '25 basis'
    
    const result = await getColorPalettes(model, keyword);
    // console.log('result::::\n', result);
    expect(result).toBeDefined();

    expect(Array.isArray(result)).toBe(true);
    
    expect(result.length).toBe(5);
    
    result.forEach(palette => {
      expect(palette).toHaveProperty('theme');
      expect(palette).toHaveProperty('colors');
      expect(Array.isArray(palette.colors)).toBe(true);
      expect(palette.colors.length).toBe(6);
      palette.colors.forEach(color => {
        expect(color).toMatch(/^#([0-9A-F]{3}){1,2}$/i);
      });
    });

  }, 30000); // Increase timeout to 30 seconds due to API calls
});
