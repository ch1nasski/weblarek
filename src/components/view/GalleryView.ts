import { IEvents } from '../base/Events';
import { BaseView } from './BaseView';

export interface IGalleryViewState {
    items: HTMLElement[];
}

export class GalleryView extends BaseView<IGalleryViewState> {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}