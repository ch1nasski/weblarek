export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;
}

// Тип ответа сервера при получении списка товаров
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

// Тип данных заказа, отправляемых на сервер
export interface IOrderData extends IBuyer {
    payment: TPayment;
    items: string[];  // массив id товаров
    total: number;
}

// Тип ответа сервера при оформлении заказа
export interface IOrderResponse {
    id: string;
    total: number;
}

// Тип ошибок валидации данных покупателя
export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;
