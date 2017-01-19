import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "mobx-react";

import Store from "../store/main";
import App from "./app";

ReactDOM.render((
    <Provider Store={Store}>
      <div>
        <App/>
      </div>
    </Provider>),
  document.getElementById("content"));
