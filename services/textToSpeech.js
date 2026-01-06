// services/textToSpeech.js
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export async function synthesizeSpeechBuffer(text, voiceId = "Joanna") {
  const client = new PollyClient({
    region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const cmd = new SynthesizeSpeechCommand({
    OutputFormat: "mp3",
    Text: text,
    VoiceId: voiceId,
    Engine: "standard",
  });

  const resp = await client.send(cmd);
  // resp.AudioStream is a readable stream in Node
  const array = [];
  for await (const chunk of resp.AudioStream) {
    array.push(Buffer.from(chunk));
  }
  return Buffer.concat(array);
}
