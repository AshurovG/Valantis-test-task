import React from 'react'
import styles from './Card.module.scss'
import { ProductData } from '../../../types'

const Card: React.FC<{product: ProductData}> = ({product}) => {
  return (
    <div className={styles.card}>
        <h4 className={styles.card__title}>{product.product}</h4>
        <p className={styles.card__caption}>{product.id}</p>
        <h5 className={styles.card__brand}>Бренд: {product.brand ? <>{product.brand}</> : <>—</>}</h5>
        <p>{product.price} ₽</p>
    </div>
  )
}

export default Card