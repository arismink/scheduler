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

  
  // function updateSpots(appointmentID, dayID) {

  //   // Get array of appointmentIDs for specified day
  //   const dayApptSchedule = state.days[dayID].appointments;

  //   // Get array of appointment objects that correspond to the elements in dayApptSchedule
  //   const apptArray = Object.values(state.appointments).filter(a => dayApptSchedule.includes(appointmentID));

  //   let count = 0;

  //   for (let a of apptArray) {
  //     if (a.interview === null) {
  //       count++
  //     }
  //   }
  //   return count;
  // }


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

    // const dayID = state.days.find(day => day.appointments.includes(id));

    // const day = {
    //   ...state.days[dayID],
    //   spots: updateSpots(id, dayID)
    // }

    // const days = {
    //   ...state.days,
    //   [dayID]: day
    // }

    // console.log('dayID', dayID);

    console.log('book state', state);

    return axios.put(`/api/appointments/${id}`, appointment)
      .then((res) => {
        // Call setState and update it with the newly booked appointment
        setState({
          ...state,
          appointments
          // ,days
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