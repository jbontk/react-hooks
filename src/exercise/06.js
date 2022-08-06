// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import {useEffect, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";

const ErrorFallback = ({error, resetErrorBoundary}) => <div role="alert">
  There was an error: <pre style={{whiteSpace: 'normal'}}>{error?.message || 'Unknown error'}</pre>
  <button onClick={resetErrorBoundary}>Try again</button>
</div>;

function PokemonInfo({pokemonName}) {
  const [pokemonState, setPokemonState] = useState({pokemon: null, status: pokemonName ? 'pending' : 'idle', error: null});

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
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setPokemonName('')} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName}/>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
