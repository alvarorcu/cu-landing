/* Page Loader : hide loader when all are loaded */
$(window).load(function(){
    $('.page-loader').addClass('hidden');

    $('.avatar-img img').click(function () {
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
            }
            else{
                console.log("Adding user");
                ref.child('users').child(authData.uid).set(authData); 
            }
        });

        var current_user = users.child(authData.uid);

        document.querySelector('.avatar img')
            .setAttribute("src", findProfilePic(authData));
        
        $('.settings').click(function(){
            ref.unauth();
            authData = null;
        });
        
        current_user.child('activated').once("value", function(activated){
            if(activated.val()){
                console.log("user is already activated, no need to show the activation input");
                $('.activation-code').remove();
                $('#contador').show("slow");
                var div = document.createElement('div');
                div.innerHTML = '<br><br><br><br><section class="content"><header class="p-title"><h6>Bienvenido al Core Upgrade. Vivamos la cuenta regresiva!.</h6></header><div class="clock clock-countdown"><div class="block"><div class="digit days">00</div><div class="text">días</div></div><div class="block"><div class="digit hours">00</div><div class="text">hors</div></div><div class="block"><div class="digit minutes">00</div><div class="text">mins</div></div><div class="block"><div class="digit seconds">00</div><div class="text">segs</div></div></div></section><br><br><br>';
                document.getElementById('herecontent').appendChild(div);
            }
            else{
                console.log("User not Activated, checking if he/she has been banned");
                current_user.child('banned').once("value", function(banned){
                    if(banned.val()){
                        
                        current_user.child('bannedAt').once("value",function(bannedAt){
                            if(bannedAt.val()){
                                console.log("bannedAt time: ", bannedAt.val());
                                var currentTime = new Date();
                                var elapsedTime = (currentTime.getTime() - bannedAt.val()) / 60000;
                                
                                
                                if(elapsedTime > 10){
                                    current_user.update({banned: false, strikes: 0});
                                    location.reload(); 
                                }
                                else{
                                    var remainingMinutes = (11 - elapsedTime).toString().split('.')[0];
                                    if(remainingMinutes > 1){
                                        $('.activation-code').html("<h2> Superaste los 3 intentos, vuelve en unos "+ remainingMinutes +" minutos! :) </h2>");
                                    }
                                    else{
                                        $('.activation-code').html("<h2> Superaste los 3 intentos, vuelve en 1 minuto! :) </h2>");
                                    }
                                    console.log("You have not passed 10 minutes yet, you have passed: ", elapsedTime);
                                }
                            }
                        });
                    }
                    else{
                        $(".activation-code button").click(function(){
                            var activationCode = $(".activation-code input").val();
                            sendActivationCode(activationCode, authData);
                        });
                    }
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
    var current_user = users.child(authData.uid);
    
    guids.child('-' + activationCode)
        .once("value", function(activation_code){
            if(activation_code.val()){
                console.log(activation_code.val());
                if(!activation_code.val()['used']){
                    console.log("Codigo es valido y puede ser usado");
                    
                    current_user
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
                    alert('Codigo ya fue usado');
                    strikeUp(current_user);
                }
            }
            else{
                alert.log("Ese codigo no fue encontrado en nuestra base de datos");
                strikeUp(current_user);
            }
        });

}

function strikeUp(current_user){
    current_user.child('strikes').once("value",function(strikes){
        if(strikes.val()) {
            if(strikes.val() == 3){
                var now = new Date();
                current_user.update({banned: true, bannedAt: now.getTime()});
                location.reload();
            }
            else{
                current_user.update({strikes: strikes.val()+1}, function(error){
                    if(error){
                        console.log("Synchronization failed at strikes");
                    }
                    else {
                        console.log("Tienes: " + strikes.val() + " strikes");
                    }
                });
            }
        }
        else{
            console.log("Got 1 strike!");
            current_user.update({strikes: 1});
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



$(function() {
    $("a[rel*=modalMsj]").modalMsj();       
});


