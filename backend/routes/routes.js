/*creation des différentes requetes pour les sauces*/

const express = require('express');
const router = express.Router();

const multer= require('../middleware/multer-config');
const auth = require('../middleware/middlewareAuth');
const controllers = require('../controleurs/controleurs');


router.post('/', auth, multer, controllers.createSauces);
router.get('/', auth, controllers.getAllSauces);
router.get('/:id', auth, controllers.getOneSauces);
router.put('/:id', auth, multer, controllers.modifySauces);
router.delete('/:id', auth, controllers.deleteSauces);



module.exports = router;
