'use strict'
var update = require('./bar');
const Telnet = require('telnet-client');
 var cont = 0
async function run() {
  let connection = new Telnet()

  let params = {
    host: '192.168.1.21',
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
    var result = res.substr(503, 2)//479 45 493 2  482 41 
    var n = result.lastIndexOf("strength = ");
    n=n+11
    var signal = parseInt(result.substr(n, 3))
    // console.log(result);
    // if (cont >= 20 || cont == 0) {
    //   update.updatestrength(100 - parseInt(result))
    //   //console.log("-----------------------------")
    //   cont = 1;
    // }
    // cont++;
  //   console.log(result);
    setTimeout(update.updatestrength(100 - parseInt(result)),20);
  }
}
run();
