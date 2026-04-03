import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-[#242424] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          EduQuest AI
        </h1>
        <p className="text-xl text-gray-400 max-w-lg mx-auto">
          Automated Teaching Module to Contextual Question Generator. 
          Ready to transform your teaching experience.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
            Get Started
          </button>
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all">
            View Docs
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
