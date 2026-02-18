import '../tachyons-clean.css'
import { Component } from 'react'
import './App.css'

import CardList from '../components/CardList.jsx'
import SearchBox from '../components/SearchBox.jsx'
import Scroll from '../components/Scroll.jsx'


class App extends Component {
  constructor() {
    super()
    this.state = {
      robots: [],
      searchField: '',
    }
  }

  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((users) => this.setState({ robots: users }))
  }

  onSearchChange = (event) => {
    this.setState({ searchField: event.target.value })
  }

  render() {
    const { robots, searchField } = this.state
    const filteredRobots = robots.filter((robot) =>
      robot.name.toLowerCase().includes(searchField.toLowerCase()),
    )

    return (!this.state.robots.length) ?
      <h1 className='tc f1 sega-text'>Loading...</h1> :
      <main className='tc pa3'>
        <h1 className='sega-text'>RoboFriends</h1>
        <SearchBox searchChange={this.onSearchChange} />
        <Scroll>
          <CardList robots={filteredRobots} />
        </Scroll>
      </main>
  }
}

export default App