var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startingQuestion();
});


function table() {
    connection.query("select * from products", function(err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("Item ID: " + results[i].item_id +" || Product Name: "+results[i].product_name +" || Price $"+results[i].price +" || Stock "+results[i].stock_quanity)
        };
    })
    customerPrompt();
};

function startingQuestion() {
   
    inquirer
        .prompt([
            {
                name: "start",
                type: "list",
                choices: ["Shop", "Leave"],
                message: "What are you here to do?"
            }
        ])
        .then(function(answer) {
            if (answer.start == "Leave") {
                end()
            } else {
                console.log("Let's Shop.");
                table();
            }
        });
};


function customerPrompt() {
    connection.query("select * from products", function(err, results) {
        if (err) throw err;

    inquirer
        .prompt([
            {
                name: "idQ",
                type: "input",
                message: "What is the id of the item you are interested in?"
            },
            {
                name: "howMany",
                type: "input",
                message: "How many would you like to buy?"
            },
        ])
        .then(function(answer) {
            var product = "";
            var id = "";
            var price = "";
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id == answer.idQ) {
                    product = results[i].product_name;
                    id = results[i].item_id;
                    price = results[i].price;
                    charge = price * answer.howMany;
                    chargeAmount = charge.toFixed(2);
                    stock = results[i].stock_quanity;
                    newStock = stock - answer.howMany;
                }
            };
            
            console.log("Seems you'd like to buy " + answer.howMany + " " + product);
            if (stock > answer.howMany) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",[
                        {
                            stock_quanity: newStock
                        },
                        {
                            item_id: id
                        }
                    ],
                     function(err, results) {
                        if (err) throw err;
                    }) 
                console.log("Your order is being shipped. Your credit card will be charged $"+chargeAmount);
                console.log("===========================================================");                
                startingQuestion();
                
            } else {
                console.log("Unfortunately we don't have enough stock to fill that order.");
                console.log("===========================================================");
                startingQuestion();
            }
        
    })
})    
};


    
function end() {
    console.log("Thank you. Come again.")
    connection.end();
};






