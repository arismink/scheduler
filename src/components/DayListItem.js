import React from "react";

import "components/DayListItem.scss"
import classNames from "classnames";

function formatSpots(spots) {
  if (spots === 0) {
    return 'no spots remaining';
  } else if (spots === 1) {
    return '{spots} spot remaining';
  }
  return '{spots} spots remaining';
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
      className={dayClass}>
      <h2 className="text--regular">{name}</h2>

      <h3 className="text--light">{formatSpots(spots)}</h3>

    </li>
  );
}

