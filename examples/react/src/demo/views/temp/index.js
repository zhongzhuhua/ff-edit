import './index.scss';
import React from 'react';
import reqwest from 'reqwest';

/** 
 * temp
 * @author zhongzhuhua
 */
export default class Temp extends React.Component {
  constructor(props) {
    super(props);
    console.log('Temp');
    console.log(this.props);
  };

  state = {
    msg: 'loading'
  };

  componentWillMount() {
    reqwest({
      url: './mock/index.json',
      dataType: 'json',
    }).then((res) => {
      this.setState({
        msg: res.msg
      });
    });
  };

  render() {
    return (
      <div className="v-temp">
        result: <span>{this.state.msg}</span>
      </div>
    );
  };
};
