import { Mongo } from 'meteor/mongo';

// for registration, login & keeping track of who has registered
customersList = new Mongo.Collection('customers');

// for login/sign-out & dynamic profile page (edit information and balance management/restriction of the bill)
currentCustomer = new Mongo.Collection('customer'); 

// for dynamic promotions page
generalPromotionsList = new Mongo.Collection('generalPromotions'); 
personalizedSuggestions = new Mongo.Collection('personalizedSuggestions'); 

// for menu display
FoodList = new Mongo.Collection('food');

// for consolidating what items the customer wants to order (the bill)
OrderList = new Mongo.Collection('order');

// for real-time update of highcharts (recording what customers have ordered)
itemsSoldList = new Mongo.Collection('itemsSold');