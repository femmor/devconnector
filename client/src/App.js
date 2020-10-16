import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Alert from "./components/layout/Alert"
import setAuthToken from "./utils/setAuthToken"
import { loadUser } from "./actions/auth"

// Redux Setup
import { Provider } from "react-redux"
import store from "./store"

import './App.css';

// Check if there's a token and put it in the global header
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  // useEffect for loadUser action
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return(
      <Provider store={store}>
        <Router>
          <Navbar/>
          <Route exact path="/" component={Landing}/>
          <section className="container">
            <Alert/>
            <Switch>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
            </Switch>
          </section>
      </Router> 
      </Provider>
  )
}
export default App;
