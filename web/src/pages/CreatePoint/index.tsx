import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import { Item } from '../../Item';
import { UF } from '../../UF';
import axios from 'axios';
import { Cidade } from '../../Cidade';
import { LeafletMouseEvent } from 'leaflet'
import Swal from 'sweetalert2'

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState('0');
    const [buttonEnabler, setButtonEnabler] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    useEffect(() => {
        if(selectedPosition[0] !== 0 && selectedPosition[0] && selectedItems.length > 0) {
            setButtonEnabler(false);
        } else {
            setButtonEnabler(true);
        }
    }, [selectedPosition, selectedItems]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.indexOf(id);
        if (alreadySelected === -1) {
            setSelectedItems([...selectedItems, id]);
        } else {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems)
        }
    }

    async function handleSubmit (event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp } = formData;
        const [ latitude, longitude ] = selectedPosition;
        const data = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city: selectedCity,
            uf: selectedUf,
            items: selectedItems
        }
        await api.post('points', data);
        Swal.fire(
            'Parabéns',
            'Ponto de coleta criado com sucesso!',
            'success'
        ).then(() => {
            history.push('/');
        })
    }

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        }, () => {
            setInitialPosition([-20.5375169, -47.4000366])
        });
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(initial => initial.sigla);
            setUfs(ufInitials.sort());
        })
    }, []);

    useEffect(() => {
        axios.get<Cidade[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const ufCities = response.data.map(city => city.nome);
            setCities(ufCities.sort());
        })
    }, [selectedUf]);

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select value={selectedUf} onChange={handleSelectUf} name="uf" id="uf" required>
                                <option value="">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectCity} value={selectedCity} required>
                                <option value="">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : ''}
                            key={item.id}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>))}
                    </ul>
                </fieldset>
                <button type="submit" disabled={buttonEnabler}>
                    Cadastrar Ponto de Coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;