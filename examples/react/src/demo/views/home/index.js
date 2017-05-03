import './index.scss';
import React from 'react';
import reqwest from 'reqwest';

/** 
 * 默认首页，测试页
 * @author zhongzhuhua
 */
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log('Home');
    console.log(this.props);
  };

  state = {
    number: 0
  };

  add() {
    this.setState({
      number: this.state.number + 1
    });
  };

  render() {
    return (
      <div className="v-home" style={{fontSize: '.5rem'}}>
        This is index page!
        <div className="number" onClick={()=>this.add()}>{this.state.number}</div>
        <a href="#/temp">测试数据</a>
      </div>
    );
  };
};
