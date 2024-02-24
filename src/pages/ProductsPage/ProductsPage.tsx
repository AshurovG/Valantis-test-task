import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './ProductsPage.module.scss'
import Button from 'components/Button'
import md5 from 'md5';
import CardsList from 'components/CardsList';
import { ProductData } from '../../../types';

const ProductsPage = () => {
    const [currentOffset, setCurrentOffset] = useState(0)
    const [products, setProducts] = useState<ProductData[]>([])

    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() +  1; // Месяцы начинаются с  0, поэтому добавляем  1
    const day = date.getUTCDate();
    const formattedDate = `${year}${month <  10 ? '0' : ''}${month}${day <  10 ? '0' : ''}${day}`

    const getProductsIds = async () => {
        try {
            const response = await axios(`http://api.valantis.store:40000/`, {
            method: 'POST',
            headers: {
                'X-Auth' : md5(`Valantis_${formattedDate}`)
            },
            data: {
                "action": "get_ids",
                "params": {"offset": currentOffset, "limit": 50}
            }
        })
        getProducts(response.data.result)
        } catch (error) {
            throw error
        }
    }
      
    const getProducts = async (ids: string[]) => {

        console.log(ids)
        try {
            const response = await axios(`http://api.valantis.store:40000/`, {
            method: 'POST',
            headers: {
                'X-Auth' : md5(`Valantis_${formattedDate}`)
            },
            data: {
                "action": "get_items",
                "params": {"ids": ids}
            }
        })
        setProducts(response.data.result)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        getProductsIds()
    }, [])

    return (
        <div className={styles.product__page}> 
            <div className={styles['product__page-wrapper']}>
                <h1 className={styles['product__page-title']}>Наши продукты</h1>
                <h3 className={styles['product__page-subtitle']}>Здесь вы можете ознакомиться с продукцией нашей компании! У нас много скидок и новинок</h3>
                {products !== null && <CardsList products={products}/>}
            </div>
            <Button>dfdsf</Button>
        </div>
    )
}

export default ProductsPage