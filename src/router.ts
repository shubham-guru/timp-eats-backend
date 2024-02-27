export function getRoutes(path:string,method:string,proxy:string) {
    if(method === 'POST'){
        if(proxy === 'order'){
            return 'createOrder'
        }
        if(proxy === 'updateOrder'){
            return 'updateOrder'
        }
        return 'invalidRequest'
    }else if(method === 'GET'){
        if(proxy === 'getKey'){
            return 'getPaymentKey'
        }
        if(proxy === 'getPaymentConfirmation'){
            return 'getPaymentConfirmation'
        }
        return 'invalidRequest'
    }
}
