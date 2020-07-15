const oldLog = console.log;
console.log = (entity) => {
  if (entity instanceof StringBuilder) {
    return oldLog(entity.toString());
  } else {
    return oldLog(entity);
  }
};

class StringBuilder {
  constructor(baseString) {
    this.baseString = baseString || "";
    this.append = this.wrapReturn(this.append);
    this.prepend = this.wrapReturn(this.prepend);
    this.pad = this.wrapReturn(this.pad);
  }

  toString() {
    return this.baseString;
  }

  valueOf() {
    return this.baseString;
  }

  wrapReturn = (func) => {
    return (str) => {
      func(str);
      return this;
    };
  };

  append = (str) => {
    this.baseString = `${this.baseString}${str}`;
  };

  prepend = (str) => {
    this.baseString = `${str}${this.baseString}`;
  };

  pad = (str) => {
    this.baseString = `${str}${this.baseString}${str}`;
  };
}

const builder = new StringBuilder(".");
builder.append("^").prepend("^").pad("=");
console.log(builder); // '=^.^='
