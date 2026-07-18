import { ThemeProvider } from './theme/ThemeProvider'
import { Magazine } from './components/Magazine'

export default function App() {
  return (
    <ThemeProvider>
      <Magazine />
    </ThemeProvider>
  )
}
