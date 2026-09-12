import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class BasketModel extends EventEmitter {
    private items: IProduct[] = [];

    constructor() {
        super();
    }

    // Возвращает массив товаров, которые находятся в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавляет товар в массив корзины
    addItem(product: IProduct): void {
        this.items.push(product);
        this.emit('basket:changed', { items: this.items });
    }

    // Удаляет товар из массива корзины
    removeItem(product: IProduct): void {
        this.items = this.items.filter(item => item.id !== product.id);
        this.emit('basket:changed', { items: this.items });
    }

    // Очищает корзину
    clear(): void {
        this.items = [];
        this.emit('basket:changed', { items: this.items });
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
