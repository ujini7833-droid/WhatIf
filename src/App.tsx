import './App.css'
import Hero from './components/home/Hero/Hero'
import DecisionPreview from './components/home/Hero/DecisionPreview'
import RadarChart from './components/home/Hero/RadarChart'
import RankingItem from './components/home/Hero/RankingItem'

function App() {
  return (
    <>
    <Hero />
    <DecisionPreview />
    <RadarChart />
    <RankingItem rank={1} name="Alice" score={4.5} />
    </>
  )
}

export default App
