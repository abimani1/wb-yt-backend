// app/api/youtube/route.js

import { YtDlp } from "ytdlp-nodejs";

const ytdlp = new YtDlp();

export async function POST(request) {
  try {
    const body = await request.json();
    // let url = "https://youtu.be/RRe6xDKaHnk?si=Wn1a437d71mQiXHx"
    const { url } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing URL" }), {
        status: 400,
      });
    }

    const info = await ytdlp.getInfoAsync(url);

    const formats = info.formats
      .filter(
        (f) =>
          f.url &&
          f.format_id &&
          f.vcodec !== "none" &&
          f.acodec !== "none"
      )
      .map((f) => ({
        itag: f.format_id,
        quality: f.height || "audio",
        type: f.ext,
        url: f.url,
        hasAudio: !!f.acodec,
        hasVideo: !!f.vcodec,
        filesize: f.filesize || null,
      }));

    const response = {
      id: info.id,
      title: info.title,
      thumbnail: info.thumbnail,
      formats,
      url,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Failed to get info:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch video info" }), {
      status: 500,
    });
  }
}
