import { Meteor } from 'meteor/meteor';
import '../import/collections.js';
import { Store } from '../imports/store.js';
import '../imports/reservation.js';


Meteor.startup(() => {
  // clear the initial database
  generalPromotionsList.remove({});
  personalizedSuggestions.remove({});
  itemsSoldList.remove({});
  customersList.remove({});
  currentCustomer.remove({});
  FoodList.remove({});
  OrderList.remove({});
  RestaurantList.remove({});
  Meteor.call('store.removeall');

  // mockUp user for login and dynamic pages (personalized suggestions & profile page)
  customersList.insert({name:"Anonymous",userName:"anon",password:"123",handphoneNumber:12345678,balanceRemaining:45.60,creditCardNumber:1234567890123456});

  // mockUp entries for the promotions page
  generalPromotionsList.insert({item:"Bonafide Big Box",discountPercentage:10,period:"01/11/16 to 31/12/16",price:5.00,img:"/food/bonafideBigBox.jpg"});
  generalPromotionsList.insert({item:"Wicked Good",discountPercentage:15,period:"01/11/16 to 30/11/16",price:4.00,img:"/food/wickedGood.PNG"});
  personalizedSuggestions.insert({item:"2 Pieces Chicken",img:"/food/2PiecesChicken.PNG"});

  // mockUp entries for the highCharts
  itemsSoldList.insert({customer:"Anonymous",item:"2-pieces Chicken",amount:3,img:"/food/2PiecesChicken.PNG"});
  itemsSoldList.insert({customer:"Anonymous",item:"Bonafide Big Box",amount:4,img:"/food/bonafideBigBox.jpg"});
  itemsSoldList.insert({customer:"Anonymous",item:"Cajun Chicken",amount:5, img:"/food/CajunChicken.png"});
  itemsSoldList.insert({customer:"Person2",item:"Wicked Good",amount:2,img:"/food/wickedGood.PNG"});  

  // mockUp entries for the menu display
  FoodList.insert({name:'2-pieces Chicken', price:4, img:"/food/2PiecesChicken.PNG"});
  FoodList.insert({name:'Bonafide Big Box', price:5,img:"/food/bonafideBigBox.jpg"});
  FoodList.insert({name:'Calamari Rings', price:4, img:"/food/calamariRings.jpg"});
  FoodList.insert({name:'Cajun Chicken', price:4.5, img:"/food/CajunChicken.png"});
  FoodList.insert({name:'Coca Cola', price:1.5, img:"/food/cocaCola.jpg"});
  FoodList.insert({name:'Green Tea', price:1.5, img:"/food/greenTea.PNG"});
  FoodList.insert({name:'Wicked Good', price:4,img:"/food/wickedGood.PNG"});

  // mockUp entries to select a restaurant that out system covers 
  RestaurantList.insert({name:"Popeyes", img:"/restaurants/popeyes.jpg"});
  RestaurantList.insert({name:"Long John Silver ", img:"/restaurants/ljs.jpg"});
  RestaurantList.insert({name:"Subway", img:"/restaurants/subway.jpg"}); 
  RestaurantList.insert({name:"Texas Chicken", img:"/restaurants/texas-chicken.png"}); 
  RestaurantList.insert({name:"Wendy's", img:"/restaurants/Wendys.png"});

  // mockUp entries for the locations of the stores (displayed on the 1st page of the order tab)
  if (Store.find().count() == 0) {
      Meteor.call('store.insert', 'Toa Payoh', '480 Loong 6 Toa Payoh, #B1 Toa Payoh HDB Hub Singapore 310480', 'Available', true);
      Meteor.call('store.insert', 'Kallang', '1 Stadium Place Kallang Wave Mall #02-02', 'Full', false);
      Meteor.call('store.insert', 'Orchard', '313@Somerset Orchard Road Singapore 238895', 'Full', false);
  }
});
