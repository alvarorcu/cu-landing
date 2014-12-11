// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Window resized

$(window).on('resize',function(){
     var slideHeight = $('.slick-track').innerHeight();
});

/*************************************/
/******* Add twitter functions *******/
/*************************************/
// Include the Twitter Library
window.twttr = (function (d,s,id) {
  var t, js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
  js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
  return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
}(document, "script", "twitter-wjs"));

var stateTw = false;
// On ready, register the callback...
twttr.ready(function (twttr) {
    twttr.events.bind('tweet', function (event) {
        // your callback action here...
        stateTw = true;
    });
});


/*************************************/
/******* Add fb sdk functions ********/
/*************************************/
window.fbAsyncInit = function() {
    FB.init({
        appId      : '1584684295095074',
        status     : true, 
        cookie     : true,
        xfbml      : true,
        version    : 'v2.2'
    });
};
 
 
function postfb(authData)
{
    var success = false;
    FB.ui(
        {
            method: 'stream.publish',
            message: 'Hackspace',
            attachment: {
                name: 'Core Upgrade - Hackspace 2015',
                caption: 'Core Upgrade - Hackspace 2015',
                description: (
                    'He ingresado al Core Upgrade - Hackspace 2015, tú también se parte de esta gran experiencia ingresa ahora te esperamos. '
                ),
                href: 'alvarorcu.github.io/cu-landing',
                picture: 'https://fbcdn-photos-d-a.akamaihd.net/hphotos-ak-xpa1/t39.2081-0/p128x128/10574696_1584699925093511_967030902_n.png'
            },
            action_links: [
                { text: 'Se parte de esta gran experiencia', href: 'alvarorcu.github.io/cu-landing' }
            ],
            user_prompt_message: 'Ingresa al Core Upgrade - Hackspace 2015'
        },
        function(response) {
            if (response && response.post_id) {
                ref.child('users').child(authData.uid).update({postedAlready: true});
                window.location = "packs";
            }
            else
                alert('Compartir es bueno, no queieres compartir este genial entrenamiento con tus amiwis?');

        }
    );
    return success;
}

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

/*************************************/
/** Here comes the Fire to the Base **/
/*************************************/

var ref = new Firebase("https://core-upgrade.firebaseio.com");

ref.onAuth(function(authData) {
    console.log( authData );
    if (authData) {
        // Saving data if not stored already
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

        // console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
        // console.log(authData);
        ref.child('users')
            .child(authData.uid)
            .child('postedAlready')
<<<<<<< HEAD
            .on("value",
                function(postedAlready){
                    // Do stuff if user has already posted
                    if (postedAlready.val()){
                        console.log('there is a child postedAlready');
                    }
                    else {
                        console.log("There is no child posted YET!");
                        if (authData.provider == "facebook"){
                            if(postfb()){
                                ref.child('users').child(authData.uid).update({postedAlready: true});
                                window.location = "packs";
                            }
                            else{
                            }
                        }
                        if (authData.provider == "twitter"){
                            if(stateTw){
                                ref.child('users').child(authData.uid).update({postedAlready: true});
                                window.location = "packs";
                            }
                            else{
                            }
                        }
                    }
                });

        $('.invite')[0].innerHTML =  "Compartir es amar ;)";
=======
            .once("value",
                 function(postedAlready){
                     // Do stuff if user has already posted
                     if (postedAlready.val()){
                         console.log('there is a child postedAlready');
                     }
                     else {
                         console.log("There is no child posted YET!");
                         if (authData.provider == "facebook"){
                             postfb(authData);
                         }
                         if (authData.provider == "twitter"){
                             window.open("https://twitter.com/intent/tweet?&screen_name=hackspaceperu&text=Estoy%20viviendo%20la%20gran%20experiencia%20Core%20Upgrade%20-%20Hackspace%202015&url=http://core-upgrade.dev:3000","","toolbar=no, scrollbars=yes, titlebar=no, menubar=no, resizable=yes, width=800, height=400");
                             window.location = "packs";
                         }
                     }
                 });

        $('.invite')[0].innerHTML =  "Compartelo con tus amigos";
<<<<<<< HEAD
>>>>>>> master
=======
>>>>>>> master

        $('.navbar-login')[0].innerHTML = findFullName(authData) + "<i class=\"ion-person\"></i>";
        $('.navbar-login').attr('href', 'packs');
        
        $('.facebook').unbind('click');
        $('.facebook').click(function(){
            postfb(authData);
        });
        
        $('.twitter').unbind('click');
        $('.twitter').click(function(){
        });
        
    } else {
        // user is logged out
        $('.navbar-login').innerHTML = "INGRESAR <i class=\"ion-log-in\"></i>";
        $('.navbar-login').attr('href', '#login');

        $('.facebook').unbind('click');
        $('.facebook').click(function(){
            userLogin("facebook");
        });
        
        $('.twitter').unbind('click');
        $('.twitter').click(function(){
            userLogin("twitter");
        });
    }
});
    
function userLogin(Provider){
    ref.authWithOAuthRedirect(Provider, function(err, authData){
        console.log(authData);
    },{
        rememberMe: true,
        scope: 'email, publish_stream'
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

/** Clock **/

var dateReadableText = 'Upcoming date';
if($('.site-config').attr('data-date-readable') && ($('.site-config').attr('data-date-readable') != '')){
    $('.timeout-day').text('');
    dateReadableText = $('.site-config').attr('data-date-readable');        
    $('.timeout-day').text(dateReadableText);
}
$('.clock-countdown').downCount({
    date: $('.site-config').attr('data-date'),
    offset: +10
}, function () {
    //callback here if finished
    //alert('YES, done!');
    var zerodayText = 'An upcoming date';
    if($('.site-config').attr('data-zeroday-text') && ($('.site-config').attr('data-zeroday-text') != '')){
        $('.timeout-day').text('');
        zerodayText = $('.site-config').attr('data-zeroday-text'); 
    }
           
    $('.timeout-day').text(zerodayText);
   
}); 

/** Customization **/

var background = '#ccc';
var backgroundMask = 'rgba(255,255,255,0.92)';
var backgroundVideoUrl = 'none';

if($('.site-config').attr('data-background') && ($('.site-config').attr('data-background') != '')){
    background = $('.site-config').attr('data-background');
    //    if(background.indexOf('http') >= 0){  
    //        //disable video background for smallscreen
    //        if($(window).width() > 640){
    //            $('.cover-bg').css({"opacity":"0"});
    //            $('.cover-bg').css({"visibility":"hidden"});
    //            backgroundVideoUrl = background;
    //            
    //        }
    //    }
    if(background.indexOf('url(') >= 0){        
        $('.cover-bg').css({"background-image":background});
    }
    else{
        $('.cover-bg').css({"background":background});
    }
}
if($('.site-config').attr('data-background-mask') && ($('.site-config').attr('data-background-mask') != '')){
    backgroundMask = $('.site-config').attr('data-background-mask');
    if(backgroundMask.indexOf('url(') >= 0){        
        $('.cover-bg-mask').css({"background-image":backgroundMask});
    }
    else{
        $('.cover-bg-mask').css({"background":backgroundMask});
    }
}

/** Static video background **/
$(function(){
    // Helper function to Fill and Center the HTML5 Video
    $('.video-container video, .video-container object').maximage('maxcover');
});
/** youtube / vimeo background */
$(function(){
    if(backgroundVideoUrl != 'none'){
        
        //disable video background for smallscreen
        if($(window).width() > 640){
        
            $.okvideo({ source: backgroundVideoUrl,
                        adproof: true
                    
                      });
        }
    }
});



/** Init fullpage.js */
$(document).ready(function() {
    $('#mainpage').fullpage({
        //        verticalCentered: true,
            anchors: ['inicio', 'curricula', 'aquien' , 'login', 'nosotros', 'contacto'],
        //        menu: '.mm',
        //        resize : false,
        css3: true,
        navigation: true
    });
});


/** Clock **/

var dateReadableText = 'Upcoming date';
if($('.site-config').attr('data-date-readable') && ($('.site-config').attr('data-date-readable') != '')){
    $('.timeout-day').text('');
    dateReadableText = $('.site-config').attr('data-date-readable');        
    $('.timeout-day').text(dateReadableText);
}
$('.clock-countdown').downCount({
    date: $('.site-config').attr('data-date'),
    offset: +10
}, function () {
    //callback here if finished
    //alert('YES, done!');
    var zerodayText = 'An upcoming date';
    if($('.site-config').attr('data-zeroday-text') && ($('.site-config').attr('data-zeroday-text') != '')){
        $('.timeout-day').text('');
        zerodayText = $('.site-config').attr('data-zeroday-text'); 
    }
           
    $('.timeout-day').text(zerodayText);
   
}); 



/* Smoth scroll a links */
var $root = $('html, body');
$('a.s-scroll').click(function() {
    var href = $.attr(this, 'href');
    $root.animate({
        scrollTop: $(href).offset().top
    }, 500, function () {
        window.location.hash = href;
    });
    return false;
});


/* Page Loader : hide loader when all are loaded */
$(window).load(function(){
    $('.page-loader').addClass('hidden');
});

/* END OF Page Loader : hide loader when all are loaded */
