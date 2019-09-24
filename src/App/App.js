import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'


import './App.css'

import Header from '../Header/Header';
import FlightSearch from '../FlightSearch/FlightSearch';


const App = () =>{
  return(
    <BrowserRouter>
      <Header />
      <Route path="/" component={FlightSearch} />
    </BrowserRouter>
  )
}

export default App;