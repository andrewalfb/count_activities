import React from 'react';
import { Hobby } from '../models/hobby';

interface Props {
    hobbies: Hobby[]
}

export default function HobbyTable(props: Props) {
    const rows = props.hobbies.map((hobby) => (
    <HobbyRow 
      key={hobby.name} 
      name={hobby.name} 
      description={hobby.description} 
      spentTime={hobby.id}
   />
  ));

  return (
    <table className='tableView'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Spent time today</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

function HobbyRow({ name, description, spentTime }: { name: string; description: string; spentTime: string }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{description}</td>
      <td>{spentTime}</td>
    </tr>
  );
}


