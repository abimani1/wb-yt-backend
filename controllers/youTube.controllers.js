const { YtDlp } = require("ytdlp-nodejs");
const path = require("path");
const ytdlp = new YtDlp();

const YouTubeController = {
  async getUrl(req, res) {
    const { url } = req.body;

    try {
      const cmdOptions = [
        url,
        "--dump-json",
        "--no-warnings",
        "--no-call-home",
        "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "--cookies", "cookies.txt", // ✅ optional, if you include cookies.txt
      ];

      const rawJson = await ytdlp.execAsync(cmdOptions);
      console.log(rawJson, "rawJson");
      
      const info = JSON.parse(rawJson); // this replaces getInfoAsync()
      console.log(info, "info");

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

      const response = {
        id: info.id,
        title: info.title,
        thumbnail: info.thumbnail,
        formats,
        url,
      };

      res.json(response);
    } catch (err) {
      console.error("Failed to get info:", err);
      res.status(500).json({ error: "Failed to fetch video info" });
    }
  },
};

module.exports = YouTubeController;
