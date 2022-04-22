export function getAppointmentsForDay(state, day) {

  // Guard clause. check state.days or state.appointments is empty
  if (!state.days || !state.appointments) return [];

  const arrayOfDays = Object.values(state.days);

  // Guard clause. Check if day exists in state.days
  if (!arrayOfDays.some(d => d.name === day)) return [];

  // Get array of appointments that correspond to specified day
  const arrayOfApts = arrayOfDays.filter(d => d.name === day)[0].appointments;

  return Object.values(state.appointments).filter(appointment => arrayOfApts.includes(appointment.id))

};