import React, {Component} from 'react';
import RichTextEditor from 'react-rte';
import style from './BlogEditor.module.css'

export default class BlogEditor extends Component {

  state = {
    editorValue: RichTextEditor.createEmptyValue(),
    post: "",
    date: "",
    title: ""
  }

   
  saveBlogUpdate = this.saveBlogUpdate.bind(this);



  editorOnChange = (editorValue) => {
    this.setState({editorValue});
  };


  changeTitle = (e) =>{
    this.setState({title:e.target.value})
  }

  changeDate = (e) =>{
    this.setState({date:e.target.value})
  }


  componentWillReceiveProps(nextProps) {
    const {blog} = nextProps

    let editorValue = this.state.editorValue

    if(editorValue.toString('html') !== blog.post){
      editorValue = RichTextEditor.createValueFromString(blog.post, 'html')
      this.setState(
        { editorValue,
          title: blog.title,
          date: blog.date,
          post: blog.post
        }
       )
      
    }

    return null;

  }

  saveBlogUpdate(){
    let {title, date, post} = this.state
      this.props.editorSave({
        title, date, post
      });
  }

  render () {

    console.log(this.state);
    
    return (
      <div>
        <input type="text" name="name" onChange={this.changeTitle} value={this.state.title}></input>
        <input type="date" name="blog.date" onChange={this.changeDate} value={this.state.date}></input>
        <RichTextEditor
          className={style.Editor}
          value={this.state.editorValue}
          onChange={this.editorOnChange}
        />

        <button onClick={this.saveBlogUpdate}>Save</button>
        
      </div>

      
    );
  }
}

