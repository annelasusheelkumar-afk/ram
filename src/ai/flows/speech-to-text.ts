'use server';

/**
 * @fileOverview A flow for converting speech to text.
 *
 * - speechToText - Converts audio data to text.
 * - SpeechToTextInput - The input type for the speechToText function.
 * - SpeechToTextOutput - The return type for the speechToText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';

const SpeechToTextInputSchema = z.object({
  audio: z.instanceof(Buffer),
});
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

const SpeechToTextOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;

export async function speechToText(
  input: SpeechToTextInput
): Promise<SpeechToTextOutput> {
  return speechToTextFlow(input);
}

// Helper function to convert webm to wav
async function convertWebmToWav(webmBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const tempInputPath = path.join(os.tmpdir(), `input-${Date.now()}.webm`);
    const tempOutputPath = path.join(os.tmpdir(), `output-${Date.now()}.wav`);

    fs.writeFile(tempInputPath, webmBuffer, (err) => {
      if (err) return reject(err);

      ffmpeg(tempInputPath)
        .toFormat('wav')
        .on('error', (err) => {
          fs.unlink(tempInputPath, () => {}); // Clean up input file
          reject(err);
        })
        .on('end', () => {
          fs.unlink(tempInputPath, () => {}); // Clean up input file
          resolve(tempOutputPath);
        })
        .save(tempOutputPath);
    });
  });
}

const speechToTextFlow = ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async (input) => {
    const wavPath = await convertWebmToWav(input.audio);
    const audioDataUri = `data:audio/wav;base64,${fs.readFileSync(wavPath, 'base64')}`;
    
    // Clean up the generated wav file
    fs.unlink(wavPath, () => {});

    const { text } = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: [{ media: { url: audioDataUri, contentType: 'audio/wav' } }],
    });
    return { text };
  }
);
