// Window resized
$(window).on('resize',function(){
    var slideHeight = $('.slick-track').innerHeight();
});

/* Page Loader : hide loader when all are loaded */
$(window).load(function(){
    $('.page-loader').addClass('hidden');
});

/* END OF Page Loader : hide loader when all are loaded */


/*************************************/
/** Here comes the Fire to the Base **/
/*************************************/

var ref = new Firebase("https://core-upgrade.firebaseio.com");
var guids = ref.child('guids');

var paymentMethods = {
    paypal: guids.child('paypal'),
    deposit: guids.child('deposit'),
    manual: guids.child('manual')
};
function pushPaymentMethod(payment_method, creator){
    var firebase_ref = paymentMethods[payment_method];
    var now = new Date();
    var result  = {
        used: false,
        creator: creator,
        createdAt: now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear() +" " + now.getHours() + ":" + now.getMinutes()
    };
    var new_push = firebase_ref.push(result);
    console.log(new_push.key());
}
ref.onAuth(function(authData) {
    console.log( authData );
    if (authData) {
        // user authenticated with Firebase
        var fullName = findFullName(authData);
        
        document.querySelector('.avatar img')
            .setAttribute("src", findProfilePic(authData));
        document.querySelector('.activation_codes')
            .classList.remove("hideThis");
        document.querySelector('.not_permitted')
            .classList.add("hideThis");

        $('.activation_codes .button')
            .each(function(key, value){
                console.log(value);
                var payment_method = $(value).attr('id');
                var creator = fullName;
                
                value.addEventListener('click', function(){
                    pushPaymentMethod(payment_method, creator);
                });
            });
        // .addEventListener('click', function(){
        //     console.log("Me cliclearon el activation code");
        // });
        

        // console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
    } else {
        document.querySelector('.avatar img')
            .setAttribute("src",
                          "../img/pict/avatar.jpg");
        document.querySelector('.activation_codes').classList.add("hideThis");
        document.querySelector('.not_permitted').classList.remove("hideThis");
    }
});

function userLogin(Provider){
    ref.authWithOAuthRedirect(Provider, function(err, authData){
        console.log(authData);
    },{
        rememberMe: true,
        scope: 'email'
    });
}
function findProfilePic(authData){
    var provider = authData.provider;
    if (provider == "facebook"){
        return "http://graph.facebook.com/" +
            authData.uid.split(":")[1] +
            "/picture?width=40&height=40";
    }
    else if (provider == "twitter"){
        return "http://avatars.io/twitter/"+authData.twitter.username +"?size=large";
    };
    
    return "Not found";
};
function findFullName(authData){
    var provider = authData.provider;
    if (provider == "facebook"){
        return authData.facebook.displayName;
    }
    else if (provider == "twitter"){
        return authData.twitter.displayName; 
    }
    return "Anonymous Frog";
}
