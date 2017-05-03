import './index.scss';
import React from 'react';

/** 
 * 默认首页，测试页
 * @author zhongzhuhua
 */
class Home extends React.Component {
  constructor(props) {
    super(props);
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
      </div>
    );
  };
};

export default Home;
