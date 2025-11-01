import { GoogleGenAI, Type } from '@google/genai';

interface ForecastResult {
  forecast: number[];
  lowerBound: number[];
  upperBound: number[];
}

export const generateForecast = async (series: number[], periodsToForecast: number): Promise<ForecastResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure your API key.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema = {
    type: Type.OBJECT,
    properties: {
      forecast: {
        type: Type.ARRAY,
        items: { type: Type.NUMBER },
        description: `An array of ${periodsToForecast} numbers representing the forecasted sales for the next ${periodsToForecast} weeks.`
      },
      lowerBound: {
        type: Type.ARRAY,
        items: { type: Type.NUMBER },
        description: `An array of ${periodsToForecast} numbers for the lower bound of the 95% confidence interval.`
      },
      upperBound: {
        type: Type.ARRAY,
        items: { type: Type.NUMBER },
        description: `An array of ${periodsToForecast} numbers for the upper bound of the 95% confidence interval.`
      },
    },
    required: ['forecast', 'lowerBound', 'upperBound'],
  };

  const prompt = `
    You are an expert time-series forecasting model.
    Your task is to predict future sales based on the provided historical weekly data for a consumer product (orange juice).

    Historical Data (weekly sales):
    ${JSON.stringify(series)}

    Data characteristics:
    - The data represents weekly sales with a 52-week (annual) seasonality.
    - Sales are higher in summer and lower in winter.
    - There is a noticeable upward trend over the years.

    Instructions:
    1.  Decompose the time series to model its trend and seasonality.
    2.  Project the trend and seasonal patterns to forecast sales for the next ${periodsToForecast} weeks.
    3.  Provide a 95% confidence interval for your forecast, reflecting prediction uncertainty.
    4.  Your primary goal is high accuracy. Aim for a Mean Absolute Percentage Error (MAPE) under 10%.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        systemInstruction: "You are a data scientist specializing in time series forecasting. Your task is to predict future sales based on historical data provided. You must account for seasonality. Respond ONLY with the JSON object matching the provided schema.",
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.2, 
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString) as ForecastResult;

    // Validation
    if (
        !parsed.forecast || !parsed.lowerBound || !parsed.upperBound ||
        parsed.forecast.length !== periodsToForecast || parsed.lowerBound.length !== periodsToForecast || parsed.upperBound.length !== periodsToForecast ||
        parsed.forecast.some(v => typeof v !== 'number') || parsed.lowerBound.some(v => typeof v !== 'number') || parsed.upperBound.some(v => typeof v !== 'number')
    ) {
        console.error("Invalid forecast format received:", parsed);
        throw new Error('Invalid forecast format received from API.');
    }

    return parsed;
  } catch (error) {
    console.error('Error generating forecast with Gemini API:', error);
    throw new Error('Failed to generate forecast. The AI model might be unavailable or the request failed.');
  }
};