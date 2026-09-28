const API_URL ='http://10.0.2.2:8000';
export const loginApi = async (username,password)=>{
    const response = await fetch (`${API_URL}/api/auth/login`,{
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username,password})
    });
    if (!response.ok){
        throw new Error("login failed");
    }
    return await response.json();
};

export const registerApi = async (username,password,phonenumber,role = 'customer')=>{
    const response = await fetch (`${API_URL}/api/auth/register`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username,password,phonenumber,role})
    });
    if (!response.ok){
        throw new Error("register failed");
    }
    return await response.json();
};