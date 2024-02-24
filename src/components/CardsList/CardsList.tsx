import React from 'react'
import styles from './CardsList.module.scss'
import Card from 'components/Card'
import { ProductData } from '../../../types'

const CardsList: React.FC<{products: ProductData[]}> = ({products}) => {
  return (
    <div className={styles.cards}>
        { products.map((product) => 
        <Card product={product}/>)
        }
    </div>
  )
}

export default CardsList