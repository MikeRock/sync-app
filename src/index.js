import {Component} from 'react'
import ReactDOM from 'react-dom'
import RedBox from './components/Box'
import style from './style_global.css'
let socket 

class Box extends Component {
    constructor(props) {
        super(props)
        this.state = {input:""}
    }
    handleChange(e) {
        e.preventDefault()
        socket.emit('state',{input:e.target.value})

    }
    componentDidMount() {
        socket = io()
        socket.on('state',(msg) => {
            this.setState({input:msg.input})
        })
    }
    render() {
        return (
        <div>
            <div>Value: {this.state.input}</div>
            <input type="text" value={this.state.input} onChange={this.handleChange.bind(this)} />
            <RedBox />
        </div>
        )
    }
}

ReactDOM.render(<Box />,document.getElementById('app'))

