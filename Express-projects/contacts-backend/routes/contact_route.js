const express = require("express");
const router = express.Router();

router.route("/").get((req,res) => {
    res.status(200).json({message : "Get all contacts"});
});

router.route("/:id").post((req,res) => {
    res.status(200).json({message : `Create contact of ID: ${req.params.id}`});
});

router.route("/:id").put((req,res) => {
    res.status(200).json({message : `Update contact of ID: ${req.params.id}`});
});

router.route("/:id").delete((req,res) => {
    res.status(200).json({message : `Remove contact of id: ${req.params.id}`});
});

router.route("/:id").get((req,res) =>   {
    res.status(200).json({message: `Get the contact of: ${req.params.id}`});
});

module.exports = router;