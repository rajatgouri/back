const User = require("../models/User");
const Ride = require("../models/Ride");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.getUsers = (req, res) => {
    try {
        User.find({ $or: [{ role: 'user' }, { role: 'driver' }] }, (err, users) => {
            if (err) {
                return res.status(400).json({ msg: err });
            }

            if (users) {
                return res.status(200).json({ users: users });
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: e });
    }
};

exports.getUserById = (req, res) => {
    try {
        User.findById(req.query.id, (err, users) => {
            if (err) {
                return res.status(400).json({ msg: err });
            }

            if (users) {
                return res.status(200).json({ user: users });
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: e });
    }
};

exports.approveUser = (req, res) => {
    try {
        User.findById(req.body.id, (err, user) => {
            if (err) {
                return res.status(400).json({ msg: err });
            }

            if (user) {
                user.isIdApproved = true ;
                user.rejected = false;
                user.save()
                .then((result)=>{
                    return res.status(200).json({ msg: "User Approved" });
                })
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: e });
    }
};


exports.reject = (req, res) => {
    try {
        User.findById(req.query.id, (err, user) => {
            if (err) {
                return res.status(400).json({ msg: err });
            }

            if (user) {
                const msg = {
                    to: user.email,
                    from: process.env.SENDGRID_EMAIL, // Change to your verified sender
                    subject: 'Carpooling Profile Rejected',
                    text: 'Carpooling Profile Rejected',
                    html: `<h1>Profile RejectedP</h1>
                           <pre>Your profile is rejected becase ${req.body.formData.message} </pre>`,
                  }
                  sgMail.send(msg)
                  .then(info => {
                    user.rejected = true ;
                    user.isIdSubmitted = false ;
                    user.save()
                    .then((result)=>{
                        return res.status(200).json({ msg: "User Rejected" });
                    })
                  })
                  .catch(err => {
                    return res.status(400).send({msg: "Some error occured"})
                  });
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: e });
    }
};

exports.getAdminRides = (req, res) => {
    try {
        Ride.find({}, (err, rides) => {
            if (err) {
                return res.status(400).json({ msg: err });
            }

            if (rides) {
                return res.status(200).json({ adminRides: rides });
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: e });
    }
};

exports.getAdminRide = (req, res) => {
    try {
        Ride.findById(req.query.id, (err, ride) => {
            if (err) {
                return res.status(400).json({ msg: err });
            }

            if (ride) {
                return res.status(200).json({ adminRide: ride });
            }
        });
    } catch (e) {
        return res.status(400).json({ msg: e });
    }
};