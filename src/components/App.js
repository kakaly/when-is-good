import React, { Component } from 'react'
import { throttle } from 'throttle-debounce'
import { Route } from 'react-router-dom'
import TopBar from './topBar/TopBar'
import Calendar from './calendar/Calendar'
import Creds from './Creds'
import '../SASS/main.scss'
import CalendarIcon from './calendar/CalendarIcon'
import WeekDays from './calendar/weekSelect/weekDays/WeekDays'
import CreateEvent from './OtherRoutes/CreateEvent'
import WeekSelect from './calendar/weekSelect/WeekSelect'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      window: 30,
      dates: [
        'April 4, 18',
        'April 5, 18',
        'April 6, 18',
        'April 7, 18',
        'April 8, 18',
        'April 9, 18',
        'April 10, 18'
      ],
      times: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      table: [],
      selected: [],
      viewportWidth: 800,
      dow: 0
      // 👆provides day of week for the single column mobile view
    }
    this.onClick = this.onClick.bind(this)
    this.onSelectWindow = this.onSelectWindow.bind(this)
  }

  fillCurrentTimes() {
    let table = []
    let timewindows = []
    let dates = [...this.state.dates]
    let times = [...this.state.times]
    times.forEach(time => {
      timewindows.push(`${time}:00`)
      timewindows.push(`${time}:15`)
      timewindows.push(`${time}:30`)
      timewindows.push(`${time}:45`)
    })
    timewindows.forEach(time => {
      var row = []
      dates.forEach(date => {
        row.push([`${date} ${time}`, false])
      })
      table.push(row)
    })
    this.setState({
      table: table
    })
  }

  onSelectWindow(value) {
    this.setState({
      ...this.state,
      window: value
    })
  }

  onClick(e, x, y) {
    e.preventDefault()
    var table = this.state.table
    var newTable = []
    if (this.state.window === 1) {
      table.forEach((row, xx) => {
        var newRow = []
        row.forEach((datetime, yy) => {
          if (yy === y) newRow.push([datetime[0], true])
          else newRow.push([datetime[0], datetime[1]])
        })
        newTable.push(newRow)
      })
    } else {
      newTable = table
      var newvar = table[x][y]
      newvar[1] = !newvar[1]
      newTable[x][y] = newvar
    }
    this.setState({
      table: newTable
    })
  }

  initWindow() {
    // updates the viewport width
    this.setState({ viewportWidth: window.innerWidth })
  }

  componentWillMount() {
    this.fillCurrentTimes()
  }

  componentDidMount() {
    this.updateViewportWidth()
    window.addEventListener('resize', this.updateViewportWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewportWidth)
  }

  updateViewportWidth = () => {
    throttle(this.initWindow(), 500)
  }

  dayNextHandler = () => {
    let { dow } = this.state
    if (dow >= 0 && dow < 6) {
      this.setState({ dow: dow + 1 })
    } else if (dow === 6) {
      this.setState({ dow: 0 })
    }
  }

  dayPrevHandler = () => {
    let { dow } = this.state
    if (dow > 0 && dow <= 6) {
      this.setState({ dow: dow - 1 })
    } else if (dow === 0) {
      this.setState({ dow: 6 })
    }
  }

  render() {
    // console.log(this.state.viewportWidth)
    return (
      <div>
        <Route path="/create" exact render={() => <CreateEvent />} />
        <Route
          path="/"
          exact
          render={() => (
            <div ref={this.viewportWidthRef} className="App">
              <div className="bar">
                <div className="brand">
                  <CalendarIcon />
                  <div className="brand-title">
                    <h1 className="brand-title-text">I'm Free FYI</h1>
                  </div>
                </div>
              </div>
              <TopBar onSelectWindow={this.onSelectWindow} />
              <WeekSelect
                dayNext={this.dayNextHandler}
                dayPrev={this.dayPrevHandler}
                vw={this.state.viewportWidth}
              />
              <WeekDays
                vw={this.state.viewportWidth}
                dow={this.state.dow}
                className="stickyScroll"
              />
              <Calendar
                window={this.state.window}
                table={this.state.table}
                onClick={this.onClick}
                vw={this.state.viewportWidth}
              />
              <Creds />
            </div>
          )}
        />
      </div>
    )
  }
}

export default App
