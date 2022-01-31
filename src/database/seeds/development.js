/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // truncate all existing tables
  await knex.raw('TRUNCATE TABLE "products" CASCADE');
  await knex.raw('TRUNCATE TABLE "product_details" CASCADE');
  await knex.raw('TRUNCATE TABLE "categories" CASCADE');
  await knex.raw('TRUNCATE TABLE "shopping_cart" CASCADE');
  await knex.raw('TRUNCATE TABLE "cart_details" CASCADE');

  // Inserts seed entries
  await knex('products').insert([
    { id: 1, name: 't-shirt' },
    { id: 2, name: 'jeans' },
    { id: 3, name: 'Hoodie' }
  ]);

  await knex('categories').insert([
    { id: 1, name: 'Casual wear', description: "some description about the category" },
    { id: 2, name: 'Sports wear', description: "some description about the category" },
    { id: 3, name: 'Baby clothes', description: "some description about the caetgory" }
  ]);

  await knex('product_details').insert([
    { id: 1, product_id: 1, category_id: 2, description: "some description about the product", price: 34.99, regular_price: 39.99, stock: 10, attributes: { color: 'blue', size: 'M' } },
    { id: 2, product_id: 2, category_id: 1, description: "some description about the product", price: 49.99, stock: 12, attributes: { color: 'blue', size: 'L' } },
    { id: 3, product_id: 3, category_id: 1, description: "some description about the product", price: 49.99, stock: 12, attributes: { color: 'blue', size: 'L' } }
  ]);
};
