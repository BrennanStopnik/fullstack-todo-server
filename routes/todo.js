var express = require("express");
const { uuid } = require("uuidv4");
var router = express.Router();

const { db } = require("../mongo");

const mockTodos = [
  {
    id: "4387f4d8-aeac-4559-9f1b-3c5d537c955c",
    title: "Implement Fullstack ToDo List",
    description: "Implement the fullstack todo list application.",
    isComplete: false,
    priority: "High",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
  {
    id: "e365f13c-4c1d-4ee1-8a66-3dbbbab71f0d",
    title: "Create /all route for mock data",
    description:
      "Create an express route that will respond with the mock todo list.",
    isComplete: false,
    priority: "High",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
  {
    id: "08dd1f20-7d31-4120-89ed-343d4006a7cb",
    title: "Create a home page in the client",
    description: "Create a Home Page in React that will display all the todos.",
    isComplete: false,
    priority: "High",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
  {
    id: "98a06f8f-50c9-4832-9d2d-daa45543db00",
    title: "Create the todo card component",
    description:
      "Create a react ToDoCard component that will be rendered for each todo on the home page.",
    isComplete: false,
    priority: "Medium",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
  {
    id: "7c5d70bb-2a00-4009-9bb8-1bb163fb501f",
    title: "Test basic application with mock data",
    description:
      "Visit the client Home Page to see the todo's displayed as a list.",
    isComplete: false,
    priority: "Medium",
    creationDate: new Date(),
    lastModified: new Date(),
    completedDate: null,
  },
];
router.get("/all", async (req, res) => {
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);
  const skip = (page - 1) * limit;
  try {
    const todos = await db()
      .collection("todos")
      .find({})
      .limit(limit)
      .skip(skip)
      .toArray();
    res.json({
      success: true,
      todos,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

router.post("/create-one", async (req, res) => {
  try {
    const newTodo = {
      ...req.body,
      creationDate: new Date(),
      isComplete: false,
      completedDate: null,
      lastModified: new Date(),
      id: uuid(),
    };
    const result = await db().collection("todos").insert(newTodo);
    res.json({
      success: true,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

router.put("/update-one/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const newToDo = req.body;

    if (newToDo.isComplete !== undefined) {
      if (newToDo.isComplete === true) {
        newToDo.completedDate = new Date();
      } else {
        newToDo.completedDate = null;
      }
    }
    const result = await db()
      .collection("todos")
      .updateOne({ id: idParam }, { $set: newToDo });
    res.json({
      success: true,
      result,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

router.delete("/delete-one/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const result = await db().collection("todos").deleteOne({ id: idParam });
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
});

module.exports = router;