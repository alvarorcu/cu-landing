/* Page Loader : hide loader when all are loaded */
$(window).load(function(){
    $('.page-loader').addClass('hidden');

    var islogin = false;

    if(!islogin){
        $("#go").leanModal();
        $("#go").trigger('click');
    }
});

/* END OF Page Loader : hide loader when all are loaded */


/*************************************/
/** Here comes the Fire to the Base **/
/*************************************/

var ref = new Firebase("https://core-upgrade.firebaseio.com");

ref.onAuth(function(authData) {
    console.log( "authData" );
    if (authData) {
        // user authenticated with Firebase

        document.querySelector('.avatar img')
            .setAttribute("src", findProfilePic(authData));
        
        // console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);

        
    } else {
        
        document.querySelector('.avatar img')
            .setAttribute("src",
                          "../img/pict/avatar.jpg");
        
    }
});

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
