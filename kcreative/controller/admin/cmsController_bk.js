var user = require('./../../model/cmsModel');

const index = function(req, res){

    var allUsers = user.find().exec(function(err,result){

        if(err){

            res.json({

               status: "fail",
                message: err  
            });
        }

        res.json({
            status: "success",
            message: "all users retrieved successfully",
            data:result
        });
    });
    
}


const add = function(req, res){
    //console.log(JSON.stringify(req.body)+'prita');
    var newUser = new user();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
   // console.log(newUser);
    newUser.save(function(err){

        if(err){

            res.json({

               status: "fail",
                message: err  
            });
        }

        res.json({
            status: "success",
            message: "users created successfully",
            data:newUser
        });
    });

	
}

const view = function(req, res){
    console.log(req.params);
    var user_id = req.params.user_id;
    var userDetail = user.find({_id:user_id}).exec(function(err, result){
        console.log(result);
       if(err){

            res.json({

               status: "fail",
                message: err  
            });
        }

        res.json({
            status: "success",
            message: "user detail view successfully",
            data:result
        }); 
    });

	
}

const delete1 = function(req, res){

	console.log(res);

	res.status(200).json({
            status: "success",
            message: "user detail deleted successfully"
        });
}

const update = function(req, res){

	res.status(200).json({
            status: "success",
            message: "user detail updated successfully"
        });
}

module.exports={
    index,
    add,
    view,
    update,
    delete1
}