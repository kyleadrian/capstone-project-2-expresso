const express = require ('express');
const menuItemsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/database.sqlite');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  const params = {$menuItemId: menuItemId};
  const sql = "SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId";

  db.get(sql, params, (err, menuItem) => {
    if (err) {
      next(err);
    } else if (menuItem) {
      req.menuItem = menuItem;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Get Menuitems by menuId
menuItemsRouter.get('/', (req, res, next) => {
  const menuId = req.params.menuId;
  const params = {$menuId: menuId};
  const sql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';

  db.all(sql, params, (err, menuItems) => {
    if (err) {
      next(err);
    } else {
    res.status(200).send({menuItems: menuItems});
  }
});
});

menuItemsRouter.post('/', (req, res, next) => {
  const menuId = req.params.menuId;
  const name = req.body.menuItem.name;
  const description = req.body.menuItem.description;
  const inventory = req.body.menuItem.inventory;
  const price = req.body.menuItem.price

  const params = {$menuId: menuId, $name: name, $description: description, $inventory: inventory, $price: price};

  const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, menuId)';

  if (!name || !description || !inventory || !price || !menuId) {
    res.sendStatus(400);
  }

  const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, menuId)';

  db.run(sql, params, function (err) {
    if (err) {
      next(err);
    } else {
    db.get(`SELECT * FROM MenuItem WHERE Menu.id = ${this.lastID}`, (err, menuItem) => {
      res.status(201).json({menuItem: menuItem});
    });
  }
});
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  const menuId = req.params.menuId;
  const menuItemId = req.params.menuItemId;
  const name = req.body.menuItem.name;
  const description = req.body.menuItem.description;
  const inventory = req.body.menuItem.inventory;
  const price = req.body.menuItem.price;

  const params = {$menuId: menuId, $menuItemId: menuItemId, $name: name, $description: description, $inventory: inventory, $price: price};

  if (!name || !description || !inventory || !price || !menuId) {
    res.sendStatus(400);
  }

  const sql = 'UPDATE MenuItem SET menu_id = $menuId, name = $name, description = $description, inventory = $inventory, price = $price WHERE MenuItem.id = $menuItemId';

  db.run(sql, params, function (err) {
    if (err) {
      next(err);
    } else {
    db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${menuItemId}`, (err, menuItem) => {
      res.status(200).send({menuItem: menuItem});
        });
      }
  });
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  const menuItemId = req.params.menuItemId;
  const params = {$menuItemId: menuItemId};
  const sql = "DELETE FROM MenuItem WHERE MenuItem.id = $menuItemId";

  db.run(sql, params, (err) =>{
    if (err) {
      next(err);
    } else {
          res.sendStatus(204);
    }
  });
});

module.exports = menuItemsRouter;
