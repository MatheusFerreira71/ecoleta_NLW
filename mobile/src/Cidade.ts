import { UF } from './UF';
export interface Cidade {
    id: number,
    nome: string,
    microrregiao: {
        id: number,
        nome: string,
        mesoregiao: {
            id: number,
            nome: string,
            UF: UF
        }
    }
}