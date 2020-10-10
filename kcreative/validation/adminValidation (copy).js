const { check } = require('express-validator');

const login = ()=>{

	return [ 
        check('email', 'Valid email is required.').exists().isEmail(),
        check('password','Password is required.').exists()
       ];
}

module.exports = {
	login
}
