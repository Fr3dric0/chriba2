
export const headerLinks: Link[] =  [
    {label: 'prosjekter', route: '/projects'},
    {label: 'eiendommer', route: '/estates'},
    {label: 'kontakt oss', route: '#footer'}
];

export interface Link {
    label?: string;
    route: string;
}
