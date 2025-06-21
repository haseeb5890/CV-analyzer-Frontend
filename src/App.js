import React, { useRef, useState } from "react";

export default function App() {
  const [dark, setDark] = useState(false);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef();

  const handleUploadAreaClick = () => fileInput.current.click();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setAnalysis(null);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setAnalysis(data);
    } catch {
      setAnalysis({ aiAnalysis: "Error analyzing resume." });
    }
    setLoading(false);
  };

  // Use analysis data or fallback to defaults
  const stats = [
    {
      icon: "fa-star",
      label: "Overall Score",
      value: analysis ? `${analysis.overallScore ?? "--"}/100` : "--",
      percent: analysis?.overallScore ?? 0,
      desc: analysis
        ? "Your CV scores better than 92% of profiles in your industry"
        : "",
    },
    {
      icon: "fa-bullseye",
      label: "ATS Compatibility",
      value: analysis ? `${analysis.atsScore ?? "--"}%` : "--",
      percent: analysis?.atsScore ?? 0,
      desc: analysis
        ? "Excellent compatibility with Applicant Tracking Systems"
        : "",
    },
    {
      icon: "fa-key",
      label: "Keywords Match",
      value: analysis ? `${analysis.keywordsScore ?? "--"}%` : "--",
      percent: analysis?.keywordsScore ?? 0,
      desc: analysis ? "Top missing keywords for your target role:" : "",
      keywords: analysis?.missingKeywords ?? [],
    },
    {
      icon: "fa-eye",
      label: "Readability",
      value: analysis ? `${analysis.readabilityScore ?? "--"}%` : "--",
      percent: analysis?.readabilityScore ?? 0,
      desc: analysis
        ? "Recruiters typically spend 6-8 seconds scanning your CV"
        : "",
    },
  ];

  const suggestions = analysis?.suggestions || [
    {
      title: "Upload a resume to see suggestions.",
      desc: "",
    },
  ];

  return (
    <div
      className={
        dark ? "dark bg-gray-900 min-h-screen" : "bg-gray-100 min-h-screen"
      }
    >
      <div className="flex min-h-screen">
        {/* Sidebar
        <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-800 shadow-lg py-8">
          <div className="flex items-center px-6 mb-10">
            <img src="/logo.png" alt="CV Genius" className="h-14 mr-3" />
            <h1 className="font-bold text-xl text-blue-700 dark:text-blue-300">
              CV Genius
            </h1>
          </div>
          <nav className="flex-1">
            <a
              href="#"
              className="flex items-center px-6 py-3 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-gray-900 font-semibold border-l-4 border-blue-700"
            >
              <i className="fas fa-home mr-3 w-5 text-center"></i> Dashboard
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-900 dark:hover:text-blue-300 transition"
            >
              <i className="fas fa-file-alt mr-3 w-5 text-center"></i> My
              Analyses
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-900 dark:hover:text-blue-300 transition"
            >
              <i className="fas fa-chart-line mr-3 w-5 text-center"></i>{" "}
              Performance
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-900 dark:hover:text-blue-300 transition"
            >
              <i className="fas fa-bell mr-3 w-5 text-center"></i> Notifications
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-900 dark:hover:text-blue-300 transition"
            >
              <i className="fas fa-cog mr-3 w-5 text-center"></i> Settings
            </a>
          </nav>
          <div className="mt-auto px-6">
            <button
              onClick={() => setDark((d) => !d)}
              className="w-full py-2 mt-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold"
            >
              {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </aside> */}

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <img src="/logo.png" alt="CV Genius" className="h-20 mr-3" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                CV Analysis Dashboard
              </h2>
            </div>
            <div className="mt-auto px-6">
              <button
                onClick={() => setDark((d) => !d)}
                className="w-full py-2 mt-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold"
              >
                {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
          </div>

          {/* Upload Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center">
            <h2 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">
              Analyze Your CV
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-4">
              Quickly analyze your CV! Upload your pdf here
            </p>
            <div
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg py-12 px-4 mb-6 cursor-pointer hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-gray-900 transition"
              onClick={handleUploadAreaClick}
            >
              <i className="fas fa-cloud-upload-alt text-4xl text-blue-700 dark:text-blue-300 mb-2"></i>
              <h3 className="text-lg font-semibold mb-1">
                Drag & Drop Your CV Here
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                or click to browse files (PDF, DOCX, TXT)
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                ref={fileInput}
                className="hidden"
                onChange={handleFileChange}
              />
              {file && (
                <div className="mt-4 text-blue-700 dark:text-blue-300 font-medium">
                  {file.name}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-blue-300"
                disabled={!file || loading}
                onClick={handleAnalyze}
              >
                <i className="fas fa-bolt"></i>
                {loading ? "Analyzing..." : "Quick Analyze"}
              </button>
            </div>
            {analysis?.aiAnalysis && (
              <div className="mt-8 text-left bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  AI Analysis Result
                </h3>
                <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm">
                  {analysis.aiAnalysis}
                </pre>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h3 className="flex items-center text-base font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  <i
                    className={`fas ${stat.icon} mr-2 text-blue-700 dark:text-blue-300`}
                  ></i>
                  {stat.label}
                </h3>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {stat.value}
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                  <div
                    className="h-2 bg-blue-700 dark:bg-blue-300 rounded-full"
                    style={{ width: `${stat.percent}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {stat.desc}
                </p>
                {stat.keywords && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stat.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="bg-blue-50 dark:bg-gray-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="py-2 px-6 font-semibold text-blue-700 dark:text-blue-300 border-b-2 border-blue-700 dark:border-blue-300 cursor-pointer">
                Improvement Suggestions
              </div>
              <div className="py-2 px-6 text-gray-500 dark:text-gray-400 cursor-pointer">
                Skills Analysis
              </div>
              <div className="py-2 px-6 text-gray-500 dark:text-gray-400 cursor-pointer">
                Experience Breakdown
              </div>
              <div className="py-2 px-6 text-gray-500 dark:text-gray-400 cursor-pointer">
                Education Review
              </div>
            </div>
            <div>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex mb-6 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:mb-0 last:pb-0"
                >
                  <div className="mr-4 text-yellow-500 text-2xl">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {s.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {/* FontAwesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </div>
  );
}
