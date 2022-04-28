import {useState} from 'react';

export default function useVisualMode(init) {
  const [mode, setMode] = useState(init);

  const [history, setHistory] = useState([init]);

  // Transition mode to the next mode
  function transition(newMode, replaced = false) {

    // If replace is true, we are replacing current mode in history
    if (replaced) setHistory([...history]);
  
    // Set new history with what was previously in the history array, plus the newMode and make React re-render
    else setHistory(prev => ([...prev, newMode]));

    setMode(newMode);
  }
  
  // Transition to previous mode
  function back() {
    
    // Remove last item from history array and ensure that length is always greater than 1
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      history.pop();

      // Ensure that new history is recognized by React so it re-renders
      setHistory([...history]);

      // Back limit
    } else {
      setMode(init);
    }
  }
  
  return { mode, transition, back };
};