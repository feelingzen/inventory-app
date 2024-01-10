const express = require('express');
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController")
const item_controller = require("../controllers/itemController")
const index_controller = require("../controllers/indexController")

router.get("/", index_controller.index);

router.get("/products", item_controller.item_list)

router.get("/categories", category_controller.category_list)

router.get("/category/:id", category_controller.category_detail);

router.get("/product/:id", item_controller.item_detail);

router.get("/create/category", category_controller.category_create_get)

router.post("/create/category", category_controller.category_create_post)

router.get("/create/product", item_controller.item_create_get)

router.post("/create/product", item_controller.item_create_post)

router.get("/delete/category/:id", category_controller.category_delete_get)

router.post("/delete/category/:id", category_controller.category_delete_post)

router.get("/delete/product/:id", item_controller.item_delete_get)

router.post("/delete/product/:id", item_controller.item_delete_post)

router.get("/update/product/:id", item_controller.item_update_get)

router.post("/update/product/:id", item_controller.item_update_post)

module.exports = router;