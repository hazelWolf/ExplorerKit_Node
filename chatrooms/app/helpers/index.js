'use strict';
const router = require('express').Router();
const db = require('../db');
// Iterate through the routes object and mount the routes
let _registerRoutes = (routes, method) => {
    for (let key in routes) {
        if (typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
            _registerRoutes(routes[key], key);
        }
        else {
            // Register the routes
            if (method === 'get') {
                router.get(key, routes[key]);
            }
            else if (method === 'post') {
                router.post(key, routes[key]);
            }
            else{
                router.use(routes[key])
            }
        }
    }
}

let route = routes=> {
    _registerRoutes(routes);
    return router;
}

// Find a single document based on id
let findOne = profileId => {
    return db.userModel.findOne({'profileId': profileId});
}

let createNewUser = profile =>{
        let newChatUser = new db.userModel({
            profileId : profile.id,
            fullName: profile.displayName,
            profilePic : profile.photos[0].value || ""
        })

        return newChatUser.save()
}


// Returns promise of results for find
let findById = id =>{
     return db.userModel.findById(id)
};


// A middleware function to see if user is authenticated and logged in 
let  isAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/');
    }
}

module.exports = {
    route, 
    findOne,
    createNewUser,
    findById,
    isAuthenticated
}


