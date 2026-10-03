import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class BasketModel {
    private items: IProduct[] = [];

    constructor(private events: IEvents) {}

    // Возвращает массив товаров, которые находятся в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавляет товар в массив корзины
    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('basket:items:changed');
    }

    // Удаляет товар из массива корзины
    removeItem(product: IProduct): void {
        this.items = this.items.filter(item => item.id !== product.id);
        this.events.emit('basket:items:changed');
    }

    // Очищает корзину
    clear(): void {
        this.items = [];
        this.events.emit('basket:items:changed');
    }

    // Получает стоимость всех товаров в корзине
    getTotal(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price || 0);
        }, 0);
    }

    // Получает количество товаров в корзине
    getCount(): number {
        return this.items.length;
    }

    // Проверяет наличие товара в корзине по его id
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}
