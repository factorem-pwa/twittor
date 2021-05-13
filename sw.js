// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE      = 'static-v2';
const DYNAMIC_CACHE     = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener( 'install', e=>{

    const cacheSt = caches.open( STATIC_CACHE ).then (cache =>
        cache.addAll( APP_SHELL ));

    const cacheInm = caches.open( INMUTABLE_CACHE ).then (cache =>
        cache.addAll( APP_SHELL_INMUTABLE ));
    
    e.waitUntil( Promise.all([ cacheSt, cacheInm ]));
});


self.addEventListener('activate', e=>{

    const resp = caches.keys().then( keys => {
        
        keys.forEach( key => {
            if ( key !== STATIC_CACHE && key.includes('static-v')){
                return caches.delete( key );
            }
        });

    });

    e.waitUntil ( resp );
});

self.addEventListener ( 'fetch', e=>{


    const resp = caches.match( e.request ).then ( res => {
        if (res){
            return res;
        }
        else{
            return fetch( e.request ).then (newRes => {
                return actualizarCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
            });
        }
    });

    e.respondWith( resp );

});

