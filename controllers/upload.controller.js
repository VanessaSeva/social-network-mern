const UserModel = require('../models/user.model')
const fs = require('fs')
const { promisify } = require('util')
const { uploadErrors } = require('../utils/errors.utils')
const pipeline = promisify(require('stream').pipeline)

module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.file.detectedMimeType !== 'image/jpg' &&
            req.file.detectedMimeType !== 'image/png' &&
            req.file.detectedMimeType !== 'image/jpeg'
        )
        throw Error('Invalid File')

        if (req.file.size > 500000) throw Error('max size')
    } catch (err) {
        const errors = uploadErrors
        return res.status(201).json(errors)
    }

    const fileName = req.body.name + '.jpg'  // les photos seront uniques

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${_dirname}/../client/public/uploads/profil/${fileName}`// on lui passe un chemin pour stocker
        )   
    )

    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set : { picture: './uploads/profil/' + fileName}},
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if (!err) return res.send(docs)
                else return res.status(500).send({ message: err })
            }
        )
    } catch (err) {
        return res.status(500).send({ message: err })
    }
}