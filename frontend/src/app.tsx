import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Brain, Heart, Eye, AlertCircle, CheckCircle, Moon, Sun, RotateCcw } from 'lucide-react'

interface ClinicalData {
  age: number
  gender: string
  bmi: number
  hba1c: number
  blood_glucose: number
  blood_pressure_systolic: number
  blood_pressure_diastolic: number
  diabetes_duration: number
  creatinine: number
  cholesterol_total: number
  cholesterol_ldl: number
  cholesterol_hdl: number
  triglycerides: number
  has_hypertension: boolean
  smoking_status: string
  family_history: boolean
}

interface RiskScore {
  value: number
  category: string
  confidence: number
}

interface PredictionResponse {
  prediction_id: string
  timestamp: string
  dr_stage: string
  dr_stage_probability: number
  dr_class_probabilities: Record<string, number>
  overall_risk_score: RiskScore
  nephropathy_risk: RiskScore
  neuropathy_risk: RiskScore
  cardiovascular_risk: RiskScore
  explanation: {
    image_contribution: number
    clinical_contribution: number
    top_image_features: string[]
    top_clinical_features: Array<{
      feature_name: string
      contribution: number
      normalized_contribution: number
    }>
    natural_language_explanation: string
  }
  recommendations: string[]
  follow_up_months: number
  model_version: string
  processing_time_ms: number
}

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [formData, setFormData] = useState<ClinicalData>({
    age: 45,
    gender: 'male',
    bmi: 27.5,
    hba1c: 7.5,
    blood_glucose: 140,
    blood_pressure_systolic: 130,
    blood_pressure_diastolic: 85,
    diabetes_duration: 5,
    creatinine: 1.1,
    cholesterol_total: 200,
    cholesterol_ldl: 130,
    cholesterol_hdl: 45,
    triglycerides: 150,
    has_hypertension: false,
    smoking_status: 'never',
    family_history: true,
  })

  const initialFormData: ClinicalData = {
    age: 45,
    gender: 'male',
    bmi: 27.5,
    hba1c: 7.5,
    blood_glucose: 140,
    blood_pressure_systolic: 130,
    blood_pressure_diastolic: 85,
    diabetes_duration: 5,
    creatinine: 1.1,
    cholesterol_total: 200,
    cholesterol_ldl: 130,
    cholesterol_hdl: 45,
    triglycerides: 150,
    has_hypertension: false,
    smoking_status: 'never',
    family_history: true,
  }

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Clear data function
  const handleClearData = () => {
    setFormData(initialFormData)
    setResult(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/prediction/demo-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to analyze. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value
    }))
  }

  const getRiskColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'low': return 'text-green-500'
      case 'moderate': return 'text-yellow-500'
      case 'high': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Night Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          {/* Night Mode Button - Top Right */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`absolute top-0 right-0 p-3 rounded-lg shadow-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          <h1 className={`text-4xl font-bold mb-2 flex items-center justify-center gap-3 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <Brain className="text-indigo-600" size={40} />
            Diabetic AI System
          </h1>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Explainable Multimodal AI for Diabetic Complication Risk Assessment
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Patient Clinical Data
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>BMI</label>
                  <input
                    type="number"
                    step="0.1"
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>HbA1c (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="hba1c"
                    value={formData.hba1c}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Blood Glucose (mg/dL)</label>
                  <input
                    type="number"
                    name="blood_glucose"
                    value={formData.blood_glucose}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>BP Systolic</label>
                  <input
                    type="number"
                    name="blood_pressure_systolic"
                    value={formData.blood_pressure_systolic}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>BP Diastolic</label>
                  <input
                    type="number"
                    name="blood_pressure_diastolic"
                    value={formData.blood_pressure_diastolic}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Diabetes Duration (years)</label>
                  <input
                    type="number"
                    name="diabetes_duration"
                    value={formData.diabetes_duration}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Creatinine</label>
                  <input
                    type="number"
                    step="0.1"
                    name="creatinine"
                    value={formData.creatinine}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Cholesterol</label>
                  <input
                    type="number"
                    name="cholesterol_total"
                    value={formData.cholesterol_total}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>LDL Cholesterol</label>
                  <input
                    type="number"
                    name="cholesterol_ldl"
                    value={formData.cholesterol_ldl}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>HDL Cholesterol</label>
                  <input
                    type="number"
                    name="cholesterol_hdl"
                    value={formData.cholesterol_hdl}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Triglycerides</label>
                  <input
                    type="number"
                    name="triglycerides"
                    value={formData.triglycerides}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Smoking Status</label>
                  <select
                    name="smoking_status"
                    value={formData.smoking_status}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="never">Never</option>
                    <option value="former">Former</option>
                    <option value="current">Current</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_hypertension"
                    checked={formData.has_hypertension}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4"
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hypertension</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="family_history"
                    checked={formData.family_history}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4"
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Family History</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Patient'
                  )}
                </button>
                
                {result && (
                  <button
                    type="button"
                    onClick={handleClearData}
                    className={`px-6 py-3 rounded-md font-semibold transition flex items-center gap-2 ${
                      darkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Clear Data and Results"
                  >
                    <RotateCcw size={20} />
                    Clear
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {result ? (
              <>
                {/* DR Stage */}
                <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="text-indigo-600" size={28} />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Diabetic Retinopathy
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-indigo-600">{result.dr_stage}</p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Confidence: {(result.dr_stage_probability * 100).toFixed(1)}%
                    </p>
                    <div className="mt-4 space-y-1">
                      {Object.entries(result.dr_class_probabilities).map(([stage, prob]) => (
                        <div key={stage} className="flex justify-between items-center">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {stage}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className={`w-32 rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${prob * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm w-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {(prob * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Scores */}
                <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Complication Risks
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="text-purple-600" size={20} />
                        <span className="text-gray-700">Overall Risk</span>
                      </div>
                      <span className={`font-bold ${getRiskColor(result.overall_risk_score.category)}`}>
                        {result.overall_risk_score.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-blue-600" size={20} />
                        <span className="text-gray-700">Nephropathy</span>
                      </div>
                      <span className={`font-bold ${getRiskColor(result.nephropathy_risk.category)}`}>
                        {result.nephropathy_risk.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="text-orange-600" size={20} />
                        <span className="text-gray-700">Neuropathy</span>
                      </div>
                      <span className={`font-bold ${getRiskColor(result.neuropathy_risk.category)}`}>
                        {result.neuropathy_risk.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="text-red-600" size={20} />
                        <span className="text-gray-700">Cardiovascular</span>
                      </div>
                      <span className={`font-bold ${getRiskColor(result.cardiovascular_risk.category)}`}>
                        {result.cardiovascular_risk.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Explanation</h3>
                  <p className="text-gray-700 mb-4">{result.explanation.natural_language_explanation}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Top Contributing Factors:</p>
                    {result.explanation.top_clinical_features.map((feature, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{feature.feature_name}</span>
                        <span className="font-medium text-indigo-600">
                          {(feature.normalized_contribution * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-indigo-50 rounded-md">
                    <p className="text-sm text-indigo-800">
                      <strong>Follow-up:</strong> Recommended in {result.follow_up_months} month{result.follow_up_months > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Brain className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-gray-500 text-lg">Enter patient data and click "Analyze Patient" to get AI-powered predictions</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default App