import { Mongo } from 'meteor/mongo';
 
// Reservation in order to store and process the reservation made by a customer on the 1st page of ther ordering tab

Reservation = new Mongo.Collection('reservation');

/*Meteor.methods({
  'reservation.insert'(name, type, date, time, pax, store) {
    Reservation.insert({
      custName: name,
      resType: type,
      resDate: date,
      resTime: time,
      totPax: pax,
      resStore: store,
    });
  },

  'reservation.removeall'() {
  	while(reservation.find().count() != 0) {
		var id = reservation.find().fetch()[0]._id;
		Reservation.remove(id);
    }
  },
});*/