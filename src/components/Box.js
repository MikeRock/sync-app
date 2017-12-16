import {Component} from 'react'
import style from './styles.css'
import style_global from './../style_global.css'

class Box extends Component {
constructor(){
super()    
}
render() {
    return (
        <div className={style_global.compglobal}>
        TEST
        </div>
    )
}
}

export default Box