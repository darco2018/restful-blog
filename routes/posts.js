const express = require("express");
const router = express.Router();

router.get("/", function(req, res){
    res.send("List all posts");
});


module.exports = router;

