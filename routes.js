/**
 * Created by Michael on 4/22/2015.
 */
// grab the nerd model we just created
module.exports = function (app) {

    // server routes
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/nerds', function (req, res) {

        // use mongoose to get all nerds in the database
        res.json('hello');
    });

    app.post('/api/login', function (req, res) {
        if(req.body.email=='a@a.a' && req.body.password=='a'){
            res.status(200).json({
                email:req.body.email,
                ridesToRank:3,
                token:'123'
            });
        }else{
            console.log('wrong username password')
            res.status(404).json({
                message:'user  not found'
            });
        };
    })
    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes 
    // route to handle all angular requests
    //app.get('*', function(req, res) {
    //    res.sendfile('./public/index.html'); // load our public/index.html file
    //});

};
