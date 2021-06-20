// Requirement
const dgram = require('dgram');
const moment = require('moment');
const net = require('net');

// Socket UDP
const socket = dgram.createSocket('udp4');

// Configuration
const TCP_PORT = 2205;
const MULTICAST_IP = '123.456.789.1';
const MULTICAST_PORT = 3000;

// Liste des musicians
let musicians = new Map()

// Ecoute l addresse muticast
socket.bind(MULTICAST_PORT, () => {
  socket.addMembership(MULTICAST_IP);
});

socket.on('message', (msg, src) => {
  const req = JSON.parse(msg.toString());
  
  // Ajoute un musician
  musicians.set(req.uuid, {
    instrument: req.instrument,
    last: moment().format(),
    activeSince: req.activeSince,
  });

  // Après 5s d'inactivité, supprime un musician de la Map
  for (let [uuid, musician] of musicians.entries()) {
    if (moment().diff(moment(musician.last), 'seconds') > 5) {
      musicians.delete(uuid);
    }
  }
});

// Création du srv TCP pour récupérer la liste de musician(s) actif(s)
net.createServer((sock) => {
  let packetTCP = [];
  
  // Mise au format d'envois des données
  for (let [uuid, musician] of musicians.entries()) {
    packetTCP.push({
      uuid: uuid,
      instrument: musician.instrument,
      activeSince: musician.activeSince,
    });
  }

  // Envois des données via TCP
  sock.write(JSON.stringify(packetTCP));
  sock.end();
}).listen(TCP_PORT);