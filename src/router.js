export function getRoutes(path,method,proxy) {
    if(method === 'POST'){
        if(proxy === 'order'){
            return 'createOrder'
        }
        if(proxy === 'updateOrder'){
            return 'updateOrder'
        }
        if(proxy === 'getPaymentConfirmation'){
            return 'getPaymentConfirmation'
        }
        return 'invalidRequest'
    }
    else if(method === 'GET'){
        if(proxy === 'getUser'){
            return 'getUser'
        }
        return 'invalidRequest'
    }
    return 'invalidRequest'

}
