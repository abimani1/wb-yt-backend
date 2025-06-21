const { YtDlp } = require("ytdlp-nodejs");

const ytdlp = new YtDlp();

const YouTubeController = {
  async getUrl(req, res) {
    const { url } = req.body;

    try {
      const info = await ytdlp.getInfoAsync(url);

      console.log(info.formats, "get the info format url");

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
