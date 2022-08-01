// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import {useEffect, useState} from "react";

function PokemonInfo({pokemonName}) {

  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemonName?.trim()?.length) {
      return;
    }
    setPokemon(null);
    setStatus('pending');
    setError(null);
    fetchPokemon(pokemonName.trim())
      .then(pokemonData => {
          setPokemon(pokemonData);
          setStatus('resolved');
        },
        error => {
          setError(error);
          setStatus('rejected');
        });
  }, [pokemonName]);

  if (status === 'idle') {
    return <p>Submit a pokemon</p>;
  }
  if (status === 'rejected') {
    return <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>;
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
        <PokemonInfo pokemonName={pokemonName}/>
      </div>
    </div>
  )
}

export default App
