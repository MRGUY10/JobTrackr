import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { 
  BellIcon,
  UserCircleIcon,
  SparklesIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const AIJobAnalyzerPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sampleJobDescription = `Senior Frontend Developer at TechCorp

We are looking for an experienced Senior Frontend Developer to join our dynamic team. The ideal candidate will have 5+ years of experience building modern web applications.

Requirements:
- 5+ years of professional experience with React and TypeScript
- Strong understanding of modern web technologies (HTML5, CSS3, ES6+)
- Experience with state management libraries (Redux, MobX, or Zustand)
- Proficiency in build tools and module bundlers (Webpack, Vite)
- Experience with RESTful APIs and GraphQL
- Knowledge of testing frameworks (Jest, React Testing Library)
- Excellent problem-solving skills and attention to detail
- Strong communication and collaboration abilities

Nice to Have:
- Experience with Next.js or other SSR frameworks
- Knowledge of AWS or cloud platforms
- Familiarity with CI/CD pipelines
- Open source contributions

Benefits:
- Competitive salary ($120k - $180k)
- Health, dental, and vision insurance
- 401(k) matching
- Unlimited PTO
- Remote work options`;

  const sampleResume = `John Doe
Senior Frontend Developer | React Specialist

Professional Summary:
Passionate frontend developer with 5+ years of experience building scalable web applications using React, TypeScript, and modern web technologies.

Experience:
Frontend Developer at Tech Solutions (2020-Present)
- Built and maintained React applications serving 100k+ users
- Implemented TypeScript migration improving code quality by 40%
- Led team of 4 developers in agile environment

Skills:
- Languages: JavaScript, TypeScript, HTML, CSS
- Frameworks: React, Vue.js, Next.js
- State Management: Redux, Context API
- Testing: Jest, React Testing Library
- Tools: Git, Webpack, Vite, Docker

Education:
Bachelor of Science in Computer Science
University of Technology (2018)`;

  const handleAnalyze = () => {
    if (!jobDescription.trim() || !resume.trim()) {
      alert('Please provide both job description and resume');
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        matchScore: 87,
        strengths: [
          'Strong React and TypeScript experience matches primary requirements',
          'Demonstrated leadership and team collaboration skills',
          'Experience with modern build tools (Webpack, Vite)',
          'Knowledge of testing frameworks (Jest, React Testing Library)',
          'Solid understanding of state management (Redux)',
          'Relevant experience duration (5+ years)'
        ],
        gaps: [
          'No explicit mention of GraphQL experience',
          'AWS/cloud platform experience not highlighted',
          'CI/CD pipeline knowledge not demonstrated',
          'Open source contributions not mentioned'
        ],
        recommendations: [
          'Add GraphQL projects or training to your resume',
          'Highlight any cloud platform experience (AWS, Azure, GCP)',
          'Include CI/CD tools you\'ve worked with (Jenkins, GitHub Actions)',
          'Add link to GitHub profile showing open source contributions',
          'Quantify achievements with more metrics and numbers',
          'Emphasize Next.js experience prominently (mentioned as nice-to-have)'
        ],
        keywordAnalysis: {
          matched: ['React', 'TypeScript', 'JavaScript', 'Redux', 'Jest', 'Webpack', 'Vite', 'HTML', 'CSS', 'Git'],
          missing: ['GraphQL', 'AWS', 'CI/CD', 'MobX', 'Zustand']
        },
        skillsBreakdown: {
          'Technical Skills': 85,
          'Experience Level': 95,
          'Education': 80,
          'Communication': 75,
          'Leadership': 90
        },
        salaryFit: {
          expectedRange: '$120k - $180k',
          yourPosition: 'Mid-High Range',
          reasoning: 'Your 5+ years of experience and leadership roles position you in the $140k-$170k range'
        },
        interviewPrep: [
          'Prepare examples of complex React architecture decisions',
          'Be ready to discuss TypeScript advanced features',
          'Review GraphQL basics and be honest about learning curve',
          'Prepare questions about their tech stack and deployment process',
          'Have examples of team leadership and mentoring ready'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const loadSampleData = () => {
    setJobDescription(sampleJobDescription);
    setResume(sampleResume);
  };

  const clearAll = () => {
    setJobDescription('');
    setResume('');
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">JT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JobTrackr</span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/applications" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Applications
              </Link>
              <Link to="/kanban" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Kanban
              </Link>
              <Link to="/documents" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Documents
              </Link>
              <Link to="/analytics" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Analytics
              </Link>
              <Link to="/job-search" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Job Search
              </Link>
              <Link to="/ai-analyzer" className="text-primary-600 font-medium border-b-2 border-primary-600 pb-1">
                AI Analyzer
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Settings
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              
              <Link to="/profile" className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <UserCircleIcon className="h-8 w-8 text-primary-600 hover:text-primary-700" />
                <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
                <span className="hidden md:block text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              <Link 
                to="/dashboard" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/applications" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Applications
              </Link>
              <Link 
                to="/kanban" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kanban
              </Link>
              <Link 
                to="/documents" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Documents
              </Link>
              <Link 
                to="/analytics" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link 
                to="/job-search" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Job Search
              </Link>
              <Link 
                to="/ai-analyzer" 
                className="block px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                AI Analyzer
              </Link>
              <Link 
                to="/calendar" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Calendar
              </Link>
              <Link 
                to="/settings" 
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircleIcon className="h-6 w-6 text-primary-600" />
                  {user?.name || 'Profile'}
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SparklesIcon className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
          <h1 className="text-4xl font-bold mb-3">AI Job Analyzer</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Get AI-powered insights on how well your resume matches job requirements and receive personalized recommendations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Job Description</h2>
                    <p className="text-sm text-gray-600">Paste the job posting details</p>
                  </div>
                </div>
                <button
                  onClick={loadSampleData}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Load Sample
                </button>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {jobDescription.length} characters
              </div>
            </div>
          </div>

          {/* Resume Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Your Resume</h2>
                    <p className="text-sm text-gray-600">Paste your resume text or upload file</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowUpTrayIcon className="h-4 w-4" />
                  Upload
                </button>
              </div>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {resume.length} characters
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={clearAll}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <XMarkIcon className="h-5 w-5" />
            Clear All
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim() || !resume.trim()}
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5" />
                Analyze with AI
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Match Score */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Overall Match Score</h2>
              <div className="text-7xl font-bold mb-2">{analysis.matchScore}%</div>
              <p className="text-primary-100 text-lg">
                {analysis.matchScore >= 80 ? 'Excellent Match! You should apply.' :
                 analysis.matchScore >= 60 ? 'Good Match with some improvements needed.' :
                 'Fair Match. Consider addressing gaps before applying.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Areas for Improvement</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.gaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <LightBulbIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Recommendations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Skills Breakdown</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(analysis.skillsBreakdown).map(([skill, score]) => (
                  <div key={skill}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill}</span>
                      <span className="font-bold text-primary-600">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordAnalysis.matched.map((keyword, index) => (
                    <span key={index} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordAnalysis.missing.map((keyword, index) => (
                    <span key={index} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary & Interview Prep */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Expected Range:</span>
                    <p className="text-lg font-semibold text-gray-900">{analysis.salaryFit.expectedRange}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Your Position:</span>
                    <p className="text-lg font-semibold text-primary-600">{analysis.salaryFit.yourPosition}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">{analysis.salaryFit.reasoning}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Interview Preparation Tips</h3>
                <ul className="space-y-2">
                  {analysis.interviewPrep.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-primary-600 font-bold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Download Report
              </button>
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Save Analysis
              </button>
              <Link
                to="/applications/new"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-purple-700 transition-all duration-200"
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIJobAnalyzerPage;
