import React from "react";

import "components/DayListItem.scss"
import classNames from "classnames";

function formatSpots(spots) {
  if (spots === 0) {
    return  <h3 className="text--light">no spots remaining</h3>
  } else if (spots === 1) {
    return  <h3 className="text--light">{spots} spot remaining</h3>
  }
  return  <h3 className="text--light">{spots} spots remaining</h3>
}

export default function DayListItem(props) {
  const {name, spots, setDay, selected} = props;

  const dayClass = classNames('day-list__item', {
    "day-list__item--selected": selected,
    "day-list__item--full": spots === 0
  })

  return (
    <li
      onClick={() => {setDay(name)}}
      className={dayClass}
      data-testid="day">
      <h2 className="text--regular">{name}</h2>

      {formatSpots(spots)}

    </li>
  );
}