export type Product = {
id: number;
title: string;
description: string;
category: string;
price: number;
rating: number;
stock: number;
brand: string;
thumbnail:string;
}

export type ProductProps={
id: number;
title: string;
description?: string;
category: string;
price: number;
thumbnail:string;
brand:string;
rating: number;
}