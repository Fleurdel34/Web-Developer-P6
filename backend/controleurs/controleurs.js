const sauces = require('../models/sauces');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
   const saucesObject = JSON.parse(req.body.sauces);
   delete saucesObject._id;
   delete saucesObject.userId;
   const sauce = new sauces({
        ...saucesObject,
        userId: req.body.auth.userId,
        imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

   });
   sauces.save()
        .then(()=>{res.status(201).json({message:'Objet enregistré'})})
        .catch(error => {res.status(400).json({error})});
    
    next();
};

exports.modifySauces =  (req, res, next) => {
    const saucesObject = req.file ?{
        ...JSON.parse(req.body.sauces),
        imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:{...req.body.sauces};
    delete saucesObject._userId;
    sauces.findOne({_id: req.params.id})
        .then((sauces) => {

            if(sauces.userId != req.auth.userId){
                res.status(403).json({message: 'Non authorisé!'});
            }else{
                sauces.updateOne({_id: req.params.id}, {...saucesObject, _id: req.params.id })
                    .then(()=>{res.status(200).json({message:'Objet modifié'})})
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
    next();
};

exports.deleteSauces =  (req, res, next) => {
    sauces.findOne({_id: req.params.id})
        .then((sauces) => {
            if(sauces.userId != req.auth.userId){
                res.status(403).json({message: 'Non authorisé!'});
            }else{
                const filename = sauces.imageURL.split('/images/')[1];
                fs.unlink(`images/${filename}`, () =>{
                    sauces.deleteOne({_id: req.params.id})
                        .then(()=>{res.status(200).json({message:'Objet supprimé'})})
                        .catch(error => res.status(401).json({ error }));
                })
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {

    sauces.find()
        .then( sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
    next();
};

exports.getOneSauce = (req, res, next) => {

    sauces.findOne({_id: req.params.id})
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};