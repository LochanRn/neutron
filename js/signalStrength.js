'use strict'
var update = require('./bar');
const Telnet = require('telnet-client');
// var cont = 0
async function run() {
  let connection = new Telnet()

  let params = {
    host: '192.168.1.20',
    port: 23,
    loginPrompt: 'M2 login: ',
    passwordPrompt: 'Password: ',
    username: 'ubnt\r\n',
    password: 'ubnt\r\n',
    timeout: 1500
  }

  try {
    await connection.connect(params)
  } catch (error) {
    // handle the throw (timeout)
  }
  while (1) {
    // setTimeout(function(){
    let res = await connection.exec('iwconfig')
    var result = (res.substr(482, 41)) //479 45 493 2
    var signal = parseInt(res.substr(496, 3))
  //console.log("counter="+cont)
  //   if (cont >= 20 || cont == 0) {
  //     update.updatestrength(100 - sig)
  //     console.log("-----------------------------")
  //     cont = 1;
  //   }
  //   cont++;
  //   console.log(result);
    setTimeout(update.updatestrength(100-signal),5);
  }
}
run();