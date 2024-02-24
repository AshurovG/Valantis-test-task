import React, { useState, useEffect } from 'react'
import styles from './FilterBlock.module.scss'
import Input from 'components/Input'
import Button from 'components/Button'

const FilterBlock = () => {
    const [value, setValue] = useState('')
    
    useEffect(() => {
        console.log(value)
    }, [value])
    return (
        <div className={styles.filter}>
            <Input value={value} onChange={setValue}/>
            <Button>Найти</Button>
        </div>
    )
}

export default FilterBlock