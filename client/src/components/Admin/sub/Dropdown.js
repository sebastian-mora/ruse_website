import React, {} from 'react';



const Dropdown = (props) => {

  return (
    <div>
      <select name={props.name} onChange={e => props.onChange(e)}>
        <option key={-1} value=""></option>
        {props.options.map(({title, id}) =>{
          return <option  key={id} value={id}>{title}</option>
        })}
      </select>
    </div>
  )
}

export default Dropdown;