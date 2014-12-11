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

var admins = [
    "758637690840380",   // Nohelia
    "863811930325042",   // Cristhian
    "10205290908290843", // Diego
    "10152916118601052", // Alvaro
    "331359500383553"    // Hans
];

function pushPaymentMethod(payment_method, creator, pulpi_email){
    var now = new Date();
    var result  = {
        payment_method: payment_method,
        used: false,
        creator: creator,
        pulpi_email: pulpi_email,
        createdAt: now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear() +" " + now.getHours() + ":" + now.getMinutes()
    };
    var new_push = guids.push(result);
    return new_push.key();
}
ref.onAuth(function(authData) {
    console.log( authData );
    if (authData) {
        // user authenticated with Firebase
        var fullName = findFullName(authData);
        document.querySelector('.avatar img')
            .setAttribute("src", findProfilePic(authData));
        
        if (authData.provider == "facebook" && admins.indexOf(authData.facebook.id) != -1  ){
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
                        var pulpi_email = $('input[name=pulpi_email]').val();
                        if(pulpi_email){
                            var key = pushPaymentMethod(payment_method, creator, pulpi_email);
                            $('#copy-code').append("<h3 style=\"text-transform: none;\">" + key.substring(1,key.length) + "   email: " + pulpi_email + "</h3>");
                        }
                        else{
                            alert("NO puede estar vacio");
                        }
                    });
                });
            // .addEventListener('click', function(){
            //     console.log("Me cliclearon el activation code");
            // });
        

            // console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
        }
    else{
        document.querySelector('.activation_codes').classList.add("hideThis");
        document.querySelector('.not_permitted').classList.remove("hideThis");
    }
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
