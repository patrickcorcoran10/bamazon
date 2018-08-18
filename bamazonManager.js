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
    managerPrompt();
    
    
});

function managerPrompt() {
    
    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                message: "What managerial activitiy would you like to perform?",
                choices: ["View Products for Sale", "View Low Inventory Items", "Add to Inventory", "Add a New Product"]
            }
        ])
        .then(function(answer) {
            console.log(answer.action);
            if (answer.action == "View Products for Sale") {
                table();
            } else if (answer.action == "View Low Inventory Items") {
                lowInventory();
            } else if (answer.action == "Add to Inventory") {
                addInventory();
            } else {
                addProduct();
            };
        })
    // connection.end();
};
function table() {
    connection.query("select * from products", function(err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("========================================================================================")
            console.log("Item ID: " + results[i].item_id +" || Product Name: "+results[i].product_name +" || Price $"+results[i].price +" || Stock "+results[i].stock_quanity)
        };
    })
    managerPrompt();
};

function lowInventory() {
    connection.query("SELECT * FROM products ORDER BY stock_quantity DESC", 
                
                function(err, results) {
                    if (err) throw err;
                })
    managerPrompt();
};

function addInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
    
    inquirer   
        .prompt([
            {
                name: "inventoryAdd",
                type: "rawlist",
                choices: function() {
                    var productArray = [];
                    for (var i = 0; i < results.length; i++) {
                        productsArray.push(results[i].product_name);
                    }
                    return productArray;
                },
                message: "Which product's inventory would you like to increase?"
            },
            {
                name: "inventoryAmount",
                type: "input",
                message: "How much inventory would you like to add?"
            }
        ])
        .then(function(answers) {
            
        })
    })
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "productQ",
                type: "input",
                message: "What product would you like to add?"
            },
            {
                name: "departmentQ",
                type: "input",
                message: "What department does this product belong in?"
            },
            {
                name: "priceQ",
                type: "input",
                message: "What price are we selling this product for?"
            },
            {
                name: "stockQ",
                type: "input",
                message: "How many of this product will we stock?"
            }
        ])
        .then(function(answers) {
            connection.query("INSERT INTO products SET ?",
            {
                product_name: answers.productQ,
                department_name: answers.departmentQ,
                price: answers.priceQ,
                stock_quantity: answers.stockQ
            },
            function(err) {
                if (err) throw err;
                console.log("Inventory Updated.");
                managerPrompt();
            }
        )}
)};

function end() {
    connection.end();
};

