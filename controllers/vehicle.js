const User = require("../models/User");
const mime = require('mime');
const fs = require('fs');

exports.addVehicle = (req, res) => {
  if (!req.query.email) {
    return res.status(400).send({ msg: 'You need to send email' });
  }

  User.findOne({ email: req.query.email }, (err, user) => {
    if (err) {
      return res.status(400).send({ msg: err });
    }

    if (!user) {
      return res.status(400).json({ msg: 'The user does not exist' });
    }
    var matches = req.body.img.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {}; 
    if (matches?.length !== 3) {
        return res.status(400).send({
            msg: "Invalid Image"
        });
  
    }  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);
    let fileName = user._id + '-vehicle-' + user.vehicles.length + '.' + extension;
    try {
        fs.writeFileSync("./assets/images/" + fileName, imageBuffer, 'utf8');
        let vehicle = {
            ...req.body,
            img : "images/" +  fileName
        }
        user.vehicles.push(vehicle)
        user.save()
        .then(result=>{
          return res.status(200).send({message: "Vehicle Added successfully", data: result})
        })
        .catch(err => {
          return res.status(400).send({message: "Some error occured , please try again"})
        });
    } catch (e) {
        return res.status(400).send({
            msg: e
        });
    }
  })
};

exports.getVehicleById = (req, res) => {
  if (!req.query.email) {
    return res.status(400).send({ msg: 'You need to send email' });
  }

  User.findOne({ email: req.query.email }, (err, user) => {
    if (err) {
      return res.status(400).send({ msg: err });
    }

    if (!user) {
      return res.status(400).json({ msg: 'The user does not exist' });
    }
    return res.status(200).send({vehicles: user.vehicles})
  })
};
  