import React from 'react'
import styles from './CardsList.module.scss'
import Card from 'components/Card'
import { ProductData } from '../../../types'
import Skeleton from 'components/Skeleton'

export type CardListProps = {
  products: ProductData[]
  isLoading: boolean
}

const CardsList: React.FC<CardListProps> = ({products, isLoading}) => {
  return (
    <div className={styles.cards}>
        {isLoading ? [...new Array(9)].map((_, index) => <Skeleton key={index} />)
        : products.map((product) => 
          <Card product={product}/>
        )}
    </div>
  )
}

export default CardsList