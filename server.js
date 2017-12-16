import express from 'express'
import path from 'path'
import morgan from 'morgan'
import http from 'http'
import fs from 'fs'
import {JSDOM} from 'jsdom'
import io from 'socket.io'

const app = express()
const server = http.Server(app)
const soc = io(server)
let input= ""
soc.on('connection', (socket) => {
    socket.emit('state',{input})
    console.log(`Connected to socket`)
    socket.on('state',(msg) => {
    input= msg.input    
    socket.broadcast.emit('state',msg)
    socket.emit('state',msg)
})
    socket.on('disconnect',() => {
        console.log(`Disconnected from socket`)
    })
})
const PORT = process.env.PORT || 3000
app.use(express.static(path.resolve(__dirname,'build')))
app.use(morgan('dev'))
app.get('*',(req,res) => {
    fs.stat('./build/index.html',(err,stat) => {
        if(err) {
            fs.readFile(path.resolve(__dirname,'build/manifest.json'),'utf8',(err, data) => {
                if(err) res.send(JSON.stringify({err: 'No manifest.json found'}))
                fs.readFile('./build/index_no_manifest.html',(err,html) => {
                    if(err) res.status(404).send(JSON.stringify({err: 'No index_no_manifest.html found'}))
                    const page = new JSDOM(html.toString())
                    const script = page.window.document.createElement('script')
                    const text  = page.window.document.createTextNode(`window.webpackManifest = ${data.toString()}`)
                    script.appendChild(text)
                    script.type = 'text/javascript'
                    page.window.document.head.appendChild(script)
                    fs.writeFile('./build/index.html',page.serialize(),(err) => {
                        if(err) res.status(404).send(JSON.stringify({err: 'Could not inline manifest'}))
                        res.sendFile(path.resolve(__dirname,'./build/index.html'))
                    })
                })
            })
        }
        else res.sendFile(path.resolve(__dirname,'build/index.html'))
    })
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})