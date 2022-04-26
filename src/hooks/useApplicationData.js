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

  
  function updateSpots(dayIndex) {

    // Get array of appointmentIDs for specified day
    const dayApptSchedule = state.days[dayIndex].appointments;

    // Get array of appointment objects that correspond to the elements in dayApptSchedule
    const apptArray = Object.values(state.appointments).filter(a => dayApptSchedule.includes(a.id));

    let count = 0;

    for (let a of apptArray) {
      if (!a.interview) {
        count++
      }
    }

    // Account for the spot that was just updated
    return count - 1;

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

    // Find the index of the specific day
    const dayIndex = state.days.find(day => day.appointments.includes(id)).id - 1;

    const day = {
      ...state.days[dayIndex],
      spots: updateSpots(dayIndex)
    }

    // DayID is dayIndex + 1
    const days = (state.days).map(d => {
      if (d.id === (dayIndex + 1) ) return day;
      return d
    })


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

     // Find the index of the specific day
     const dayIndex = state.days.find(day => day.appointments.includes(id)).id - 1;

     const day = {
       ...state.days[dayIndex],
       spots: updateSpots(dayIndex)
     }
 
     // DayID is dayIndex + 1
     const days = (state.days).map(d => {
       if (d.id === (dayIndex + 1) ) return day;
       return d
     })

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