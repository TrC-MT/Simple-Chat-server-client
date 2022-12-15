const net = require('net');
const fs = require('fs')

const log = './server.log.txt'
fs.writeFile(log, `Begin server log.\n`, (err) => {
    if(err) throw err;
    console.log('Created server.log.txt')
})

let client_count = 0;
let Clients = []

const server = net.createServer((client) => {
    client.setEncoding('utf-8');
    //handle new connection
    client_count += 1;
    client.identifier = `Client_${client_count}`;
    Clients.push(client);
    fs.appendFile(log, `${client.identifier} has joined the chat.\n`, (err) => {
        if(err) throw err;
    })
    for(let i = 0; i < Clients.length; i++){
        if(Clients[i].identifier !== client.identifier){
            Clients[i].write(`${client.identifier} has joined the chat.\n`)
        }
        else{
            Clients[i].write(`Welcome to the chat ${client.identifier}!\n`);
        };
    };
    
    //When a client sends data
    client.on('data', (message) => {
        if(message.trim() === '/exit'){
            for(let i = 0; i < Clients.length; i++){
                if(Clients[i].identifier !== client.identifier){
                    Clients[i].write(`${client.identifier} left the chat.\n`)
                    Clients = Clients.filter(client => client.identifier)
                }
                else{
                    Clients[i].write('Goodbye.\n')
                    Clients[i].destroy();
                }
            }
            fs.appendFile(log, `${client.identifier} left the chat.\n`, (err) => {
                if(err) throw err;
            })
        }
        else{
            fs.appendFile(log, `${client.identifier} says: ${message}\n`, (err) => {
                if(err) throw err;
            })
            for(let i = 0; i < Clients.length; i++){
                if(Clients[i].identifier !== client.identifier){
                    Clients[i].write(`${client.identifier} says: ${message}\n`)
                }
                else{
                    Clients[i].write('Your message has been sent.\n')
                }
            }
        }
    })

}).listen(3000);

console.log('Listening on port 3000')

client.on('close', () => {
    for(let i = 0; i < Clients.length; i++){
        if(Clients[i].identifier !== client.identifier){
            Clients[i].write(`${client.identifier} left the chat.\n`)
            Clients = Clients.filter(client => client.identifier)
        }
        else{
            Clients[i].write('Goodbye.\n')
            Clients[i].destroy();
        }
    }
    fs.appendFile(log, `${client.identifier} left the chat.\n`, (err) => {
        if(err) throw err;
    })
})