export const PHOTO = [
    //ID ห้ามซ้ำ   

    { id: '1', title: 'ข้าวไข่เขียว', image: require('./image/1.png') },
    { id: '2', title: 'ข้าวกะเพรา', image: require('./image/2.png') },
    { id: '3', title: 'สุกี้แห้ง', image: require('./image/3.png') },
    { id: '4', title: 'มาม่าทรงเครื่อง', image: require('./image/4.png') },
]
export const MENU_IMAGES = {
    kao_kai_jeal: require('./image/1.png'),
    kap_padkapaw: require('./image/2.png'),
    suki_dry: require('./image/3.png'),
    mama_mix: require('./image/4.png')
};
export const MOCK_DATA = [
    {
        id: '2',
        title: 'ข้าวกะเพรา',
        price: 50,
        toppings: [
            { id: 't1', name: 'ไข่ดาว', price: 10 },
            { id: 't2', name: 'ไข่เจียว', price: 10 },
            { id: 't3', name: 'พิเศษ', price: 15 },
        ]
    }


]

const MOCK_TOPPINGS_DATA = [
    { id: 't1', name: 'ไข่ดาว', price: 10 },
    { id: 't2', name: 'ไข่เจียว', price: 10 },
    { id: 't3', name: 'หมูกรอบ extra', price: 20 },
    { id: 't4', name: 'เพิ่มข้าว', price: 5 },
];