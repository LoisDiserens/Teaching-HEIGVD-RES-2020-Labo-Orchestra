// Requires
const uuid = require('uuid');
const dgram = require('dgram');
const moment = require('moment');

// Creation du socket dgram pour la communication UDP
const socket = dgram.createSocket('udp4');

// Config de l'addressage pour le multicast
const MULTICAST_IP = '123.456.789.1';
const MULTICAST_PORT = 3000;

// Définition de la map faisant le lien entre les instruments et leur son
const instruments = new Map([
  ['Piano', 'ti-ta-ti'],
  ['Trumpet', 'pouet'],
  ['Flute', 'trulu'],
  ['Violin', 'gzi-gzi'],
  ['Drum', 'boum-boum'],
]);

// Controle l'argument (le bon nombre)
if (argv.length != 3) {
  console.error("Il faut 1 et 1 seul argument!");
  return;
}

// Controle que l'instrument soit connu du programme
if (!instruments.get(process.argv[3])) {
  console.error("Instrument inconnu!");
  return;
}

// Création du musiscian
const musician = {
  uuid: uuid.v4(),
  instrument: process.argv[3],
  //activeSince: new Date(Date.now()).toUTCString(),
  activeSince: moment().format(),
}

// Chaque seconde, envois en multicast le son de l'instrument
setInterval(() => {

  const message = Buffer.from(JSON.stringify({
    uuid: musician.uuid,
    sound: instruments.get(musician.instrument),
    instrument: musician.instrument,
    activeSince: musician.activeSince,
  }));

  socket.send(message, 0, message.length, MULTICAST_PORT, MULTICAST_IP, (err, bytes) => {
    console.log('Multicast effectué');
  });
}, 1000); // 1 seconde


