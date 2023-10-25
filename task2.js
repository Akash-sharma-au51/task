// task2:Finish the function
// Finish implementing the 'create order' function, ensuring that the business logic checks whether
// the requested quantity of each product mentioned in the order items is available in the product
// inventory. Consider the above Task 1 DB schema for completing this task.
// Create Order API Endpoint function createOrder(req, res) { // Request Body Parameters const
// { customer_name, customer_email, items // Array of objects with product_id and quantity } =
// req.body;}

const db = require('database-library'); 
const { validateOrderItems, calculateTotalAmount } = require('./order-utils'); 

function createOrder(req, res) {
  const { customer_name, customer_email, items } = req.body;

  const validationResults = validateOrderItems(items);
  if (!validationResults.valid) {
    return res.status(400).json({ error: validationResults.message });
  }
  const totalAmount = calculateTotalAmount(items);

  // if product is available

  const productIds = items.map((item) => item.product_id);
  const sql = `
    SELECT product_id, stock_quantity
    FROM Products
    WHERE product_id IN (${productIds.join(', ')})
  `;

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error.' });
    }

    // Step 4: Check if the requested quantities are available
    
    const insufficientProducts = [];
    for (const item of items) {
      const product = results.find((result) => result.product_id === item.product_id);
      if (!product || product.stock_quantity < item.quantity) {
        insufficientProducts.push(item.product_id);
      }
    }

    if (insufficientProducts.length > 0) {
      return res.status(400).json({ error: 'Insufficient stock for some products.', insufficientProducts });
    }

    //insert orders into database
    const order = {
      customer_name,
      customer_email,
      total_amount: totalAmount,
      order_date: new Date(),
    };

    db.query('INSERT INTO Orders SET ?', order, (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Order creation failed.' });
      }

      const orderId = result.insertId;
      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      db.query('INSERT INTO OrderItems (order_id, product_id, quantity) VALUES ?', [orderItems], (error) => {
        if (error) {
          return res.status(500).json({ error: 'Order items creation failed.' });
        }

        res.status(201).json({ message: 'Order created successfully.' });
      });
    });
  });
}

module.exports = { createOrder };



