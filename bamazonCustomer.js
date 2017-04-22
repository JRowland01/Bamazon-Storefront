var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Druworld01!",
    database: "bamazon"
});


var products;

//A function that gives the user a listing of all the store items.
function allproducts(cb) {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        cb(res);

    });
}

//This function creates the formatting of the table.
allproducts(function(data) {

    var table = new Table({
        head: ['ID', 'Product Name', 'Price'],
        colWidths: [4, 50, 10]
    });

    data.forEach((p) => {

        table.push(
            [p.item_id, p.product_name, "$" + p.price.toFixed(2)]

        );
    });

    console.log(table.toString());

    //A prompt requiring the user to enter ID of their desired purchase.
    inquirer.prompt([{
            type: "input",
            message: "What is the item ID of the product you would like to purchase?",
            name: "id"
        },
        //A prompt requiring the user to state how many products they want to purchase.
        {
            type: "input",
            message: "How many products would you like to buy?",
            name: "quantity"
        },
        //A filter that retrieves and updates the product information based on the product ID and the quantity.
    ]).then(function(user) {
        var selected = data.filter((p) => p.item_id == user.id);
        var currentQuantity = sufficientQ(user.quantity, user.id, selected[0]);
        if (currentQuantity != -1) {
            //Updating the database with the new product quantity and providing the total purchase cost.
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [currentQuantity - user.quantity, user.id], function(err, res, fields) {
                if (err) throw err;
                console.log("Transaction Successful. Thank you for shopping at Bamazon!");
                var totalPrice = selected[0].price * user.quantity;
                console.log("The total cost of your purchase is" + " " + "$" + totalPrice.toFixed(2) + ".");
                endConnection();
            });

        }

        //A message the user will receive if the amount they would like to purchase is less than the current inventory.
        else console.log("Unfortunately, we only have" + " " + selected[0].stock_quantity + " " + "of those products in stock.");

    });


});


function endConnection() {
    connection.end(function(err) {
        if (err) throw err;
    })
}

//A function that returns the proper value of the remaining product when the user orders an amount that is less than the store

function sufficientQ(quantity, id, selectedProduct) {


    if (selectedProduct.stock_quantity >= quantity) {
        return selectedProduct.stock_quantity;
    } else
        return -1;
}
