const router = require("express").Router();
const { auth, admin, authVendor } = require("../middleware/validation");
const Vendor = require("../models/Vendor");
const cron = require('node-cron')

router.post('/', admin, async(req,res) =>{
    try{
        const newVendor = new Vendor(req.body);
        const saveVendor = await newVendor.save()
        res.status(200).json(saveVendor)
    }catch(err){
        res.status(500).json(err);
    }
})

router.put("/:id", admin, async (req, res) => {
    try {
      const updatedVendor = await Vendor.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVendor);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.delete("/:id", admin, async (req, res) => {
    try {
      await Vendor.findByIdAndDelete(req.params.id);
      res.status(200).json("Vendor has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.get("/find",auth, async (req, res) => {
    
     try {
      const user = await Vendor.find()

      res.status(200).json(user)
        
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router
