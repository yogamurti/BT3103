import { Template } from 'meteor/templating';
import { Store } from '../imports/store.js';
import '../imports/reservation.js';
import '../import/collections.js';
import './main.html';

// routing
Router.route('/', {
	name: 'loginPage',
    template: 'loginPage',
    layoutTemplate: 'blank',
});

Router.route('/homePage');
Router.route('/registrationPage', {layoutTemplate: 'blank'});
Router.route('/profilePage');
Router.route('/menu');
Router.route('/order');
Router.route('/order2');
Router.route('payment')

Router.configure({
    layoutTemplate: 'main'
});

// sessions
Template.order.onCreated(function bodyOnCreated() {
    Session.set('isDineInSes', true);
    Session.set('isTakeAwaySes', false);
    Session.set('chosenStore', "");
});

// helpers & events for the ordering tab
	// 1st page

Template.order.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({
    defaultDate: new Date(), // show the current date and time in the input
    focusOnShow: false, // prevent the keyboard from opening when you open the picker on mobile devices

    }).on('dp.change', function(e){
      Session.set("selectedDate", e.date.format('HH:mm a'));
      Session.set("selectedTime", e.date.format('D/MMM/YYYY'));
    });
});

Template.order.helpers({
    stores() {
      return Store.find();
    },
    isDineIn : function(){
      return Session.get('isDineInSes');
    },
    isTakeAway : function(){
      return Session.get('isTakeAwaySes');
    },
    name(){
      return currentCustomer.findOne().name;
    }
});

Template.order.events({
	'submit .form-register': function(event, template) {
        event.preventDefault();
        //var getUser = event.target.nameee.value;
        var getDate = Session.get("selectedDate");
        var getTime = Session.get("selectedTime");
        var getPax = 0;
        var store = Session.get('chosenStore');
        if (Session.get('isDineInSes')) {
          getPax = event.target.pax.value;
          //Meteor.call('reservation.insert', getUser, 'Dine In', getDate, getTime, getPax, store);
          Reservation.insert({
            custName: currentCustomer.findOne().name,
            resType: 'Dine In',
            resDate: getDate,
            resTime: getTime,
            totPax: getPax,
            resStore: store,
          });
        }
        else {
          //Meteor.call('reservation.insert', getUser, 'TakeAway', getDate, getTime, getPax, store);
          Reservation.insert({
            custName: currentCustomer.findOne().name,
            resType: 'Take Away',
            resDate: getDate,
            resTime: getTime,
            totPax: getPax,
            resStore: store,
          });
        }
    Router.go("order2");
    }
  });

Template.store.events({
    'click #toggle-checked'(){
        //console.log(this.storeName);
        Session.set('chosenStore', this.storeName);
        console.log(this.storeName);
    },
    'click #toggle-checked2'(){
        //console.log(this.storeName);
        Session.set('chosenStore', this.storeName);
        console.log(this.storeName);
    }
});

Template.store.helpers({
    isDineIn : function(){
      return Session.get('isDineInSes');
    },
});

Template.content.events({
    'click #set-dinein'(event, instance){
      Session.set('isDineInSes', true);
      Session.set('isTakeAwaySes', false);
      event.preventDefault();
      $("#set-dinein").addClass("active");
      $("#set-takeaway").removeClass("active");
      $(".order-method").html("Dine In");
    },
    'click #set-takeaway'(event, instance) {
      Session.set('isDineInSes', false);
      Session.set('isTakeAwaySes', true);
      event.preventDefault();
      $("#set-dinein").removeClass("active");
      $("#set-takeaway").addClass("active");
      $(".order-method").html("Take Away");
    },
});

Template.menu.helpers({
    food(){
        return FoodList.find({});
    },
  	price() {return this.price.toFixed(2);}
 });

	// 2nd page

 Template.order2.helpers({
    food(){
        return FoodList.find({});
    }
 });

Template.order2.events({
	'submit form'(event){
	    event.preventDefault();
	    var id = this._id;
	    var food = FoodList.findOne(id);
	    var quantityVar = event.target.quantityNumber.value;
	    OrderList.insert({name: food.name, price: parseFloat(food.price*quantityVar), quantity:parseInt(quantityVar), img:food.img});    
	},
	'click .next'(){
	 Router.go("payment");
	}
});
  
  // 3rd page

Template.payment.helpers({
    order(){
        return OrderList.find({});
    },
    total(){
    	var items=OrderList.find({});
    	var amountItems=items.count();
    	var totalAmount=0;
    	for (var i=0;i<amountItems;i++){
    		totalAmount+=items.fetch()[i].price;
    	}
    	return totalAmount.toFixed(2);
    },
    price() {return this.price.toFixed(2);}
});

Template.payment.events({
	'click .pay'(event){
		var items=OrderList.find({});
    	var amountItems=items.count();
    	var deductAmount=0;
    	for (var i=0;i<amountItems;i++){
    		deductAmount+=items.fetch()[i].price;
    	}

		var customer=currentCustomer.findOne();
		var customerListID=customersList.findOne({name:customer.name})._id
		if (customer.balanceRemaining<deductAmount){
			// remove everything from OrderList
	    	while (OrderList.find({}).count()>0){
	    		OrderList.remove({_id:OrderList.find({}).fetch()[0]._id})
	    	}
	    	alert("Insufficient Funds!");
			Router.go("order2");
		}
		else{
			customersList.update({_id:customerListID},{$inc:{balanceRemaining:-deductAmount}});
			currentCustomer.update({_id:customer._id},{$inc:{balanceRemaining:-deductAmount}});
	    	for (var i=0;i<amountItems;i++){
	    		var item=items.fetch()[i];
	    		if(itemsSoldList.findOne({item:item.name})==undefined){
	    			itemsSoldList.insert({customer:customer.name,item:item.name,amount:item.quantity, img:item.img});
	    		}
	    		else{
	    			var itemID=itemsSoldList.findOne({item:item.name})._id;
	    			itemsSoldList.update({ _id: itemID}, {$inc: {amount:item.quantity} });
	    		}
	    	}
			// remove everything from OrderList
	    	while (OrderList.find({}).count()>0){
	    		OrderList.remove({_id:OrderList.find({}).fetch()[0]._id})
	    	}
			alert("$"+deductAmount.toFixed(2).toString()+" has been deducted from your balance.");
			Router.go("profilePage");			
		}
	}
});

// helpers for other pages

Template.general.helpers({
	generalPromo(){
		return generalPromotionsList.find({});
	},
	price() {return this.price.toFixed(2);}
})

Template.personalized.helpers({
	personalizedSuggestion(){
		var customer=currentCustomer.findOne();
		var purchases=itemsSoldList.find({customer:customer.name});
		if (purchases.count()!==0){
			var mostFrequentQuantity=0;
			var mostFrequentItem="";
			for (var i=0;i<purchases.count();i++){
				if (purchases.fetch()[i].amount>mostFrequentQuantity){
					mostFrequentItem=purchases.fetch()[i].item;
					mostFrequentQuantity=purchases.fetch()[i].amount;
				}
			}
			if(personalizedSuggestions.findOne({item:mostFrequentItem})==undefined){ // add to suggestions if it not already in the collection
				personalizedSuggestions.insert({item:mostFrequentItem,img:itemsSoldList.findOne({customer:customer.name,item:mostFrequentItem}).img});
			}
		}
		return personalizedSuggestions.find({});
	},
})

Template.profilePage.helpers({
	customer(){
		return currentCustomer.find({});
	},
	balanceRemaining() {return this.balanceRemaining.toFixed(2);}
})

Template.homePage.helpers({
	customer(){
		return currentCustomer.find({});
	}
})

// events for other pages (wrapped in meteor.startup so that highcharts will run properly)

Meteor.startup(function () {
	Template.main.events({
    'click .signout': function(event){
    	var id=currentCustomer.findOne()._id
      	currentCustomer.remove({_id:id});		
    	Router.go("loginPage");
    	}
	});

	Template.loginPage.events({
    'submit form': function(event){
    		event.preventDefault();
    		var userName=event.target.userName.value;
    		var password=event.target.password.value;
    		var entry= customersList.findOne({userName:userName})
    		if (entry==undefined){	// no such userName
    			alert("No such UserName");
    		}
    		else{
    			if (entry.password==password){
    				Router.go("homePage");
    				currentCustomer.insert({name:entry.name,userName:entry.userName,password:entry.password,handphoneNumber:entry.handphoneNumber,balanceRemaining:entry.balanceRemaining,creditCardNumber:entry.creditCardNumber});
    			}
    			else{
    				alert("Invalid password");
    			}
    		}
    	}
	});

	Template.registrationPage.events({
	    'submit form': function(event){
	    	event.preventDefault();
	    	var password=event.target.password.value;
	    	var confirmPassword=event.target.confirmPassword.value;
	    	if(password!==confirmPassword){
	    		alert("Passwords do not match");
	    	}
	    	else{
		    	var userName=event.target.userName.value;
		    	var name=event.target.name.value;
		    	var handphoneNumber=event.target.password.handphoneNumber;
		    	var creditCardNumber=event.target.password.creditCardNumber;
		    	if (password =="" || userName =="" || name =="" || handphoneNumber =="" || creditCardNumber ==""){
		    		alert("Please fill in all fields");
		    	}
		    	else if(customersList.findOne({name:name})!=undefined){
		    		alert("You have already signed up!");
		    	}
		    	else if(customersList.findOne({userName:userName})!=undefined){
		    		alert("User Name taken, please choose another user name");
		    	}
		    	else{
		  			customersList.insert({name:name,userName:userName,password:password,handphoneNumber:handphoneNumber,balanceRemaining:0,creditCardNumber:creditCardNumber});
		  			alert("Registration successful!");
		  			Router.go("loginPage");
		    	}
		    }
	    }
	});

	Template.homePage.events({
		'click .popularPurchases'(event){
			var purchases=itemsSoldList.find({});
			var listOfItems=[];
			var listOfAmounts=[];
			for (var i=0;i<purchases.count();i++){
				listOfItems.push(purchases.fetch()[i].item);
				listOfAmounts.push(purchases.fetch()[i].amount);
			}
			$('#graph').highcharts({
			    chart: {
			      type: 'bar',
			      backgroundColor:"#EEE9E3"
			    },
	            colors: [
	                '#006400',
	            ],
			    title: {
			      text: 'Sales Amount'
			    },
			    xAxis: {
			      categories: listOfItems
			    },
			    yAxis: {
			      min: 0,
			      title: {
			        text: 'Total Amount Sold'
			      }
			    },
			    legend: {
			      reversed: true
			    },
			    plotOptions: {
			      series: {
			        stacking: 'normal'
			      }
			    },
			    series: [{
			      name: 'Total Purchases',
			      data: listOfAmounts
			    } ]
	        })
		}
	})

	Template.profilePage.events({
		'click .addBalance'(event){
			var customer=currentCustomer.findOne();
			var amount=prompt("Please enter the amount:", "0");
			if (amount === null) {
			    return;
			}
			else{
				customersList.update({ _id: customer._id}, {$inc: {balanceRemaining: parseFloat(amount)} });
				currentCustomer.update({ _id: customer._id}, {$inc: {balanceRemaining: parseFloat(amount)} });
			}
		},
		'click .editInfo'(event){
			var customer=currentCustomer.findOne();
			var customerListID=customersList.findOne({name:customer.name})._id

			var userName=prompt("User Name:",customer.userName);
			if (userName === null) {
			}
			else{
				customersList.update({ _id: customerListID}, {$set: {userName:userName} });
				currentCustomer.update({ _id: customer._id}, {$set: {userName:userName} });
			}

			var password=prompt("Password:",customer.password);
			if (password === null) {
			}
			else{
				customersList.update({ _id: customerListID}, {$set: {password:password} });
				currentCustomer.update({ _id: customer._id}, {$set: {password:password} });
			}	

			var handphoneNumber=prompt("Phone Number:",customer.handphoneNumber);
			if (handphoneNumber === null) {
			}
			else{
				customersList.update({ _id: customerListID}, {$set: {handphoneNumber:handphoneNumber} });
				currentCustomer.update({ _id: customer._id}, {$set: {handphoneNumber:handphoneNumber} });
			}	

			var creditCardNumber=prompt("Credit Card Number:",customer.creditCardNumber);
			if (creditCardNumber === null) {
			}
			else{
				customersList.update({ _id: customerListID}, {$set: {creditCardNumber:creditCardNumber} });
				currentCustomer.update({ _id: customer._id}, {$set: {creditCardNumber:creditCardNumber} });
			}				
		},
		'click .pastPurchases'(event){
			var customer=currentCustomer.findOne();
			var purchases=itemsSoldList.find({customer:customer.name});
			var listOfItems=[];
			var listOfAmounts=[];
			for (var i=0;i<purchases.count();i++){
				listOfItems.push(purchases.fetch()[i].item);
				listOfAmounts.push(purchases.fetch()[i].amount);
			}
			$('#graph').highcharts({
			    chart: {
			      type: 'bar',
			      backgroundColor:"#EEE9E3"
			    },
	            colors: [
	                '#008B8B',
	            ],
			    title: {
			      text: 'Sales Amount'
			    },
			    xAxis: {
			      categories: listOfItems
			    },
			    yAxis: {
			      min: 0,
			      title: {
			        text: 'Total Amount Sold'
			      }
			    },
			    legend: {
			      reversed: true
			    },
			    plotOptions: {
			      series: {
			        stacking: 'normal'
			      }
			    },
			    series: [{
			      name: 'Past Purchases',
			      data: listOfAmounts
			    } ]
	        })
		},
	})
})