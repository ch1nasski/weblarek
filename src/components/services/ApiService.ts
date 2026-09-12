import { IApi, IProductsResponse, IOrderData, IOrderResponse } from '../../types/index';

export class ApiService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // Получает список товаров с сервера
    async getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    // Отправляет данные заказа на сервер и получает подтверждение
    async submitOrder(orderData: IOrderData): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', orderData);
    }
}
