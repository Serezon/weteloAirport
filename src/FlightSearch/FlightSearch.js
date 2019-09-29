import React, { Component } from "react";
import "./FlightSearch.css";
// Варто дотримуватись порядку імпортів в компоненті - спочатку бібліотеки, після - решта
import { Link } from "react-router-dom";
import { parse, stringify } from 'query-string';
import axios from "axios";

import Spinner from '../Spinner/Spinner';

export default class FlightSearch extends Component {
  state = {
    activeDay: 'today',
    activeStatus: 'arrival',
    arrivalAPI: [],
    departureAPI: [],
    renderArrival: [],
    renderDeparture: [],
    searchString: "",
    readyData: false
  };


  changeStatus(activeStatus){
    this.setState({activeStatus});
    this.props.history.push(`?${this.concatURL(this.setActiveDay(this.state.activeDay,'full'),activeStatus)}`);
  }


  concatURL(day = this.setActiveDay('today','full'),status = this.state.activeStatus ,searhString = this.state.searhString){
    const parsed = parse(this.props.location.search);
    parsed.day = day;
    parsed.status = status;
    parsed.searchString = searhString !== "" ? searhString : undefined;
    return stringify(parsed);
  }


  setActiveDay(needDay, view) {
    class getDate{ // Так і проситься щоб його винесли окремо

      constructor(){
        this.timeNow = new Date(Date.now());
        this.timeYesterday = new Date(+this.timeNow - (1000 * 60 * 60 * 24));
        this.timeTommorow = new Date(+this.timeNow + (1000 * 60 * 60 * 24));

        this.dayToday = this.timeNow.getDate();
        this.dayYesterday = this.timeYesterday.getDate();
        this.dayTommorow =  this.timeTommorow.getDate();

        this.monthToday = this.timeNow.getMonth()+1;
        this.monthYesterday = this.timeYesterday.getMonth()+1;
        this.monthTommorow = this.timeTommorow.getMonth()+1;

        this.yearToday = this.timeNow.getFullYear();
        this.yearYesterday = this.timeYesterday.getFullYear();
        this.yearTommorow = this.timeTommorow.getFullYear();
      }


      fullString(day, month, year){
        return `${day < 10 ? "0"+day : day}-${month < 10 ? "0" + month : month}-${year}`;
      }
      shortString(day, month){
        return `${day < 10 ? "0"+day : day}/${month < 10 ? "0" + month : month}`;
      }


      getFullYesterday(){
        return this.fullString(this.dayYesterday, this.monthYesterday, this.yearYesterday);
      }
      getFullToday(){
        return this.fullString(this.dayToday, this.monthToday, this.yearToday);
      }
      getFullTommorow(){
        return this.fullString(this.dayTommorow, this.monthTommorow, this.yearTommorow);
      }


      getShortYesterday(){
        return this.shortString(this.dayYesterday, this.monthYesterday);
      }
      getShortToday(){
        return this.shortString(this.dayToday, this.monthToday);
      }
      getShortTommorow(){
        return this.shortString(this.dayTommorow, this.monthTommorow);
      }

    }


    const dates = new getDate();

    const data = (day, show) => {

      switch(day){
        case 'yesterday' : // Тут і далі і цьому switch case замість else if вистачило би одного if
          if(show === 'short'){
            return dates.getShortYesterday();
          }
          else if(show ==='full'){
            return dates.getFullYesterday();
          }
        break;

        case 'today':
          if(show === 'short'){
            return dates.getShortToday();
          }
          else if(show === 'full'){
            return dates.getFullToday();
          }
        break;

        case 'tommorow':
          if(show === 'short'){
            return dates.getShortTommorow();
          }
          else if(show === 'full'){
            return dates.getFullTommorow();
          }
        break;

        default: ;
      }
    };

    return data(needDay, view);
  }


  componentDidMount() {
    const URL = parse(this.props.location.search);
    axios // Реквести варто виносити в окремий файл
      .get(`https://api.iev.aero/api/flights/${URL.day ? URL.day : this.setActiveDay('today', 'full')}`)
      .then(res => {
        const allApi = res.data.body;
        const departureAPI = allApi.departure;
        const arrivalAPI = allApi.arrival;
        this.setState({
          arrivalAPI,
          departureAPI,
          renderArrival: arrivalAPI,
          renderDeparture: departureAPI,
          searchString: URL.searchString ? URL.searchString : '',
          readyData: true
        });
        // Це порівняння завжди буде false
        this.changeStatus(`${URL === 'arrival' ? 'arrival' : 'departure'}`);
        this.searchFlight();
      });
  }


  changeSearchString(e){
    this.setState({searchString: e.target.value});
  }


  parseTime = (time) =>{
		const parsed = new Date(Date.parse(time));
    const hours = parsed.getHours();
    const minutes = parsed.getMinutes();
    return `${hours< 10 ? "0"+hours : hours }:${minutes<10 ? "0"+minutes : minutes}`;
  }


  renderTable(){ // Ще один явний претендент на окремий компонент
    const active = this.state.activeStatus;


    const whatRender = () =>{
      return active === 'arrival' ? this.state.renderArrival : this.state.renderDeparture;
    };

    return(
      <table>
        <thead>
          <tr>
            <th>Термінал</th>
            <th>Розклад</th>
            <th>Призначення</th>
            <th>Статус</th>
            <th>Авіакомпанія</th>
            <th>Рейс</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {whatRender().map(item => (
          <tr key={item.ID}>
            <td className={`a ${item.term === "A" ? "term-A" : "term-D"}`}>
              <span>{item.term}</span>
            </td>
            <td className="b">{this.parseTime(item[`time${active === 'arrival' ? 'Arr' : 'Dep'}Shedule`])}</td>
            <td className="c">{item[`airport${active === 'arrival' ? 'From' : "To" }ID.name`]}</td>
            <td className="d">{item["fltCatID.name"]}</td>
            <td className="e">{item["planeTypeID.name"]}</td>
            <td className="f">{item["fltTypeID.name"]}</td>
            <td className="g detail">
              <span className="more-info">Більше інформації</span>
              <span className="arrow">&gt;</span>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    );
  }


  changeDay(day){
    this.setState({renderArrival: [], renderDeparture: []});
    axios.get(`https://api.iev.aero/api/flights/${this.setActiveDay(day, 'full')}`)
      .then(res=>{
        const allApi = res.data.body;
        const departureAPI = allApi.departure;
        const arrivalAPI = allApi.arrival;
        this.setState({
          arrivalAPI,
          departureAPI,
          renderArrival: arrivalAPI,
          renderDeparture: departureAPI,
          activeDay: day,
          searchString: ""
        });
      })
  }


  searchFlight(){
    const searchString = this.state.searchString;
    this.props.history.push(`?${this.concatURL(this.setActiveDay(this.state.activeDay,'full'),this.state.activeStatus,searchString)}`);
    // Не знаю чому тут і нище let замість const. Функцію фільтрування варто винести окремо і привести до загального формату.
    let arrivalAfterSearch = this.state.arrivalAPI.filter((item)=>{
      return item["airportFromID.name"].toLowerCase().includes(searchString.toLowerCase()) || item["fltTypeID.name"].toLowerCase().includes(searchString.toLowerCase());
    });
    let departureAfterSearch = this.state.departureAPI.filter((item)=>{
      return item["airportToID.name"].toLowerCase().includes(searchString.toLowerCase()) || item["fltTypeID.name"].toLowerCase().includes(searchString.toLowerCase());
    });
    this.setState({renderArrival: arrivalAfterSearch, renderDeparture: departureAfterSearch});
  }


  render() {
    return (
     this.state.readyData ? <div className="wrap">
        <div className="flightSearch">
          <h2 className="flightsTitle">ПОШУК РЕЙСУ</h2>
          <div className="flightsForm">
            <input
              type="text"
              className="flightsInput"
              placeholder="Номер рейсу або місто"
              value={this.state.searchString}
              onChange={(e)=>this.changeSearchString(e)}
              onKeyUp={event => {
                if (event.key === 'Enter') {
                  this.searchFlight();
              }}}
            />
            <button
              className="flightsSubmit"
              onClick={()=>this.searchFlight()}
            >
              Знайти
            </button>
          </div>
        </div>

        <div className="departuresAndArrivals">
          <div
            className={`arrival ${
              this.state.activeStatus === 'arrival' ? 'active' : ''
            }`}
            onClick={() => this.changeStatus('arrival')}
          >
            <span className={`icon-arrival ${this.state.activeStatus === 'arrival' ? 'act-a' : ''}`}></span>
            <span> ВИЛІТ </span>
          </div>
          <div
            className={`departure ${
              this.state.activeStatus === 'departure' ? 'active' : ''
            }`}
            onClick={() => this.changeStatus('departure')}
          >
            <span> ПРИЛІТ </span>
            <span className={`icon-departure ${this.state.activeStatus === 'departure' ? 'act-d' : ''}`}></span>
          </div>
        </div>

        <div className="calendar-dates">
          <div className="calendar"></div>

          <div className="dates">
            <ul> {/* Цей список можна відрефакторити і зменшити кількість повторюваного коду */}
              <li>
                <Link to={`/?${this.concatURL(this.setActiveDay('yesterday','full'))}`}
                className={`date ${this.state.activeDay === 'yesterday' ? 'active-day' : ''}`}
                onClick={()=>this.changeDay('yesterday')}
                >
                  ВЧОРА<span>{this.setActiveDay('yesterday', 'short')}</span>
                </Link>
              </li>
              <li>
                <Link to={`/?${this.concatURL(this.setActiveDay('today','full'))}`}
                className={`date ${this.state.activeDay === 'today' ? 'active-day' : ''}`}
                onClick={()=>this.changeDay('today')}
                >
                  СЬОГОДНІ<span>{this.setActiveDay('today', 'short')}</span>
                </Link>
              </li>
              <li>
                <Link to={`/?${this.concatURL(this.setActiveDay('tommorow','full'))}`}
                className={`date ${this.state.activeDay === 'tommorow' ? 'active-day' : ''}`}
                onClick={()=>this.changeDay('tommorow')}
                >
                  ЗАВТРА<span>{this.setActiveDay('tommorow', 'short')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* {<table>} */}
          {this.renderTable()}
        {/* {</table>} */}
        {(this.state.renderArrival.length > 0)|| (this.state.renderArrival.length > 0) ? null : <div className="no-info"><strong>Немає рейсів</strong></div>}
      </div> : <Spinner></Spinner>
    );
  }
}
