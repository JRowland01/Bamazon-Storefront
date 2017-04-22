/*CREATE database Bamazon;*/

USE Bamazon;

/*DROP TABLE products;

CREATE TABLE products (
 item_id INT NOT NULL,
 product_name VARCHAR(100) NULL,
 department_name VARCHAR(100) NULL,
 price DECIMAL(10,2) NULL,
 stock_quantity INT NULL,
 PRIMARY KEY (item_id)
);

*/

UPDATE products SET price = 13.50 WHERE item_id = 2;
  
