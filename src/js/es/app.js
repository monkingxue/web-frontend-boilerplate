import React, {Component} from "react";
import {observer, inject, PropTypes} from "mobx-react";

@inject("Store") @observer
class App extends Component {
  constructor(props) {
    super(props);

    console.log(this.props);
  }

  render() {
    return (
      <div>
        abcedf
      </div>
    )
  }
}

App.propTypes = {
  store: PropTypes.observableObject
};

export default App;