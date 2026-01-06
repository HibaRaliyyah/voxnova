import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export async function POST(req) {
  const { text, voice } = await req.json();

  const polly = new PollyClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: voice,
  });

  const { AudioStream } = await polly.send(command);
  const audioBytes = await AudioStream.transformToByteArray();

  return new Response(Buffer.from(audioBytes), {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}
