import React from 'react';
import { Hobby } from '../models/hobby';

interface Props {
    hobbies: Hobby[]
}

export default function HobbyTable(props: Props) {
    const rows = props.hobbies.map((hobby) => (
    <HobbyRow key={hobby.name} name={hobby.name} description={hobby.description} />
  ));

  return (
    <table className='tableView'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

function HobbyRow({ name, description }: { name: string; description: string }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{description}</td>
    </tr>
  );
}


