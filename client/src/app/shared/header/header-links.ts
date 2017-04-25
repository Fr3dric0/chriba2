
export const headerLinks: Link[] =  [
    {label: 'prosjekter', route: '/projects'},
    {label: 'eiendommer', route: '/estates'}
];

export interface Link {
    label?: string;
    route: string;
}
