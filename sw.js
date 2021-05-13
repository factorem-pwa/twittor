// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE      = 'static-v2';
const DYNAMIC_CACHE     = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/main.css',
    'css/horizontal-menu.css',
    'img/favicon.ico',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css',
    'js/libs/jquery.js',
    'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.min.js'
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

