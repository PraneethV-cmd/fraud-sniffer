import './App.css'
import ColorTabs from './components/tabs'
import TemporaryDrawer from './components/sidebar'

function App() {

  return (
    <>
      <div>
        <TemporaryDrawer></TemporaryDrawer>
        <ColorTabs></ColorTabs>
      </div>
    </>
  )
}

export default App
