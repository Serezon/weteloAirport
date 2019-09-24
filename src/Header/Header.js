import React from 'react';
import './Header.css';

import logo from '../assets/logo.png';

const Header = () =>{
  return(
    <header>
      <div className="logo">
        <img src={logo} alt="Logo"/>
      </div>
      <nav>
        <ul>
          <li><span>Пасажирам</span></li>
          <li><span>Послуги IEV</span></li>
          <li><span>VIP</span></li>
          <li><span>Партнерам</span></li>
          <li><span>UA</span></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;