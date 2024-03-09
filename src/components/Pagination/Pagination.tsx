import React from 'react'
import styles from './Pagination.module.scss'

type PaginationProps = {
    pageCount: number
    currentPage: number
    onFirstButtonClick?: () => void
    onPrevButtonClick?: () => void
    onNextButtonClick?: () => void
    onLastButtonClick?: () => void
}

const Pagination: React.FC<PaginationProps> = ({pageCount, currentPage, onFirstButtonClick, onPrevButtonClick, onNextButtonClick, onLastButtonClick }) => {
    return (
        <div className={styles.pagination}>
            <div className={styles.pagination__item} onClick={onFirstButtonClick}>
                1 страница
            </div>

            <div 
            className={`${styles.pagination__item} ${currentPage < 1 ? styles['pagination__item-disabled'] : ''}`} 
            onClick={currentPage < 1 ? () => {} : onPrevButtonClick }>
                Предыдущая
            </div>

            <div 
            className={`${styles.pagination__item} ${currentPage + 1 >= pageCount ? styles['pagination__item-disabled'] : ''}`} 
            onClick={currentPage + 1 >= pageCount?  () => {} : onNextButtonClick}>
                Следующая
            </div>

           {pageCount !== 1 && <div className={styles.pagination__item} onClick={onLastButtonClick}>
                {pageCount} страница
            </div>}
        </div>
    )
}

export default Pagination