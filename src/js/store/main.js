import {observable, action} from "mobx";

class Store {
  @observable count;

  constructor() {
    this.count = 1;
  }

  @action addCount() {
    this.count += 1;
    console.log(this.count);
  }

  decreaseCount() {
    this.count -= 1;
  }
}

export default Store;