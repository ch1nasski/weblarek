import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class BaseView<T> extends Component<T> {
    protected constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }
}