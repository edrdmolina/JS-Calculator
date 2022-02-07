const startZeroRegex = /^0/;
const operatorRegex = /[\+\*\/\-]/;
const numberRegex = /[0-9]/;
const endsWithNumberRegex = /[0-9]$/;

class Calculator extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      input: '0',
      output: '',
      previousVal: '',
      previousInput: ''
    };
    this.clearAll = this.clearAll.bind(this);
    this.appendInput = this.appendInput.bind(this);
    this.performOperation = this.performOperation.bind(this);
    this.performEquation = this.performEquation.bind(this);
  }
  
  clearAll() {
    this.setState({
      input: '0',
      output: '',
      previousVal: '',
      previousInput: ''
    })
    console.clear()
  }
  
  appendInput(number) {
    const { input, previousInput } = this.state;
    if(previousInput === '=') {
      this.setState({
        input: '0'
      })
    }
    // verify decimals don't repeat
    if(input.includes('.') && number === '.') return;
    // remove zero's from beggining if input string
    
    this.setState(cs => ({
      input: `${cs.input}${number}`.replace(startZeroRegex, ''),
      previousInput: number
    }))
  }
  
  performOperation(operator) {
    const { input, previousInput, output } = this.state;
    // if previousInput is NOT (*, /, +, -) OR
    // previousInput is (*, /, +, -) and new input is a (-) 
      // Continue
    
    // else if previousInput is (*, /, +, -) 
      // find and remove all operators at the end of output
    if (previousInput === '=') {
      this.setState(cs => ({
        output: cs.previousVal + operator,
        input: '0',
        previousInput: operator,
      }))
    } else if (
      !operatorRegex.test(previousInput) || 
      (operatorRegex.test(previousInput) && operator === '-')
    ) {
      this.setState(cs => ({
        output: cs.output + cs.input.replace(startZeroRegex,'') + operator,
        previousInput: operator,
        input: '0',
      }))
    } else if (operatorRegex.test(previousInput)) {
      let outputCopy = output;
      while(!endsWithNumberRegex.test(outputCopy)) {
        outputCopy = outputCopy.slice(0, outputCopy.length - 1);
      }
      this.setState(cs => ({
        previousInput: operator,
        input: '0',
        output: outputCopy + cs.input.replace(startZeroRegex,'') + operator,
      }))
    }
    
  }
  
  performEquation() {
    const { input, output, previousInput } = this.state;
    if(previousInput === '=') return;
    const result = Math.round((eval(output + input) + Number.EPSILON) * 10000) / 10000;
    this.setState(cs => ({
      input: String(result),
      output: `${cs.output}${cs.input}=${String(result)}`,
      previousInput: `=`,
      previousVal: String(result),
    }))
  }
  
  render() {
    const { clearAll, appendInput, performOperation, performEquation } = this;
    return (
      <div className='calculator'>
        < Display {...this.state}/>
        < Buttons 
          clearAll={clearAll} 
          appendInput={appendInput}
          performOperation={performOperation}
          performEquation={performEquation}
        />
      </div>
    )
  }
}

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.handleAppend = this.handleAppend.bind(this);
    this.handleOperation = this.handleOperation.bind(this);
  }
  
  handleAppend(e) {
    const input = e.target.innerText;
    const appendInput = this.props.appendInput;
    appendInput(input)
  }
  
  handleOperation(e) {
    const { performOperation } = this.props;
    const operator = e.target.value;
    performOperation(operator);
  }
  
  render() {
    const { clearAll, performEquation } = this.props;
    const { handleAppend, handleOperation } = this;
    return (
      <div className='Buttons'>
        <button 
          id='clear' 
          onClick={clearAll}
        >
          AC
        </button>
        <button 
          id='divide'
          onClick={handleOperation}
          className='operator'
          value='/'
        >
          {'\u00F7'}
        </button>
        <button 
          id='multiply'
          onClick={handleOperation}
          className='operator'
          value='*'
        >
          {'\u00D7'}
        </button>
        <button 
          id='seven' 
          onClick={handleAppend}
        >
          7
        </button>
        <button 
          id='eight' 
          onClick={handleAppend}
        >
          8
        </button>
        <button 
          id='nine' 
          onClick={handleAppend}
        >
          9
        </button>
        <button 
          id='subtract'
          onClick={handleOperation}
          className='operator'
          value='-'
        >
          -
        </button>
        <button 
          id='four' 
          onClick={handleAppend}
        >
          4
        </button>
        <button 
          id='five' 
          onClick={handleAppend}
        >
          5
        </button>
        <button 
          id='six' 
          onClick={handleAppend}
        >
          6
        </button>
        <button 
          id='add'
          onClick={handleOperation}
          className='operator'
          value='+'
        >
          +
        </button>
        <button 
          id='one' 
          onClick={handleAppend}
        >
          1
        </button>
        <button 
          id='two' 
          onClick={handleAppend}
        >
          2
        </button>
        <button 
          id='three' 
          onClick={handleAppend}
        >
          3
        </button>
        <button 
          id='zero' 
          onClick={handleAppend}
        >
          0
        </button>
        <button 
          id='decimal'
          onClick={handleAppend}
        >
          .
        </button>
        <button 
          id='equals'
          onClick={performEquation}
        >
          =
        </button>
      </div>
    )
  }
}

class Display extends React.Component {
  render() {
    const { output, input } = this.props;
    return (
      <div className='screen'>
        < Output output={output} />
        < Input input={input} />
      </div>
    )
  }
}

class Output extends React.Component {
  render() {
    const { output } = this.props;
    return <div id='output'>{output}</div>
  }
}

class Input extends React.Component {
  render() {
    const { input } = this.props;
    return <div id='display'>{input}</div>
  }
}
  
ReactDOM.render(<Calculator/>, document.getElementById('root'));