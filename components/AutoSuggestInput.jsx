import {useMemo, useState} from 'react';
import Autosuggest from 'react-autosuggest';
import SuggestionItem from './SuggestionItem';
import Fuse from 'fuse.js';
import theme from '../styles/components/AutoSuggestInput.module.css'


function AutoSuggestInput({onItemSelect, suggestionData, placeholder=""}) {
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const fuse = useMemo(
    // TODO: Move keys to props.
    () => new Fuse(suggestionData, {keys: ["name", "implicits.fullDescr", "propertiesText"]})
    , [suggestionData]
  )

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = value => {
    const result = fuse.search(value.trim())
    return result.splice(0,10)
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => suggestion.item.name;

  function onChange(e, { newValue }) {
    setValue(newValue)
  }

  function onSuggestionsFetchRequested({ value }) {
    setSuggestions(getSuggestions(value))
  }

  function onSuggestionsClearRequested() {
    setSuggestions([])
  }

  function onKeyDown(e) {
    // Handle enter key down in input, without the user having
    // explicitly selected the item manually (i.e. they typed the
    // whole value)
    if (e.keyCode === 13) {
      const [suggestion] = suggestions.filter(
        x => getSuggestionValue(x).toLowerCase() === value.toLowerCase()
      )
      if (suggestion) {
        onSuggestionSelected(e, { suggestion })
      }
    }
  }

  function onSuggestionSelected(
    e, { 
      suggestion, 
      suggestionValue, 
      suggestionIndex, 
      sectionIndex, 
      method 
    }
  ) {
    // Enter is handled in onKeyDown.
    if (method !== "enter") {
      onItemSelect(suggestion)
    }
  }

  const inputProps = {
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    onKeyDown: onKeyDown,
  }

  return (
    <Autosuggest 
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={SuggestionItem}
      inputProps={inputProps}
      theme={theme}
      onSuggestionSelected={onSuggestionSelected}
    />
  )
}

export default AutoSuggestInput
