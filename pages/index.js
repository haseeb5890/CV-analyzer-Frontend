import { useRef, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [dark, setDark] = useState(false);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef();

  const handleUploadAreaClick = () => fileInput.current?.click();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis({
        aiAnalysis: "Error analyzing resume. Please try again.",
        overallScore: 0,
        atsScore: 0,
        keywordsScore: 0,
        readabilityScore: 0,
        missingKeywords: [],
        suggestions: [],
      });
    }
    setLoading(false);
  };

  // Stats data
  const stats = [
    {
      icon: "fa-star",
      label: "Overall Score",
      value: analysis ? `${analysis.overallScore ?? "--"}/100` : "--/100",
      percent: analysis?.overallScore ?? 0,
      desc: analysis
        ? "Your CV scores better than 92% of profiles in your industry"
        : "Upload a CV to see your score",
    },
    {
      icon: "fa-bullseye",
      label: "ATS Compatibility",
      value: analysis ? `${analysis.atsScore ?? "--"}%` : "--%",
      percent: analysis?.atsScore ?? 0,
      desc: analysis
        ? "Excellent compatibility with Applicant Tracking Systems"
        : "Compatibility with tracking systems",
    },
    {
      icon: "fa-key",
      label: "Keywords Match",
      value: analysis ? `${analysis.keywordsScore ?? "--"}%` : "--%",
      percent: analysis?.keywordsScore ?? 0,
      desc: analysis
        ? "Top missing keywords for your target role:"
        : "Relevant keywords in your industry",
      keywords: analysis?.missingKeywords ?? [],
    },
    {
      icon: "fa-eye",
      label: "Readability",
      value: analysis ? `${analysis.readabilityScore ?? "--"}%` : "--%",
      percent: analysis?.readabilityScore ?? 0,
      desc: analysis
        ? "Recruiters typically spend 6-8 seconds scanning your CV"
        : "How easily recruiters can read your CV",
    },
  ];

  const suggestions = analysis?.suggestions || [
    {
      title: "Upload a resume to see suggestions",
      description:
        "Click the upload area above and select your PDF resume to get started with the analysis.",
    },
  ];

  return (
    <>
      <Head>
        <title>CV Genius - AI Resume Analysis</title>
        <meta
          name="description"
          content="Analyze your CV with AI-powered insights"
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className={dark ? "dark" : ""}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <div className="flex min-h-screen">
            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 lg:p-12 w-full">
              {/* Header */}
              <div className="flex  sm:flex-row justify-between items-center sm:items-center mb-8 gap-4">
                <img
                  src="/logo.png"
                  alt="CV Genius"
                  className="h-10 md:h-20 mr-3"
                />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    CV Analysis Dashboard
                  </h2>
                </div>
                <button
                  onClick={() => setDark((d) => !d)}
                  className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {dark ? " Light Mode" : " Dark Mode"}
                </button>
              </div>

              {/* Upload Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-blue-700 dark:text-blue-300">
                    Analyze Your CV
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Quickly analyze your CV! Upload your PDF here
                  </p>
                </div>

                {/* Upload Area */}
                <div
                  className=" border-2 border-dashed  border-gray-300 dark:border-gray-600 rounded-lg py-12 px-4 mb-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200"
                  onClick={handleUploadAreaClick}
                >
                  <div className="flex justify-center items-center mb-3">
                    <i className="fas fa-cloud-upload-alt place-items-center text-4xl text-blue-700 dark:text-blue-300 mb-2"></i>
                  </div>
                  <h3 className="flex text-lg justify-center font-semibold mb-2 text-gray-700 dark:text-gray-200">
                    Drag & Drop Your CV Here
                  </h3>
                  <p className="flex justify-center text-gray-500 dark:text-gray-400">
                    or click to browse files (PDF only)
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    ref={fileInput}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium">
                        <i className="fas fa-file-pdf mr-2"></i>
                        {file.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Analyze Button */}
                <div className="flex justify-center">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200 min-w-[200px]"
                    disabled={!file || loading}
                    onClick={handleAnalyze}
                  >
                    <i className="fas fa-bolt"></i>
                    {loading ? (
                      <span className="flex items-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Analyzing...
                      </span>
                    ) : (
                      "Quick Analyze"
                    )}
                  </button>
                </div>

                {/* AI Analysis Result */}
                {analysis?.aiAnalysis && (
                  <div className="mt-8 text-left bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 text-lg">
                      AI Analysis Result
                    </h3>
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                      {analysis.aiAnalysis}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6"
                  >
                    <div className="flex items-center text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
                      <i
                        className={`fas ${stat.icon} mr-2 text-blue-600 dark:text-blue-400`}
                      ></i>
                      {stat.label}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                      {stat.value}
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                      <div
                        className="h-2 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${stat.percent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {stat.desc}
                    </p>
                    {stat.keywords && stat.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {stat.keywords.slice(0, 3).map((keyword, kwIndex) => (
                          <span
                            key={kwIndex}
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                        {stat.keywords.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{stat.keywords.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Detailed Analysis */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <div className="flex space-x-1 overflow-x-auto pb-2">
                    <button className="py-2 px-4 font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 whitespace-nowrap">
                      Improvement Suggestions
                    </button>
                    <button className="py-2 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap">
                      Skills Analysis
                    </button>
                    <button className="py-2 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap">
                      Experience Breakdown
                    </button>
                    <button className="py-2 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap">
                      Education Review
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start pb-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0"
                    >
                      <div className="mr-4 text-yellow-500 text-xl mt-1">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {suggestion.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {suggestion.description || suggestion.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
