export default class CartItemModel{
    
    constructor(productID, userID, quantity, id){
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
        this.id = id;
    }

    static add(productID, userID, quantity){
        const cartItem = new CartItemModel(productID, userID, quantity);
        cartItem.id = cartItems.length + 1;
        cartItems.push(cartItem);
        return cartItem;
    }

    static get(userID){
        const items = cartItems.filter((i)=>i.userID==userID);
        return items;
    }

    static delete(cartItemID, userID){
        const indexOfItem = cartItems.findIndex(i=>i.id==cartItemID && i.userID==userID);
        if(indexOfItem==-1){
            return "Item not found"
        }else{
            cartItems.splice(indexOfItem, 1);
        }
    }
}

var cartItems = [
    new CartItemModel(1, 2, 1, 1),
    new CartItemModel(1, 1, 2, 2)
]