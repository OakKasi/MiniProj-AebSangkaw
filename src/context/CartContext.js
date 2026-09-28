import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cart,setCart] = useState([]);

    const addToCart = (productToAdd) =>{
        setCart((prev)=>{
            const exitindex = prev.findIndex(item => item.id === productToAdd.id);

            if(exitindex > -1){
                return prev.map((item,index) => 
                index === exitindex
                    ?{...item,quantity:item.quantity+1}
                    : item
                );
            }
            return [...prev,{...productToAdd,quantity:1}];
        }) ;
    };
    const updateQuantity = (productId, amount) => {
    setCart((prev) => 
        prev.map((item) => {
            if (item.id === productId) {
                const newQty = item.quantity + amount;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item; 
        })
    );
};

    const getTotalPrice = ()=>{
        return cart.reduce((total,item)=>{
            return total + item.price * item.quantity;
        },0);
    };

    const removeFromCart = (productId)=>{
        setCart((prev)=> prev.filter((item)=>item.id !== productId));
    };

    const clearCart =() =>{
        setCart(()=>[]);
    };

    
    return (
        <CartContext.Provider value={{ cart ,addToCart,updateQuantity,getTotalPrice,removeFromCart,clearCart}}>
            {children}
        </CartContext.Provider>
    );
}