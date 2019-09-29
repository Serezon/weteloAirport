import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom'


import './App.css'

import Header from '../Header/Header';
import FlightSearch from '../FlightSearch/FlightSearch';


const App = () => {
  return (
    <BrowserRouter> {/* Чому хедер всередині роутера? Всередині роутера мають бути тільки роути */}
      <Header/>
      <Route path="/" component={FlightSearch}/>
    </BrowserRouter>
  )
}

export default App;
