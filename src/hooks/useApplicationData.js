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

  
  const updateSpots = (state, appointments) => {

    // Find day obj
    const dayObj = state.days.find(d => d.name === state.day);

    // Get array of appointmentIDs for specified day
    const dayApptSchedule = dayObj.appointments;

    // Get array of appointment objects that correspond to the elements in dayApptSchedule
    const apptArray = Object.values(appointments).filter(a => dayApptSchedule.includes(a.id));

    const remainingSpots = apptArray.filter(a => !a.interview).length;

    // Create new day object
    const day = {...dayObj, spots: remainingSpots}

    // Create new array that includes the new day
    const days = state.days.map(d => d.name === state.day ? day : d);

    return days
  
  }
    


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


    return axios.put(`/api/appointments/${id}`, {interview})
      .then((res) => {
        // Call setState and update it with the newly booked appointment

        // Retrieve new array with the updated spots
        const days = updateSpots(state, appointments);

        setState(prev => ({
          ...prev,
          appointments,
          days
        }));

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
        // Retrieve new array with the updated spots
        const days = updateSpots(state, appointments);

        setState(prev => ({
          ...prev,
          appointments,
          days
        }));
      })

  };

  return {state, setDay, bookInterview, cancelInterview}
}