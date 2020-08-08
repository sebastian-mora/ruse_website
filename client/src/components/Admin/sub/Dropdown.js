import React from 'react';



const Dropdown = (props) => {

  return (
    <div>
      <select name={props.name} value={props.defaultValue} className="dropdown" onChange={e => props.onChange(e)}>
          
          <option key={-1} value=""></option>
          {props.options.map(({title, id}) =>{
            return <option className="dropdown-content" key={id} value={id}>{title}</option>
          })}

      </select>
    </div>
  )
}

export default Dropdown;