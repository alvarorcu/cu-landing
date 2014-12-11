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
var users = ref.child('users');

ref.onAuth(function(authData) {
    if (authData) {

        ref.child('users').child(authData.uid).once("value", function(snapshot){
            if(snapshot.val()){
                console.log("user already exists");
                console.log(snapshot.val());
            }
            else{
                console.log("Adding user");
                ref.child('users').child(authData.uid).set(authData); 
            }
        });

        document.querySelector('.avatar img')
            .setAttribute("src", findProfilePic(authData));
        
        $('.settings').click(function(){
            ref.unauth();
        });
        
        users.child(authData.uid).child('activated').once("value", function(activated){
            if(activated.val()){
                console.log("user is already activated, no need to show the activation input");
                $('.activation-code').remove();
                $('#contador').show("slow");
            }
            else{
                console.log("User is not Activated but we are just fooling around");
                $(".activation-code button").click(function(){
                    var activationCode = $(".activation-code input").val();
                    sendActivationCode(activationCode, authData);
                });
            }
        });

        $("#lean_overlay").fadeOut(200);
        $("#login").css({"display":"none"});

    } else {
        $("#go").leanModal();
        $("#go").trigger('click');
        document.querySelector('.avatar img')
            .setAttribute("src",
                          "../img/pict/avatar.png");
        
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
    var ref = new Firebase("https://core-upgrade.firebaseio.com");
    var guids = ref.child('guids');
    var users  = ref.child('users');
    
    guids.child('-' + activationCode)
        .once("value", function(activation_code){
            console.log(activation_code.val());
            if(activation_code.val()){
                if(!activation_code.val()['used']){
                    console.log("Codigo es valido y puede ser usado");
                    
                    ref.child('users')
                        .child(authData.uid)
                        .child('activated')
                        .once("value", function(activated){
                            if(activated.val()) {
                                console.log(activated.val());
                                console.log('user already activated');
                                alert("Usuario ya esta activado, no gaster tu codigo");
                            }
                            else {
                                console.log("Activating User");
                                users.child(authData.uid)
                                    .update({
                                        activated: true,
                                        activation_code: activationCode
                                    });
                                guids.child('-' + activationCode).update({used: true});
                                $('.activation-code').remove();
                                $('#contador').show("slow");
                                
                            }
                        });
                }
                else{
                    console.log('Codigo ya fue usado');
                }
            }
            else{
                console.log("NO activation ode found");
                alert("Codigo Incorreccto");
            }
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


$(function() {
    $("img.holi")
        .mouseover(function() { 
            var src = $(this).attr("src").replace(".png", "2.png");
            $(this).attr("src", src);
        })
        .mouseout(function() {
            var src = $(this).attr("src").replace("2.png", ".png");
            $(this).attr("src", src);
        });
});

function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}

preloadImages(["../img/pict/ticket2.png", "../img/pict/maker2.png", "../img/pict/packhs2.png"]);
