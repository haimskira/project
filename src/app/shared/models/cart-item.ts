export interface CartItem {
    product: {
        id: number;
        image: string;
        name: string;
        type: string;
        color: string;
        price: number;
    };
    quantity: number;
    price: number;
}