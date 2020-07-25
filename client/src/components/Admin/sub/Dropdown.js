import React, {} from 'react';



const Dropdown = (props) => {

  return (
    <div>
      <select name={props.name} onChange={e => props.onChange(e)}>
        {props.options.map(({title, id}) =>{
          return <option  key={id} value={id}>{title}</option>
        })}
      </select>
    </div>
  )
}

export default Dropdown;