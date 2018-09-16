const express = require ('express');
const menuRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/database.sqlite');

const menuItemsRouter = require('/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/api/menuItems.js');
menuRouter.use('/:menuId/menu-items', menuItemsRouter)

menuRouter.param('menuId', (req, res, next, menuId) => {
  const params = {$menuId: menuId};
  const sql = "SELECT * FROM Menu WHERE Menu.id = $menuId";

  db.get(sql, params, (err, menu) => {
    if (err) {
      next(err);
    } else if (menu) {
      req.menu = menu;
      next();
    } else {
      res.sendStatus(404);
    }
});
});
//Get all menus
menuRouter.get('/', (req, res, next) => {
  const sql = "SELECT * FROM Menu";

  db.all(sql, (err, menus) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({menus: menus});
    }
  });
});
//Get all menus by Id
menuRouter.get('/:menuId', (req, res, next) => {
  res.status(200).send({menu: req.menu});
});

menuRouter.put('/:menuId', (req, res, next) => {
  const menuId = req.params.menuId;
  const title = req.body.menu.title

  const params = {$menuId: menuId, $title: title};

  const sql = 'UPDATE Menu SET title = $title WHERE Menu.id = $menuId';

  if (!title) {
    res.sendStatus(400);
  };

  db.run(sql, params, function(err) {
    if (err) {
      next(err);
    } else {
    db.get(`SELECT * FROM Menu WHERE Menu.id = ${menuId}`, (err, menu) => {
      res.status(200).json({menu: menu});
        });
      }
  });
});

menuRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  const params = {$title: title};
  const sql = "INSERT INTO Menu (title) VALUES ($title)"

  if (!title) {
    res.sendStatus(400);
  }

  db.run(sql, params, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Menu WHERE menu.id = ${this.lastID}`, (err, menu) => {
        res.status(201).send({menu: menu});
      });
    }
  });
});

menuRouter.delete('/:menuId', (req, res, next) => {
  const menuId = req.params.menuId;
  const menuItemId = req.params.menuItemId;
  const params = {$menuId: menuId};
  const sqlmenu = "DELETE FROM Menu WHERE Menu.id = $menuId";
  const sqlMenuItem = "SELECT * FROM MenuItem where MenuItem.menu_id = $menuId";

  db.get(sqlMenuItem, params, (err, menuItem) => {
    if (err) {
      next(err);
    } else if (menuItem) {
      res.sendStatus(400);
  } else {
      db.run(sqlmenu, params, (err) =>{
        if (err) {
          next(err)
        } else {
              res.sendStatus(204);
        }
  });
}
});
});

module.exports = menuRouter;
