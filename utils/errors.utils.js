module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: ''}

    if (err.message.includes('pseudo'))
        errors.pseudo = 'Pseudo incorrect ou deja pris'

    if (err.message.includes('email'))
        errors.email = 'Email incorrect'
    
    if (err.message.includes('password'))
        errors.password = 'Le mot de passe doit faire 6 caractères minimum'

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
    errors.pseudo = "Cet pseudo est déjà pris"

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
    errors.email = "Cet email est déjà enregistré"

    return errors
}

module.exports.signInErrors = (err) => {
    let errors = {email: '', password: ''}

    if (err.message.includes('email')) 
        errors.email = 'Email inconnu'

    if (err.message.includes('password')) 
        errors.password = 'Le mot de passe ne correspond pas'

    return errors
}

module.exports.uploadErrors = (err) => {
    let errors = { format: '', mawSize: ''}

    if (err.message.includes('invalid file'))
    errors.format = 'Format incompatible'

    if (err.message.includes('max size'))
    errors.maxSize = 'Le fichier depasse 500ko'

    return errors
}