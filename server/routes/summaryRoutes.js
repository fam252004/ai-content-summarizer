const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const axios = require("axios");
const { YoutubeTranscript } = require("youtube-transcript");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

async function generateSummary(text) {
  try {

    // limit text length
    const shortText = text.slice(0, 1500);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: shortText,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    // if model still loading
    if (response.data.error) {
      return response.data.error;
    }

    return response.data[0].summary_text;

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    return "Error generating summary.";
  }
}

// ================= TEXT SUMMARY =================

router.post(
  "/text-summary",
  async (req, res) => {

    try {

      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          error: "Text is required",
        });
      }

      const summary =
        await generateSummary(text);

      res.json({ summary });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "Text summary failed",
      });
    }
  }
);

// ================= PDF SUMMARY =================

router.post(
  "/pdf-summary",
  upload.single("pdf"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          error: "No PDF uploaded",
        });
      }

      const dataBuffer =
        fs.readFileSync(req.file.path);

      const pdfData =
        await pdfParse(dataBuffer);

      const summary =
        await generateSummary(pdfData.text);

      fs.unlinkSync(req.file.path);

      res.json({ summary });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "PDF summary failed",
      });
    }
  }
);

// ================= YOUTUBE SUMMARY =================

router.post(
  "/youtube-summary",
  async (req, res) => {

    try {

      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          error: "YouTube URL required",
        });
      }

      const transcript =
        await YoutubeTranscript.fetchTranscript(url);

      const text = transcript
        .map((item) => item.text)
        .join(" ");

      const summary =
        await generateSummary(text);

      res.json({ summary });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "YouTube summary failed",
      });
    }
  }
);

module.exports = router;