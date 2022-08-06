// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import {useEffect, useState} from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true, error, errorInfo: null};
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // could log to a remote service
    console.warn('Caught error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{this.state.error?.message || 'Unknown error'}</pre>
      </div>;
    }
    return this.props.children;
  }
}

function PokemonInfo({pokemonName}) {
  const [pokemonState, setPokemonState] = useState({pokemon: null, status: 'idle', error: null});

  useEffect(() => {
    if (!pokemonName?.trim()?.length) {
      return;
    }
    setPokemonState({pokemon: null, status: 'pending', error: null});
    fetchPokemon(pokemonName.trim())
      .then(pokemonData => setPokemonState(prev => ({...prev, pokemon: pokemonData, status: 'resolved'})),
        error => setPokemonState(prev => ({...prev, error, status: 'rejected'})));
  }, [pokemonName]);

  const {status, error, pokemon} = pokemonState;
  if (status === 'idle') {
    return <p>Submit a pokemon</p>;
  }
  if (status === 'rejected') {
    // This will be handled by the ErrorBoundary
    throw error;
  }
  if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon}/>;
  }
  return <PokemonInfoFallback name={pokemonName}/>;
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
      <hr/>
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName}/>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
