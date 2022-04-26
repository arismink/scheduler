import React, {useState, useEffect} from "react";
import axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointment: {},
    interviewers: {}
  });


  const setDay = day => setState({...state, day});

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

  // Get array of appointments that day
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // Get array of interviewers that day
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  // Get Appointment component for that day
  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    )
  });

  // CSS hides the last appointment. Add a LAST appointment so CSS hides that
  schedule.push(<Appointment key="last" time="5pm" />);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        <ul>
          {schedule}
        </ul>
      </section>

    </main>
  );
}
