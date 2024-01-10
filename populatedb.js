#! /usr/bin/env node
  
  // Get arguments passed on command line  
  const Item = require("./models/item");
  const Category = require("./models/category"); 
  const Items = [];
  const Categories = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = "mongodb+srv://admin:admin@cluster0.s8frvke.mongodb.net/?retryWrites=true&w=majority"
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function itemCreate(index, name, description, stock, category) {
    const itemNew = new Item({ 
        name,
        description,
        stock,
        category
    });
    await itemNew.save();
    Items[index] = itemNew;
    console.log(`Added item: ${name}`);
  }
  
  async function categoryCreate(index, name, description) { 
  
    const categoryNew = new Category({
        name,
        description
    });
  
    await categoryNew.save();
    Categories[index] = categoryNew;
    console.log(`Added category: ${name}`);
  }
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Shoe", "Shoes and stuff"),
      categoryCreate(1, "Shoe", "Shoes and stuff"),
      categoryCreate(2, "Shoe", "Shoes and stuff"),
    ]);
  }

  console.log(Categories)

  async function createItems() {
    console.log("Adding items");
    await Promise.all([
      itemCreate(0, "Test1", "Testing1", 1, Categories[0]),
      itemCreate(1, "Test2", "Testing2", 2, Categories[1]),
      itemCreate(2, "Test3", "Testing3", 3, Categories[2])
    ]);
  }