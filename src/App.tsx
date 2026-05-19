import { Routes, Route } from 'react-router-dom'
import Welcome from './routes/Welcome'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
    </Routes>
  )
}

export default App
