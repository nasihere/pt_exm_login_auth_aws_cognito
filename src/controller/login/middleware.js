var router = require('express').Router();

router.use((req,res,next)=>{
    console.log("Time:", `${req.url}`, `${JSON.stringify(req.params)}`,new Date())
    next()
})


module.exports = router;
