const { YtDlp } = require("ytdlp-nodejs");
const path = require("path");
const fs = require("fs");
const ytdlp = new YtDlp();

const YouTubeController = {
  async getUrl(req, res) {
    const { url } = req.body;

    const cookiesPath = path.resolve(__dirname, "../cookies.txt");
    if (!fs.existsSync(cookiesPath)) {
      console.error("cookies.txt file not found");
      return res.status(500).json({ error: "Missing cookies.txt file" });
    }

    try {
      const cmdOptions = [
        url,
        "--dump-json",
        "--no-warnings",
        "--no-call-home",
        "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "--cookies", cookiesPath,
      ];

      const rawJson = await ytdlp.execAsync(cmdOptions);
      const info = JSON.parse(rawJson);

      const formats = info.formats
        .filter(
          (f) =>
            f.url && f.format_id && f.vcodec !== "none" && f.acodec !== "none"
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

      res.json({
        id: info.id,
        title: info.title,
        thumbnail: info.thumbnail,
        formats,
        url,
      });

    } catch (err) {
      console.error("Failed to get info:", err?.stderr || err.message);
      res.status(500).json({ error: "Failed to fetch video info", details: err.message });
    }
  },
};

module.exports = YouTubeController;
