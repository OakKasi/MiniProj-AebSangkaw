const API_URL ='http://10.0.2.2:8000';
export const submitOrder = async (orderPayload) => {
    try {
        const response = await fetch(`${API_URL}/api/orders`,{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(orderPayload)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error submitting order:", error);
        throw error;
    }
}