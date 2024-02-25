// import React, { useState, useEffect } from 'react'
// import styles from './FilterBlock.module.scss'
// import Input from 'components/Input'
// import Button from 'components/Button'
// import MultiDropdown from 'components/MultiDropdown'
// import { OptionData } from '../../../types'

// type FilterBlockProps = {
//     options: OptionData[]
//     brandValue
// }

// const FilterBlock: React.FC<FilterBlockProps> = ({options}) => {
//     const [value, setValue] = useState('')
    
//     useEffect(() => {
//         console.log(value)
//     }, [value])
//     return (
//         <div className={styles.filter}>
//             <Input value={value} onChange={setValue}/>
//             <Button>Найти</Button>
//             <MultiDropdown options={options} value={options[0]}/>
//         </div>
//     )
// }

// export default FilterBlock