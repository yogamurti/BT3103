import { Mongo } from 'meteor/mongo';

// Store to indicate the stores available for the 1st page of the ordering tab

export const Store = new Mongo.Collection('store');

Meteor.methods({
  'store.insert'(name, address, status, available) {
    Store.insert({
      storeName: name,
      storeAddress: address,
      storeStatus: status,
      resStatus: available,
    });
  },

  'store.removeall'() {
  	while(Store.find().count() != 0) {
		var id = Store.find().fetch()[0]._id;
		Store.remove(id);
    }
  },
});