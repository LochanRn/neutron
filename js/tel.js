'use strict'
 var update = require('./bar');
const Telnet = require('telnet-client')

var run = async function() {
  let connection = new Telnet()

  let params = {
    host: '192.168.1.20',
    port: 23,
    //shellPrompt: '/ # ',
    loginPrompt:'M2 login: ',
    passwordPrompt:'Password: ',
    username:'ubnt\r\n',
    password:'ubnt\r\n',
    timeout: 1500
  }

  try {
    await connection.connect(params)
  } catch(error) {
    // handle the throw (timeout)
  }

  let res = await connection.exec('iwconfig')
  console.log(res.substr(479,45))
  //run()
}
//while 1
module.exports.run = run;
