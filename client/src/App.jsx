import { useState } from "react";
import axios from "axios";
import {
  FaYoutube,
  FaFilePdf,
  FaAlignLeft,
  FaMagic,
  FaCopy,
  FaCheckCircle,
  FaRocket,
} from "react-icons/fa";
import { motion } from "framer-motion";

function App() {
  const [activeTab, setActiveTab] = useState("text");

  const [text, setText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [pdf, setPdf] = useState(null);

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

 const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    alert("Summary copied!");
  };

  const summarizeText = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/text-summary`,
        { text }
      );

      setSummary(res.data.summary);

    } catch (error) {

      alert("Error generating summary");

    } finally {

      setLoading(false);
    }
  };

  const summarizeYoutube = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/youtube-summary`,
        { url: youtubeUrl }
      );

      setSummary(res.data.summary);

    } catch (error) {

      alert("YouTube summary failed");

    } finally {

      setLoading(false);
    }
  };

  const summarizePdf = async () => {

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("pdf", pdf);

      const res = await axios.post(
        `${backendUrl}/pdf-summary`,
        formData
      );

      setSummary(res.data.summary);

    } catch (error) {

      alert("PDF summary failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 flex justify-center items-center min-h-screen p-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[35px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 md:p-12"
        >

          <div className="text-center mb-12">

            <div className="flex justify-center mb-5">

              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="bg-gradient-to-r from-blue-500 to-pink-500 p-5 rounded-3xl shadow-lg"
              >
                <FaMagic size={35} />
              </motion.div>

            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              AI Summarizer
            </h1>

            <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
              Instantly summarize Text, PDFs & YouTube videos with powerful AI.
            </p>

            <div className="flex justify-center gap-6 mt-6 text-sm text-slate-400 flex-wrap">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                Fast
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                Accurate
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                AI Powered
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

            <button
              onClick={() => setActiveTab("text")}
              className={`group p-5 rounded-2xl transition-all duration-300 border ${
                activeTab === "text"
                  ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <FaAlignLeft size={28} />
                <span className="font-semibold text-lg">
                  Text
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("pdf")}
              className={`group p-5 rounded-2xl transition-all duration-300 border ${
                activeTab === "pdf"
                  ? "bg-red-600 border-red-400 shadow-lg shadow-red-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <FaFilePdf size={28} />
                <span className="font-semibold text-lg">
                  PDF
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("youtube")}
              className={`group p-5 rounded-2xl transition-all duration-300 border ${
                activeTab === "youtube"
                  ? "bg-pink-600 border-pink-400 shadow-lg shadow-pink-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <FaYoutube size={28} />
                <span className="font-semibold text-lg">
                  YouTube
                </span>
              </div>
            </button>

          </div>

          {activeTab === "text" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >

              <textarea
                rows="10"
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg transition-all"
              />

              <button
                onClick={summarizeText}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-[1.01] transition-all duration-300 p-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
              >
                <FaRocket />
                Summarize Text
              </button>

            </motion.div>
          )}

          {activeTab === "youtube" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >

              <input
                type="text"
                placeholder="Paste YouTube URL..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-lg transition-all"
              />

              <button
                onClick={summarizeYoutube}
                className="mt-6 w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-[1.01] transition-all duration-300 p-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
              >
                <FaYoutube />
                Summarize Video
              </button>

            </motion.div>
          )}

          {activeTab === "pdf" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >

              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-3xl p-10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">

                <FaFilePdf size={50} className="text-red-400 mb-4" />

                <p className="text-lg font-semibold">
                  Upload PDF File
                </p>

                <p className="text-slate-400 text-sm mt-2">
                  Drag & drop or click to browse
                </p>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdf(e.target.files[0])}
                  className="hidden"
                />

              </label>

              {pdf && (
                <div className="mt-4 text-green-400 text-center">
                  Selected: {pdf.name}
                </div>
              )}

              <button
                onClick={summarizePdf}
                className="mt-6 w-full bg-gradient-to-r from-red-500 to-orange-500 hover:scale-[1.01] transition-all duration-300 p-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
              >
                <FaFilePdf />
                Summarize PDF
              </button>

            </motion.div>
          )}

          {loading && (
            <div className="mt-10 text-center">

              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">

                <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                <span className="text-lg font-semibold text-blue-300">
                  Generating AI Summary...
                </span>

              </div>

            </div>
          )}

          {summary && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-white/5 border border-white/10 rounded-[30px] p-8"
            >

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-3xl font-bold">
                  AI Summary
                </h2>

                <button
                  onClick={copySummary}
                  className="bg-white/10 hover:bg-white/20 transition-all p-4 rounded-2xl"
                >
                  <FaCopy />
                </button>

              </div>

              <div className="text-slate-300 leading-9 whitespace-pre-wrap text-lg">
                {summary}
              </div>

            </motion.div>
          )}

        </motion.div>

      </div>
    </div>
  );
}

export default App;