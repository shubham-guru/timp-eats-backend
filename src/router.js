export function getRoutes(path,method,proxy) {
    if(method === 'POST'){
        if(proxy === 'order'){
            return 'createOrder'
        }
        if(proxy === 'updateOrder'){
            return 'updateOrder'
        }
        if(proxy === 'checkout'){
            return 'checkout'
        }
        if(proxy === 'getPaymentConfirmation'){
            return 'getPaymentConfirmation'
        }
        return 'invalidRequest'
    }
}
