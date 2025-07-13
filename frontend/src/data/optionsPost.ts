
interface Option {
  id: string | number;
  label: string;
  value: string;
}

export const options: Option[] = [
    { id: 'MOTOR', label: 'Motor', value: 'Motor' },
    { id: 'MINISPLIT', label: 'Minisplit', value: 'Minisplit' },
    { id: 'LAVADORA', label: 'Lavadora', value: 'Lavadora' },
    { id: 'VENTILADOR', label: 'Ventilador', value: 'Ventilador' },
    { id: 'SECADORA', label: 'Secadora', value: 'Secadora' },
    { id: 'REFRIGERADOR', label: 'Refrigerador', value: 'Refrigerador' },
    { id: 'ESTUFA', label: 'Estufa', value: 'Estufa' },
    { id: 'HORNO', label: 'Horno', value: 'Horno' },
    { id: 'MICROONDAS', label: 'Microondas', value: 'Microondas' },
    { id: 'LICUADORA', label: 'Licuadora', value: 'Licuadora' },
    { id: 'BATIDORA', label: 'Batidora', value: 'Batidora' },
    { id: 'TOSTADOR', label: 'Tostador', value: 'Tostador' },
    { id: 'CAFETERA', label: 'Cafetera', value: 'Cafetera' },
    { id: 'PLANCHA', label: 'Plancha', value: 'Plancha' },
    { id: 'ASPIRADORA', label: 'Aspiradora', value: 'Aspiradora' },
    { id: 'OTROS', label: 'Otros', value: 'Otros' },
  ];