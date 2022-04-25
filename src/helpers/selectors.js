function getInterviewersForDay(state, day) {
  // Guard clause. Check if objects passed are valid
  if (!state.interviewers) return []; 

  // Create array of day objects
  const arrayOfDays = Object.values(state.days);

  // Guard clause. Check if day exists in state.days
  if (!arrayOfDays.some(d => d.name === day)) return [];

  // Create array of interviewers for specified day
  const arrayOfInterviewers = arrayOfDays.filter(d => d.name === day)[0].interviewers;

  return Object.values(state.interviewers).filter(interviewer => arrayOfInterviewers.includes(interviewer.id));

};

// Return an object containing interview data
function getInterview(state, interview) {
  
  // Guard clause. Check if objects passed are valid
  if (!state.interviewers || !interview) return null; 

  const interviewersArray = Object.values(state.interviewers);

  // Checks if the interviewer scheduled exists in state.interviewers
  if (!interviewersArray.some(i => i.id === interview.interviewer)) return null;

  // Object of scheduled interviewer
  const interviewer = interviewersArray.filter(interviewer => interviewer.id === interview.interviewer)[0];

  const student = interview.student;

  return { student, interviewer };


};

// Return an array of appointments for specified day
function getAppointmentsForDay(state, day) {

  // Guard clause. check state.days or state.appointments is empty
  if (!state.days || !state.appointments) return [];

  // Create array of day objects
  const arrayOfDays = Object.values(state.days);

  // Guard clause. Check if day exists in state.days
  if (!arrayOfDays.some(d => d.name === day)) return [];

  // Get array of appointments that correspond to specified day
  const arrayOfApts = arrayOfDays.filter(d => d.name === day)[0].appointments;

  return Object.values(state.appointments).filter(appointment => arrayOfApts.includes(appointment.id))

};

module.exports = { getAppointmentsForDay, getInterview, getInterviewersForDay }