import React, {} from 'react';



const Dropdown = (props) => {

  return (
    <div>
      <select onChange={e => props.onChange(e.target.value)} id="blogs">
        {props.options.map(({title, id}) =>{
          return <option key={id} value={id}>{title}</option>
        })}
      </select>
    </div>
  )
}

export default Dropdown;