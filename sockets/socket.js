const { io } = require('../index');
const Band = require('../model/band');
const Bands = require('../model/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Korn'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('Red Hot Chili Peppers'));
bands.addBand(new Band('Audioslave'));
bands.addBand(new Band('Creed'));
bands.addBand(new Band('Aerosmith'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('emitir-mensaje', (payload) => {
        // io.emit('nuevo-mensaje', payload);
        client.broadcast.emit('nuevo-mensaje', payload);
    });

    client.on('voto-band', (payload) => {
        bands.voteBand(payload['id']);
        io.emit('active-bands', bands.getBands());
    })

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload['name']));
        io.emit('active-bands', bands.getBands());
    })

    client.on('borrar-band', (payload) => {
        bands.deleteBand(payload['id']);
        io.emit('active-bands', bands.getBands());
    })

});