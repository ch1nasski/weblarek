import { IProduct } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class CatalogModel extends EventEmitter {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor() {
        super();
    }

    // Сохраняет переданный массив товаров в модель
    setProducts(products: IProduct[]): void {
        this.products = products;
        this.emit('catalog:changed', { products: this.products });
    }

    // Возвращает массив всех товаров из каталога
    getProducts(): IProduct[] {
        return this.products;
    }

    // Получает один товар по его id
    getProduct(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    // Сохраняет товар для подробного отображения
    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.emit('product:selected', { product: this.selectedProduct });
    }

    // Получает товар для подробного отображения
    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
