import { Component } from '../base/Component';

export abstract class CardView<T> extends Component<T> {
    protected constructor(container: HTMLElement) {
        super(container);
    }
}