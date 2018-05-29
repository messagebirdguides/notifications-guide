// Load Dependencies
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');

// Load and initialize MesageBird SDK
var messagebird = require('messagebird')('YOUR_API_KEY');

// Set up Order "Database"
var OrderDatabase = [
    {
        name : 'Hannah Hungry',
        phone : '+319876543210', // <- put your number here for testing
        items : '1 x Hipster Burger + Fries',
        status : 'pending'
    },
    {
        name : 'Mike Madeater',
        phone : '+319876543211', // <- put your number here for testing
        items : '1 x Chef Special Mozzarella Pizza',
        status : 'pending'
    }
];

// Configure Handlebars Helpers
var hbs = exphbs.create({
    helpers: {
        pending: function(v) { return (v.status == 'pending'); },
        readyForDelivery: function(v) { return (v.status == 'confirmed' || v.status == 'delayed'); },
        confirmed: function(v) { return (v.status == 'confirmed'); }
    }
})

// Set up and configure the Express framework
var app = express();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended : true }));

// Display page to list orders
app.get('/', function(req, res) {
    res.render('orders', {
        orders : OrderDatabase
    });
});

// Execute action to update order
app.post('/updateOrder', function(req, res) {
    // Read request
    var id = req.body.id;
    var newStatus = req.body.status;
    
    // Get order
    var order = OrderDatabase[id];
    if (order) {
        // Update order
        order.status = newStatus;
        
        // Compose a message, based on current status
        var body = "";
        switch (order.status) {
            case 'confirmed':
                body = order.name + ", thanks for ordering at OmNomNom Foods! We are now preparing your food with love and fresh ingredients and will keep you updated.";
                break;
            case 'delayed':
                body = order.name + ", sometimes good things take time! Unfortunately your order is slightly delayed but will be delivered as soon as possible.";
                break;
            case 'delivered':
                body = order.name + ", you can start setting the table! Our driver is on their way with your order! Bon appetit!";
                break;
        }

        // Send the message through MessageBird's API
        messagebird.messages.create({
            originator : 'OmNomNom',
            recipients : [ order.phone ],
            body : body
        }, function (err, response) {
            if (err) {
                // Request has failed
                console.log(err);
                res.send("Error occured while sending message!");
            } else {
                // Request was successful
                console.log(response);
                res.redirect('/');
            }
        });
        
        // Save order
        OrderDatabase[id] = order;        
    } else {
        res.send("Invalid input!");
    }    
});

// Start the application
app.listen(8080);