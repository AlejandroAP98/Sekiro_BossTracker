import { render } from 'preact'
import './index.css'
import App from './App'

document.documentElement.setAttribute('data-theme', 'caramellatte')
render(<App />, document.getElementById('app')!)
