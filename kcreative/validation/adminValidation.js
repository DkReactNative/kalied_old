const { check } = require('express-validator');

const login = ()=>{

	return [ 
        check('email', 'Valid email is required.').exists().isEmail(),
        check('password','Password is required.').exists()
       ];
}


const cms = (method) => {

	switch(method){

		case 'create': {
		     return [ 
		        check('title').exists().withMessage('Title is required.'),
		        check('subject').exists().withMessage('Subject is required.'),
		        check('slug').exists().withMessage('Slug is required.'),
		        check('description').exists().withMessage('Description is required.')
		       ]
		}
	}
}

module.exports = {
	login,
	cms
}
