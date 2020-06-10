import React from 'react';
import { Item } from '../../Item';

interface ItemsProps {
    item: Item;
}

const Items: React.FC<ItemsProps> = (props) => {
    return (
        <li>
            <img src={ props.item.image_url } alt={ props.item.title } />
            <span>{ props.item.title }</span>
        </li>
    );
}

export default Items;