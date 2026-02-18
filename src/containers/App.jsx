import '../tachyons-clean.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

import CardList from '../components/CardList.jsx'
import SearchBox from '../components/SearchBox.jsx'
import Scroll from '../components/Scroll.jsx'
import { robots as fallbackRobots } from '../robots.js'

function App() {
  const [robots, setRobots] = useState([])
  const [searchField, setSearchField] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const requestRobots = useCallback(() => {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }
        return response.json()
      })
  }, [])

  const retryFetchRobots = useCallback(() => {
    setIsLoading(true)
    setError(null)

    requestRobots()
      .then((users) => setRobots(users))
      .catch((error) => {
        setRobots(fallbackRobots)
        setError(error?.message ?? 'Network error')
      })
      .finally(() => setIsLoading(false))
  }, [requestRobots])

  useEffect(() => {
    let cancelled = false

    requestRobots()
      .then((users) => {
        if (cancelled) return
        setRobots(users)
      })
      .catch((error) => {
        if (cancelled) return
        setRobots(fallbackRobots)
        setError(error?.message ?? 'Network error')
      })
      .finally(() => {
        if (cancelled) return
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [requestRobots])

  const onSearchChange = (event) => {
    setSearchField(event.target.value)
  }

  const filteredRobots = useMemo(() => {
    return robots.filter((robot) =>
      robot.name.toLowerCase().includes(searchField.toLowerCase()),
    )
  }, [robots, searchField])

  if (isLoading) {
    return <h1 className='tc f1 sega-text'>Loading...</h1>
  }

  return (
    <main className='tc pa3'>
      <h1 className='sega-text'>RoboFriends</h1>
      {error ? (
        <div className='mb3'>
          <p className='dark-red'>Network issue: {error} (showing fallback data)</p>
          <button className='pa2 ba b--green bg-lightest-blue pointer' onClick={retryFetchRobots}>
            Retry
          </button>
        </div>
      ) : null}
      <SearchBox searchChange={onSearchChange} />
      <Scroll>
        {filteredRobots.length ? (
          <CardList robots={filteredRobots} />
        ) : (
          <h2 className='tc white'>No robots found.</h2>
        )}
      </Scroll>
    </main>
  )
}

export default App