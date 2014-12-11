/* Page Loader : hide loader when all are loaded */
$(window).load(function(){
    $('.page-loader').addClass('hidden');

    $('.avatar-img img').click(function () {
        console.log( "img", this );
        $('.settings').slideToggle();
    });
});

/* END OF Page Loader : hide loader when all are loaded */


/*************************************/
/** Here comes the Fire to the Base **/
/*************************************/

var ref = new Firebase("https://core-upgrade.firebaseio.com");

ref.onAuth(function(authData) {
    if (authData) {
        // user authenticated with Firebase

        document.querySelector('.avatar img')
            .setAttribute("src", findProfilePic(authData));
        
        $('.settings').click(function(){
            ref.unauth();
        });

        $("#lean_overlay").fadeOut(200);
        $("#login").css({"display":"none"});

    } else {
        $("#go").leanModal();
        $("#go").trigger('click');
        document.querySelector('.avatar img')
            .setAttribute("src",
                          "../img/pict/avatar.jpg");
        
    }
          });

$('.facebook').click(function(){
    userLogin("facebook");
});

$('.twitter').click(function(){
    userLogin("twitter");
});

function userLogin(Provider){
    ref.authWithOAuthRedirect(Provider, function(err, authData){
        console.log(authData);
    },{
        rememberMe: true,
        scope: 'email'
    });
}
function sendActivationCode(activationCode, authData){

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

$(function() {
        $("img.holi")
            .mouseover(function() { 
                var src = $(this).attr("src").match(/[^\.]+/) + "2.png";
                $(this).attr("src", src);
            })
            .mouseout(function() {
                var src = $(this).attr("src").replace("2.png", ".png");
                $(this).attr("src", src);
            });
        });
