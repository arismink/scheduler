import {useState, useEffect} from 'react';

import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointment: {},
    interviewers: {}
  });

  const setDay = day => setState({...state, day});

  // Retrieve data from API
  useEffect(() => {

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      })
      )
    })
    }, []);

  
  // Allow change to local state when an interview is booked
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then((res) => {
        // Call setState and update it with the newly booked appointment
        setState({
          ...state,
          appointments
        });
      })
  };

  // Set specified interview of appointment id to null
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(res => {
        setState({
          ...state,
          appointments
        })
      })

  };

  return {state, setDay, bookInterview, cancelInterview}
}