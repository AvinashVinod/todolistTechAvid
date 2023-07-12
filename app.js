const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://AvinashVinod:Aditiraj%4016@cluster0.rspwhuw.mongodb.net/todolistDB?retryWrites=true&w=majority');


const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todolist!!!"
});

const item2 = new Item({
  name: "Hit + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {

  Item.find()
    .then((items) => {
      if (items.length === 0) {
        Item.insertMany(defaultItems)
          .then((insertedItems) => {
            console.log("Items inserted successfully.");
          })
          .catch((error) => {
            console.error("Error inserting items :", error);
          });
        res.redirect("/");
      }
      else {
        res.render("list", { listTitle: "Today", newItems: items });
      }
    })

    .catch((error) => {
      console.error("Error in finding items: ", error);
    });

});

app.get("/:customListName", (req, res) => {
  const custom = _.capitalize(req.params.customListName);

  List.findOne({ name: custom })
    .then((foundList) => {
      if (foundList) {
        console.log("List already exists:", foundList);

        res.render("list", { listTitle: foundList.name, newItems: foundList.items });

      } else {
        const list = new List({
          name: custom,
          items: defaultItems
        });

        list.save()
          .then(() => {

            console.log("New list created:", list);
            res.redirect(`/${custom}`);

          })
          .catch((error) => {

            console.error("Error saving list:", error);

          });
      }
    })
    .catch((error) => {

      console.error("Error finding list:", error);

    });

});


app.post("/", (req, res) => {

  const newItem = req.body.content;
  const listName = req.body.button;

  const newOne = new Item({
    name: newItem
  });

  if (listName === "Today") {

    newOne.save();
    res.redirect("/");

  } else {

    List.findOne({ name: listName })
      .then((foundList) => {

        if (foundList) {
          foundList.items.push(newOne);
          foundList.save()
            .then(() => {
              res.redirect(`/${listName}`);
            })
            .catch((error) => {
              console.error("Error saving items to custom list:", error);
            })
        }
        else {
          console.error("List not found.");
        }

      })
      .catch((error) => {
        console.error(error);
      });

  }
});

app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItem)
      .then((removedItem) => {
        console.log("Items has been removed: ", removedItem);
      })
      .catch((error) => {
        console.error("This is error while removing item: ", error);
      })
    res.redirect("/");
  }
  else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}})
    .then((foundList)=>{
      console.log("item has been deleted",foundList);
      res.redirect(`/${listName}`);
    })
    .catch((error)=>{
      console.error("There is error in deleting item in custom list: ",error);
    })
  }

})

app.get("/work", (req, res) => {

  res.render("list", { listTitle: "Work List", newItems: workItems });

});

// app.post("/work", (req, res) => {

//   let workItem = req.body.content;

//   workItems.push(workItem);

//   res.redirect("/work");

// });

app.get("/about", function (req, res) {

  res.render("about");

});


app.listen(4000, () => {
  console.log("Your server has been started at localhost:4000");
});