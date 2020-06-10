import React from 'react';
import Items from '../Items';
import { Item } from '../../Item';
import './styles.css';

interface ItemsListProps {
    items: Item[];
}


const ItemsList: React.FC<ItemsListProps> = (props) => {
    return (
        <ul className="items-grid">
            {props.items.map(item => <Items item={item} key={item.id}/>)}
        </ul>
    );
}

export default ItemsList;