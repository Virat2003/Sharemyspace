const router = require("express").Router();
const multer = require("multer");

const Listing = require("../models/Listing");
const User = require("../models/User")

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

/* CREATE LISTING */
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
try {
    /* Taking the information from the form */
    const { creator, category,type,streetAddress,apartment,city,state,country,title,description,highlight,highlightDesc,price}=req.body;


    const listingPhotos = req.files 

    if (!listingPhotos) {
        return res.status(400).send("No file uploaded")
    }

    const listingPhotoPaths = listingPhotos.map((file)=> file.path)

    const newListing = new Listing( {
      creator,
      category,
      type,
      streetAddress,
      apartment,
      city,
      state,
      country,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,

    })

    await newListing.save()

    res.status(200).json(newListing)
}
catch(err) {
  res.status(409).json( { message: "Fail to create Listing", error:err.message })
  console.log(err);
  
}

});


/* Get the listing by category on home page */

router.get("/",async (req, res) => {
  const qCategory= req.query.category        // qCategory take from request query and request taken from category
  try{
    let listings
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate( "creator")
    }
    else{
      listings = await Listing.find().populate("creator")
    }
    res.status(200).json(listings)
  } catch(err){
    res.status(400).json({ message: "Fail to fetch Listing", error: err.message })
    console.log(err);
    
  }
})


/* get listings by search */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params

  try {
    let listings = []

    if (search === "all") {
      listings = await Listing.find().populate("creator")
    } else {
      listings = await Listing.find({
        $or: [
          { category: {$regex: search, $options: "i" } },  //$regex is mongodb operator that allows you to gives the regular expression patterns for matching.
          { title: {$regex: search, $options: "i" } },     //$options: "i" it is stands for case insensitive matching it means that if search should be caseinsensitive. if you type uppercase or lowercase doesn't matter its still like case insensitive. 
        ]
      }).populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})


/* space details API */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params
    const listing = await Listing.findById(listingId).populate("creator")
    res.status(200).json(listing)
  } catch (err) {
    res.status(404).json({ message: "Listing not found!", error: err.message })
  }
})

module.exports = router
