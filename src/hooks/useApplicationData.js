import {useState, useEffect} from 'react';

import axios from 'axios';


const updateSpots = (state) => {

  // Find the index of the specific day
  const dayIndex = state.days.findIndex(d => d.name === state.day)

  // Get array of appointmentIDs for specified day
  const dayApptSchedule = state.days[dayIndex].appointments;

  // Get array of appointment objects that correspond to the elements in dayApptSchedule
  const apptArray = Object.values(state.appointments).filter(a => dayApptSchedule.includes(a.id));

  const remainingSpots = apptArray.filter(a => !a.interview).length;

  const day = {
    ...state.days[dayIndex],
    spots: remainingSpots
  };

  const days = [...state.days].splice(dayIndex, 1).push(day);

  return days;

}


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

    // Retrieve new array with the updated spots
    const days = updateSpots(state)

    return axios.put(`/api/appointments/${id}`, appointment)
      .then((res) => {
        // Call setState and update it with the newly booked appointment

        console.log('days', days);
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


    // Retrieve new array with the updated spots
    const days = updateSpots(state);

    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(res => {
        setState(prev => ({
          ...prev,
          appointments,
          days
        }));
      })

  };

  return {state, setDay, bookInterview, cancelInterview}
}