import { dirname } from "path";
import { fileURLToPath } from "url";
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const __dirname= dirname(fileURLToPath(import.meta.url))

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        code: faker.string.nanoid(10),
        status: true,
        price: parseFloat(faker.commerce.price()),
        stock: parseInt(faker.number.int({ min: 20, max: 100 })),
        category: faker.commerce.department(),
        thumbnail: [faker.image.url()],
    };
};

export const generateRandomString = (num) => {
    return [...Array(num)].map(() => {
        const randomNum = ~~(Math.random() * 36);
        return randomNum.toString(36);
    })
        .join('')
        .toUpperCase();
}

export const createHash = password => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds)
}

export const calculateSubtotal = (products) => {
    return products.reduce((total, product) => {
        return total + product.product.price * product.quantity;
    }, 0);
}

export const calculateTax = (subtotal) => {
    const taxRate = 0.05; // Tasa de impuesto del 21%
    return subtotal * taxRate;
}

export{__dirname}