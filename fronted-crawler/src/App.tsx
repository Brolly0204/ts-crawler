import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import LoginPage from './Pages/Login'
import HomePage from './Pages/Home'
import './App.css'

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" component={LoginPage} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
