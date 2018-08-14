# SMS Order Notifications
### ⏱ 15 min build time 

## Why build SMS order notifications? 

Have you ever ordered home delivery to find yourself wondering whether your order was received correctly and how long it'll take to arrive? Some experiences are seamless and others... not so much. 

For on-demand industries such as food delivery, ridesharing and logistics, excellent customer service during the ordering process is essential. One easy way to stand out from the crowd is providing proactive communication to keep your customers in the loop about the status of their orders. Irresepective of whether your customer is waiting for a package delivery or growing "hangry" (i.e. Hungry + Angry) awaiting their food delivery, sending timely SMS order notifications is a great strategy to create a seamless user experience.

The [MessageBird SMS Messaging API](https://developers.messagebird.com/docs/sms-messaging) provides an easy way to fully automate and integrate a notifications application into your order handling software. Busy employees can trigger the notifications application with the push of a single button - no more confused *hangry* customers and a best-in-class user experience, just like that!

## Getting Started

In this MessageBird Developer Guide, we'll show you how to build a runnable Order Notifications application in Node.js. The application is a prototype order management system deployed by our fictitious food delivery company, *Birdie NomNom Foods*.

Birdie NomNom Foods have set up the following workflow:

- New incoming orders are in a _pending_ state.
- Once the kitchen starts preparing an order, it moves to the _confirmed_ state. A message is sent to the customer to inform them about this.
- When the food is made and handed over to the delivery driver, staff marks the order _delivered_. A message is sent to the customer to let them know it will arrive momentarily.
- If preparation takes longer than expected, it can be moved to a _delayed_ state. A message is sent to the customer asking them to hang on just a little while longer. Thanks to this, Birdie NomNom Foods saves time spent answering *"Where's my order?"* calls.

To run the application, let's first make sure that Node and npm are installed on your computer. If they aren't, you can easily install them [here](https://www.npmjs.com/get-npm) for free.

**Pro-tip:** Follow this tutorial to build the whole application from scratch or, if you want to see it in action right away, you can download, clone or fork the sample application from the p[MessageBird Developer Guides GitHub repository](https://github.com/messagebirdguides/notifications-guide).

Let's open a console pointed to the directory into which you've placed the sample application and run the following command to install it:

````bash
npm install
````

This command will install the [MessageBird SDK for Node.js](https://www.npmjs.com/package/messagebird) and other dependencies, as defined in `package.json`, from npm.



## Configuring the MessageBird SDK

Now, let's open `index.js`, the main file of the sample application. You'll find the following lines:

````js
// Load and initialize MesageBird SDK
var messagebird = require('messagebird')('YOUR_API_KEY');
````

Next, we'll replace the string *YOUR_API_KEY* with a *live* access key from your MessageBird account. You can create or retrieve a key from the [API access (REST) tab](https://dashboard.messagebird.com/en/developers/access) in the _Developers_ section. It's also possible to use a _test_ key to test the application. In this case, you can see the API output on the console, but no live SMS messages will be sent.

**Pro-tip:** Hardcoding your credentials in the code is a risky practice that should never be used in production applications. A better method, also recommended by the [Twelve-Factor App Definition](https://12factor.net/), is to use environment variables. We've added [dotenv](https://www.npmjs.com/package/dotenv) to the sample application, so you can supply your API key in a file named `.env`, too:

````env
MESSAGEBIRD_API_KEY=YOUR-API-KEY
````

## Notifying Customer by Triggering an SMS

The sample application triggers SMS delivery in the `/updateOrder` route together with updating the stored data.

Sending a message with the MessageBird SDK is straightforward - we simply call the `messagebird.messages.create()` method with a parameters object.

````js
    // Send the message through MessageBird's API
    messagebird.messages.create({
        originator : 'Birdy NomNom',
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
````

You should set at least the following attributes in this object:

- `originator`: A sender ID for the SMS, either a telephone number (including country code) or an alphanumeric string with at most 11 characters.
- `recipients`: One or more phone numbers to send the message to.
- `body`: The content of the message.

Check out [the SMS Messaging API documentation](https://developers.messagebird.com/docs/messaging#messaging-send) for optional parameters for your application. 

The MessageBird API call is asynchronous and executes a callback function once finished. This callback function takes two parameters, `err` and `response`. If `err` is defined it indicates that something went wrong with the request. If everything went well, `response` contains the response from the API.

## Testing the Application

The sample application works on a set of test data defined in a variable called `OrderDatabase` in `index.js`. To test the full flow, replace one of the phone numbers with your own to receive the message on your phone:

````js
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
````


Now, it's time to run the following command from your console:

````bash
node index.js
````

Then, point your browser at http://localhost:8080/ to see the list of orders.

Click on one of the buttons in the _Action_ column to trigger a status change and, at the same time, automatically send a message. Tada!

## Nice work!

You now have a running SMS Notifications application!

You can now use the flow, code snippets and UI examples from this tutorial as an inspiration to build your own SMS Notifications system. Don't forget to download the code from the [MessageBird Developer Guides GitHub repository](https://github.com/messagebirdguides/notifications-guide).

## Next steps

Want to build something similar but not quite sure how to get started? Please feel free to let us know at support@messagebird.com, we'd love to help!
