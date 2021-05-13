
// Guardar en el caché dinámico
function actualizarCacheDinamico(dynamicCache, req, resp){

    if (resp.ok){
        caches.open(dynamicCache).then( cache => {
            cache.put( req, resp.clone() );

            return resp.clone();
        });
    } else {
        return resp;
    }
}