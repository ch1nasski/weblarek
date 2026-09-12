import { IBuyer } from '../../types/index';
import { EventEmitter } from '../base/Events';

export class BuyerModel extends EventEmitter {
    private buyer: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };

    constructor() {
        super();
    }

    // Обновляет данные покупателя (можно обновить только необходимые поля)
    setBuyerData(data: Partial<IBuyer>): void {
        this.buyer = { ...this.buyer, ...data };
        this.emit('buyer:changed', { buyer: this.buyer });
    }

    // Возвращает все данные покупателя
    getBuyerData(): IBuyer {
        return this.buyer;
    }

    // Очищает данные покупателя
    clearBuyerData(): void {
        this.buyer = {
            payment: '',
            email: '',
            phone: '',
            address: ''
        };
        this.emit('buyer:changed', { buyer: this.buyer });
    }

    // Валидирует данные покупателя
    // Возвращает объект с ошибками валидации (ключ - поле, значение - сообщение об ошибке)
    // Если все данные валидны, возвращает пустой объект
    validateBuyerData(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.buyer.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.buyer.email || this.buyer.email.trim() === '') {
            errors.email = 'Укажите email';
        }

        if (!this.buyer.phone || this.buyer.phone.trim() === '') {
            errors.phone = 'Укажите телефон';
        }

        if (!this.buyer.address || this.buyer.address.trim() === '') {
            errors.address = 'Укажите адрес';
        }

        return errors;
    }
}
